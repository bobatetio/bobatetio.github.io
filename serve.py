#!/usr/bin/env python3
import json
import os
import urllib.error
import urllib.parse
import urllib.request
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


API_URL = "https://api.anthropic.com/v1/messages"
MODEL = "claude-sonnet-4-6"


def json_response(handler, status, payload):
    data = json.dumps(payload).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(data)))
    handler.send_header("Cache-Control", "no-store")
    handler.end_headers()
    handler.wfile.write(data)


def system_prompt(context):
    side = context.get("side", "hotel")
    side_label = "creator app" if side == "creator" else "hotel app"
    return (
        "You are Ukreate AI inside the " + side_label + ". This side is a hard fact; never ask what side you are on.\n"
        "Return valid JSON only. Never use markdown or code fences.\n"
        "Your job is to understand a request and respond with exactly one of these kinds: clarify, search, action, nav, unknown.\n"
        "Default to resolving. Only ask a follow-up when something essential is genuinely missing or ambiguous enough to block the next step.\n"
        "If the request is already actionable, resolve immediately to search or action; do not ask a generic clarifying question.\n"
        "When you do need a follow-up, keep it to one short warm lead-in in message, then provide 2-3 tappable options in options, plus an optional freeTextPlaceholder for a small Something else input.\n"
        "Search and nav require the user to click the button before anything changes. Actions that create or modify data must include confirmTitle, confirmBody, and confirmCta so the UI can show a confirm step first.\n"
        "Only use the seeded cities, stays, creators, dates, styles, vibes, budgets, hotels, and actions in the provided context. Do not invent anything that is not in the context.\n"
        "Return this JSON shape: {kind,message,buttonLabel?,cardTitle?,cardBody?,cardHint?,confirmTitle?,confirmBody?,confirmCta?,view?,patch?,prefillView?,prefill?,slots?,options?,freeTextPlaceholder?,freeTextLabel?,freeTextButton?}."
    )


def resolve_side(body):
    context = body.get("context") or {}
    side = body.get("side") or body.get("role") or context.get("side") or "hotel"
    return "creator" if str(side).lower() == "creator" else "hotel"


def compact_turns(turns):
    out = []
    for turn in turns or []:
      role = turn.get("role")
      content = turn.get("content")
      if role not in ("user", "assistant") or not content:
          continue
      out.append({"role": role, "content": [{"type": "text", "text": str(content)}]})
    return out


def build_payload(body):
    context = dict(body.get("context") or {})
    side = resolve_side(body)
    context["side"] = side
    turns = compact_turns(body.get("turns"))
    current = str(body.get("input") or "").strip()
    if current:
        turns.append({"role": "user", "content": [{"type": "text", "text": current}]})
    summary = {
        "role": side,
        "side": side,
        "slots": body.get("slots") or {},
        "context": context,
    }
    return {
        "model": MODEL,
        "max_tokens": 700,
        "temperature": 0.2,
        "system": system_prompt(context) + "\n\nSeeded context:\n" + json.dumps(summary, indent=2, sort_keys=True),
        "messages": turns,
    }


def option(label, value=None):
    return {"label": label, "value": value or label}


def clarify_response(message, options=None, placeholder=None):
    payload = {"ok": True, "kind": "clarify", "message": message}
    if options:
        payload["options"] = options
    if placeholder:
        payload["freeTextPlaceholder"] = placeholder
    payload["freeTextLabel"] = "Something else"
    payload["freeTextButton"] = "Send"
    return payload


def search_response(message, button_label, card_title, card_body, view, patch, chips=None):
    payload = {
        "ok": True,
        "kind": "search",
        "message": message,
        "buttonLabel": button_label,
        "cardTitle": card_title,
        "cardBody": card_body,
        "view": view,
        "patch": patch,
    }
    if chips:
        payload["chips"] = chips
    return payload


def action_response(message, button_label, card_title, card_body, confirm_title, confirm_body, confirm_cta, prefill_view, prefill):
    return {
        "ok": True,
        "kind": "action",
        "message": message,
        "buttonLabel": button_label,
        "cardTitle": card_title,
        "cardBody": card_body,
        "confirmTitle": confirm_title,
        "confirmBody": confirm_body,
        "confirmCta": confirm_cta,
        "prefillView": prefill_view,
        "prefill": prefill,
    }


def mock_response(body):
    """Generate realistic mock responses for UI testing."""
    role = resolve_side(body)
    turns = body.get("turns", [])
    current = str(body.get("input", "")).strip().lower()
    context = body.get("context") or {}
    slots = body.get("slots", {})
    cities = context.get("cities") or ["London", "Manchester", "Edinburgh"]

    # Track conversation depth to simulate multi-turn
    turn_count = len([t for t in turns if t.get("role") == "user"])

    # Hotel-side mocks
    if role == "hotel":
        if "find me creators" in current or ("creators" in current and ("wellness" in current or "design" in current or "food" in current or "lifestyle" in current)):
            tags = [tag for tag in ["wellness", "design", "food", "lifestyle", "travel"] if tag in current]
            return search_response(
                "Here are creators that fit your brief.",
                "View creators",
                "Creators for your stay",
                "Filtering creators who match your request and your property style.",
                "creators",
                {"q": " ".join(tags) if tags else current.replace("find me", "").strip(), "niche": tags[0] if tags else "all"},
                [t.title() for t in tags] if tags else ["Creators"]
            )
        if "empty room" in current and "tuesday" in current:
            return action_response(
                "Got it — I can turn Tuesday into a hosted stay.",
                "Create hosted stay",
                "Create a hosted stay",
                "This opens the host flow for Tuesday and lets you confirm before anything is published.",
                "Create this hosted stay?",
                "I’ll prepare the hosted stay setup for Tuesday on this property.",
                "Create stay",
                "host",
                {"date": "", "nights": "1", "inc": "Room only"}
            )
        if "uk" in current or "united kingdom" in current:
            return clarify_response(
                "Nice — which city in the UK should I use?",
                [option("London"), option("Another city")],
                "Something else…"
            )
        if turn_count == 0 and ("creator" in current or "host" in current or "launch" in current):
            return action_response(
                "Great — I can set this up as a hosted stay.",
                "Create hosted stay",
                "Create a hosted stay",
                "This will open the host flow with your room and date ready to review.",
                "Create this hosted stay?",
                "I’ll prepare the hosted stay setup for your property.",
                "Create stay",
                "host",
                {"date": "", "nights": "1", "inc": "Room only"}
            )
        return clarify_response(
            "I’d love to help — what city should I focus on?",
            [option(c) for c in cities[:3]],
            "Something else…"
        )

    # Creator-side mocks
    else:
        niche_words = [word for word in ["food", "travel", "lifestyle", "photography", "video", "wellness", "design"] if word in current]
        if ("find me hotels" in current or "hotels" in current or "stay" in current) and niche_words:
            return search_response(
                "Here are hotels that match your brief.",
                "See Matches",
                "Collaboration Opportunities",
                "Hotels looking for creators just like you. Check out these stays and reach out to the ones that excite you.",
                "stays",
                {"q": " ".join(niche_words), "style": niche_words[0], "saved": False},
                [w.title() for w in niche_words]
            )
        if "lisbon" in current and not niche_words:
            return clarify_response(
                "Lisbon is a great fit — what content do you make?",
                [option("Food"), option("Travel"), option("Lifestyle")],
                "Something else…"
            )
        if "travel" in current and not niche_words:
            return clarify_response(
                "Nice — what kind of content are you looking to shoot?",
                [option("Food"), option("Travel"), option("Lifestyle")],
                "Something else…"
            )
        if niche_words:
            return search_response(
                "Perfect — I’ve got good matches for that niche.",
                "See Matches",
                "Collaboration Opportunities",
                "Hotels looking for creators with your style.",
                "stays",
                {"q": " ".join(niche_words), "style": niche_words[0], "saved": False},
                [w.title() for w in niche_words]
            )
        return clarify_response(
            "Tell me where you’re headed.",
            [option(c) for c in cities[:3]],
            "Something else…"
        )


def call_anthropic(body):
    """Check for real API key first; fall back to mock responses."""
    api_key = os.environ.get("ANTHROPIC_API_KEY") or os.environ.get("ANTHROPIC_KEY")
    
    # If API key is available, use the real API
    if api_key:
        payload = build_payload(body)
        req = urllib.request.Request(
            API_URL,
            data=json.dumps(payload).encode("utf-8"),
            method="POST",
            headers={
                "content-type": "application/json",
                "anthropic-version": "2023-06-01",
                "x-api-key": api_key,
                "x-ukreate-role": str(body.get("role") or ""),
            },
        )
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                data = json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as err:
            detail = err.read().decode("utf-8", "replace")
            return None, {"ok": False, "error": "Anthropic request failed.", "detail": detail}
        except Exception as err:
            return None, {"ok": False, "error": "Anthropic request failed.", "detail": str(err)}

        text = ""
        for block in data.get("content", []):
            if block.get("type") == "text":
                text += block.get("text", "")
        try:
            parsed = json.loads(text)
        except Exception as err:
            return None, {"ok": False, "error": "AI response was not valid JSON.", "detail": str(err), "raw": text[:500]}
        parsed["ok"] = True
        return parsed, None
    
    # No key: fall back to canned responses. FLAGGED, because a silent fallback is
    # indistinguishable from a dumb box — which is exactly how this looked before.
    response = mock_response(body)
    response["mock"] = True
    response["mockReason"] = "ANTHROPIC_API_KEY is not set in this server's environment."
    return response, None


class UkreateHandler(SimpleHTTPRequestHandler):
    def do_OPTIONS(self):
        if self.path == "/api/ukask":
            self.send_response(HTTPStatus.NO_CONTENT)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Headers", "content-type")
            self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
            self.end_headers()
            return
        super().do_OPTIONS()

    def do_POST(self):
        if self.path != "/api/ukask":
            self.send_error(HTTPStatus.NOT_FOUND)
            return
        length = int(self.headers.get("content-length") or "0")
        try:
            body = json.loads(self.rfile.read(length).decode("utf-8")) if length else {}
        except Exception:
            json_response(self, HTTPStatus.BAD_REQUEST, {"ok": False, "error": "Invalid JSON request."})
            return
        response, err = call_anthropic(body)
        if err is not None:
            json_response(self, HTTPStatus.OK, err)
            return
        json_response(self, HTTPStatus.OK, response)

    def end_headers(self):
        if self.path == "/api/ukask":
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Headers", "content-type")
        super().end_headers()


def main():
    port = int(os.environ.get("PORT", "8080"))
    server = ThreadingHTTPServer(("0.0.0.0", port), UkreateHandler)
    server.serve_forever()


if __name__ == "__main__":
    main()
