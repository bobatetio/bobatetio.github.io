/* Ukreate global AI input.
   One shared header control, role-aware, multi-turn, and backed by a same-origin
   API endpoint so the browser never has to call Anthropic directly. */
(function () {
  var hotelRoot = document.querySelector('[data-ukapp]');
  var creatorRoot = document.querySelector('[data-ukc]');
  if (hotelRoot) initHotel(hotelRoot);
  else if (creatorRoot) initCreator(creatorRoot);

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c];
    });
  }

  function uniq(list) {
    var seen = {}, out = [];
    list.forEach(function (item) {
      if (item == null || seen[item]) return;
      seen[item] = 1;
      out.push(item);
    });
    return out;
  }

  function textList(items, limit) {
    var out = (items || []).slice(0, limit || items.length).join(', ');
    return out || 'nothing yet';
  }

  function svg(name) {
    return '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      (((window.UKICONS || {})[name]) || '') + '</svg>';
  }

  function matchMediaReduced() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  /* the shared icon set, so this button draws the same mark as anywhere else */
  function icon(name) {
    var g = (window.UKICONS || {})[name];
    return g ? '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' + g + '</svg>' : '';
  }

  function mountAsk(container, opts) {
    var reduced = matchMediaReduced();
    var state = {
      open: false,
      pending: false,
      turns: [],
      slots: {},
      result: null,
      followup: null,
      brain: null,
      pendingSlot: null,
      picked: [],
      handoff: null,
      focused: false
    };
    var placeholders = opts.placeholders && opts.placeholders.length ? opts.placeholders : ['Ask Ukreate anything'];
    /* Start somewhere different each visit, then keep moving while the field is
       idle, so the bar shows what it can do rather than one fixed example. */
    var phIx = Math.floor(Math.random() * placeholders.length);

    container.innerHTML =
      '<div class="ukAskShell" data-ask-shell>' +
        '<div class="ukAsk_frame" data-ask-frame>' +
          /* The blob does not move. Closed, it sits beside the field; open, the
             field is gone and the same blob sits beside the name — because this
             stopped being a text field the moment it was used. */
          '<span class="ukAsk_icon" aria-hidden="true" data-lottie-src="/assets/lottie/ai-input.json?v=5"></span>' +
          '<p class="ukAsk_title" data-ask-title>Ukreate AI</p>' +
          '<label class="ukSrOnly" for="ukAskInput">' + esc(opts.inputLabel) + '</label>' +
          '<input class="ukAsk_i" id="ukAskInput" type="text" autocomplete="off" spellcheck="false" ' +
            'placeholder="' + esc(placeholders[phIx]) + '" aria-haspopup="dialog" aria-expanded="false" ' +
            'aria-controls="ukAskPanel" aria-describedby="ukAskHint" data-ask-q>' +
          '<button class="ukAsk_go" type="button" data-ask-go id="ukAskHint" ' +
            'aria-controls="ukAskPanel" aria-expanded="false">' +
            '<span class="ukAsk_goIco" aria-hidden="true">' + icon('sparkles') + '</span>' +
            '<span data-ask-hint-text>Ask AI</span></button>' +
          /* where Ask AI was: the only control the card needs once it is open */
          '<button class="ukAsk_x" type="button" data-ask-close aria-label="Close Ukreate AI">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
            'stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
        '</div>' +
        /* The panel is part of the field, not a popup over it: the same surface
           grows downward, so the bar visibly becomes the conversation. */
        '<div class="ukAsk_panel" id="ukAskPanel" role="dialog" aria-label="' + esc(opts.buttonLabel) + '" data-ask-panel hidden>' +
          '<div class="ukAsk_thread" data-ask-thread aria-live="polite" aria-atomic="false"></div>' +
          '<div class="ukAsk_result" data-ask-result hidden></div>' +
          /* typing stays possible, at the foot, but the chips above are the path */
          '<div class="ukAsk_foot">' +
            '<label class="ukSrOnly" for="ukAskMore">Type instead</label>' +
            '<input class="ukAsk_more_i" id="ukAskMore" type="text" autocomplete="off" ' +
              'placeholder="Or type something else" data-ask-more>' +
            '<button class="ukAsk_moreGo" type="button" data-ask-more-go aria-label="Send">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
              'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
              '<path d="M5 12h13M12 5l7 7-7 7"/></svg></button>' +
          '</div>' +
        '</div>' +
      '</div>';

    var shell = container.querySelector('[data-ask-shell]');
    var frame = container.querySelector('[data-ask-frame]');
    var input = container.querySelector('[data-ask-q]');
    var panel = container.querySelector('[data-ask-panel]');
    var thread = container.querySelector('[data-ask-thread]');
    var result = container.querySelector('[data-ask-result]');
    var hintText = container.querySelector('[data-ask-hint-text]');
    var go = container.querySelector('[data-ask-go]');

    /* Rotates only while the field is empty, unfocused and closed — never pull a
       word out from under someone who is reading or typing it. */
    var phTimer = null;
    function nextPlaceholder() {
      if (placeholders.length < 2) return;
      if (state.open || state.focused || input.value.trim()) return;
      phIx = (phIx + 1) % placeholders.length;
      /* Swap only once it is fully invisible, so the two lines never cross-fade
         through each other. Read from the --ph-fade token rather than the
         element's own transition-duration: the transition is declared on
         ::placeholder, which getComputedStyle on the input does not report. */
      var raw = getComputedStyle(input).getPropertyValue('--ph-fade').trim();
      var ms = raw.indexOf('ms') > -1 ? parseFloat(raw) : parseFloat(raw) * 1000;
      if (!ms || isNaN(ms)) ms = 900;
      input.classList.add('is-phFade');
      setTimeout(function () {
        input.setAttribute('placeholder', placeholders[phIx]);
        input.classList.remove('is-phFade');
      }, ms + 60);
    }
    if (placeholders.length > 1 && !reduced) phTimer = setInterval(nextPlaceholder, 6500);
    /* the panel opens from this button, not from typing */
    if (go) go.addEventListener('click', function () { submit(); input.focus(); });

    function setFrameState() {
      shell.classList.toggle('is-open', state.open);
      shell.classList.toggle('is-pending', state.pending);
      shell.classList.toggle('is-typing', !!input.value.trim());
      shell.classList.toggle('is-reduced', reduced);
      input.setAttribute('aria-expanded', state.open ? 'true' : 'false');
      if (hintText) hintText.textContent = state.pending ? 'Thinking' : 'Ask AI';
      if (go) { go.disabled = state.pending; go.setAttribute('aria-expanded', state.open ? 'true' : 'false'); }
    }

    function openPanel() {
      state.open = true;
      panel.hidden = false;
      setFrameState();
    }

    function closePanel() {
      state.open = false;
      state.pending = false;
      state.followup = null;
      state.brain = null;
      state.pendingSlot = null;
      state.handoff = null;
      panel.hidden = true;
      result.hidden = true;
      result.innerHTML = '';
      input.setAttribute('aria-expanded', 'false');
      setFrameState();
    }

    function addBubble(kind, text) {
      var wrap = document.createElement('div');
      wrap.className = 'ukAsk_item ukAsk_item--' + kind;
      if (kind === 'uk') {
        var meta = document.createElement('div');
        meta.className = 'ukAsk_meta';
        meta.textContent = 'Ukreate AI';
        wrap.appendChild(meta);
      }
      var bubble = document.createElement('div');
      bubble.className = 'ukAsk_turn ukAsk_turn--' + kind;
      bubble.textContent = text;
      wrap.appendChild(bubble);
      /* Newest at the bottom — and scrolled AFTER layout. Scrolling on the same
         tick measured a thread that had not yet been squeezed by the chips about
         to render under it, so the newest line ended up hidden behind them. */
      thread.appendChild(wrap);
      toBottom();
      return wrap;
    }

    /* two frames: one for this element, one for whatever the result block does to
       the space underneath it */
    function toBottom() {
      requestAnimationFrame(function () {
        thread.scrollTop = thread.scrollHeight;
        requestAnimationFrame(function () { thread.scrollTop = thread.scrollHeight; });
      });
    }

    function clearResult() {
      shell.classList.remove('is-chips');
      result.hidden = true;
      result.innerHTML = '';
      state.result = null;
      state.followup = null;
    }

    function submitText(text) {
      var next = String(text == null ? '' : text).trim();
      if (!next || state.pending) return;
      input.value = next;
      submit(next);
    }

    function renderFollowup(r) {
      result.hidden = false;
      result.innerHTML = '';
      state.followup = r;
      var card = document.createElement('div');
      card.className = 'ukAsk_followup';
      var lead = document.createElement('p');
      lead.className = 'ukAsk_followupLead';
      lead.textContent = r.message || 'I’d love to help.';
      card.appendChild(lead);

      var optsList = document.createElement('div');
      optsList.className = 'ukAsk_options';
      (r.options || []).slice(0, 3).forEach(function (opt) {
        var label = typeof opt === 'string' ? opt : (opt.label || opt.value || '');
        var value = typeof opt === 'string' ? opt : (opt.value || opt.label || '');
        if (!label || !value) return;
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ukAsk_option';
        btn.textContent = label;
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          submitText(value);
        });
        optsList.appendChild(btn);
      });
      if (optsList.childNodes.length) card.appendChild(optsList);

      var more = document.createElement('div');
      more.className = 'ukAsk_more';
      var moreInput = document.createElement('input');
      moreInput.type = 'text';
      moreInput.className = 'ukAsk_moreInput';
      moreInput.placeholder = r.freeTextPlaceholder || 'Something else…';
      moreInput.setAttribute('aria-label', r.freeTextLabel || 'Something else');
      var moreBtn = document.createElement('button');
      moreBtn.type = 'button';
      moreBtn.className = 'ukAsk_moreBtn ukBtn';
      moreBtn.textContent = r.freeTextButton || 'Send';
      function sendMore() {
        var val = moreInput.value.trim();
        if (!val) return;
        submitText(val);
      }
      moreInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          sendMore();
        }
      });
      moreBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        sendMore();
      });
      more.appendChild(moreInput);
      more.appendChild(moreBtn);
      card.appendChild(more);
      result.appendChild(card);
      moreInput.focus();
    }

    function renderActionCard(r) {
      result.hidden = false;
      result.innerHTML = '';
      state.followup = null;
      var card = document.createElement('div');
      card.className = 'ukAsk_card';
      var title = document.createElement('p');
      title.className = 'ukAsk_cardT';
      title.textContent = r.cardTitle || r.message || 'Ready when you are.';
      card.appendChild(title);
      if (r.cardBody || r.message) {
        var body = document.createElement('p');
        body.className = 'ukAsk_cardP';
        body.textContent = r.cardBody || r.message;
        card.appendChild(body);
      }
      if (r.kind === 'search' && r.chips && r.chips.length) {
        var chips = document.createElement('div');
        chips.className = 'ukAsk_chips';
        r.chips.forEach(function (chip) {
          var span = document.createElement('span');
          span.className = 'ukAsk_chip';
          span.textContent = chip;
          chips.appendChild(span);
        });
        card.appendChild(chips);
      }
      if (r.kind === 'action' && r.cardHint) {
        var hint = document.createElement('p');
        hint.className = 'ukAsk_cardHint';
        hint.textContent = r.cardHint;
        card.appendChild(hint);
      }
      var actions = document.createElement('div');
      actions.className = 'ukAsk_actions';
      var button = document.createElement('button');
      button.className = 'ukBtn';
      button.type = 'button';
      button.textContent = r.buttonLabel || r.cta || 'Continue';
      button.addEventListener('click', function (e) {
        e.stopPropagation();
        if (r.kind === 'action') {
          showConfirm(r);
          return;
        }
        if (r.kind === 'search' && opts.onSearch) {
          opts.onSearch(r);
          closePanel();
          input.focus();
          return;
        }
        if (r.kind === 'nav' && opts.onNav) {
          opts.onNav(r);
          closePanel();
          return;
        }
      });
      actions.appendChild(button);
      card.appendChild(actions);
      result.appendChild(card);
    }

    function showConfirm(r) {
      result.hidden = false;
      result.innerHTML = '';
      var confirm = document.createElement('div');
      confirm.className = 'ukAsk_confirm';
      confirm.setAttribute('role', 'status');
      var title = document.createElement('p');
      title.className = 'ukAsk_confirmT';
      title.textContent = r.confirmTitle || 'Confirm this step?';
      confirm.appendChild(title);
      var body = document.createElement('p');
      body.className = 'ukAsk_confirmP';
      body.textContent = r.confirmBody || 'Nothing will happen until you confirm it.';
      confirm.appendChild(body);
      var row = document.createElement('div');
      row.className = 'ukAsk_confirmRow';
      var cancel = document.createElement('button');
      cancel.type = 'button';
      cancel.className = 'ukGhost';
      cancel.textContent = 'Not quite right';
      cancel.addEventListener('click', function (e) {
        e.stopPropagation();
        clearResult();
        addBubble('uk', 'No problem — tell me what to change.');
        input.focus();
      });
      var cta = document.createElement('button');
      cta.type = 'button';
      cta.className = 'ukBtn';
      cta.textContent = r.confirmCta || 'Confirm';
      cta.addEventListener('click', function (e) {
        e.stopPropagation();
        if (opts.onAction) opts.onAction(r);
        closePanel();
      });
      row.appendChild(cancel);
      row.appendChild(cta);
      confirm.appendChild(row);
      result.appendChild(confirm);
    }

    function showFailure(message) {
      result.hidden = false;
      result.innerHTML = '';
      var card = document.createElement('div');
      card.className = 'ukAsk_card ukAsk_card--plain';
      var title = document.createElement('p');
      title.className = 'ukAsk_cardT ukAsk_fail';
      title.textContent = 'Ukreate AI could not be reached.';
      card.appendChild(title);
      var body = document.createElement('p');
      body.className = 'ukAsk_cardP';
      body.textContent = message;
      card.appendChild(body);
      result.appendChild(card);
    }

    function parseResponse(data) {
      if (!data || data.ok === false) throw new Error(data && data.error ? data.error : 'Bad response');
      if (!data.kind || !data.message) throw new Error('Incomplete AI response');
      return data;
    }

    function submit(forcedText) {
      var text = String(forcedText == null ? input.value : forcedText).trim();
      if (!text || state.pending) return;
      openPanel();
      state.pending = true;
      clearResult();
      addBubble('you', text);
      addBubble('thinking', 'Ukreate is checking that...');
      state.pendingText = text;
      input.value = '';
      setFrameState();

      var payload = {
        role: opts.role,
        side: opts.role,
        input: text,
        slots: state.slots,
        turns: state.turns,
        context: Object.assign({ side: opts.role }, opts.context || {})
      };

      /* The local engine answers. The server endpoint is still called first, but
         only its REAL answers are used: with no API key it returns canned strings
         flagged {mock:true}, and taking those was what made this bar look broken. */
      fetch('/api/ukask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (res) { return res.json(); }).then(function (data) {
        if (data && data.ok && !data.mock) return data;          // a real model answered
        throw new Error('no-model');
      }).catch(function () {
        return null;                                             // fall through to the engine
      }).then(function (data) {
        state.pending = false;
        var thought = thread.querySelector('.ukAsk_turn--thinking');
        if (thought && thought.parentNode) thought.parentNode.remove();

        if (data) {
          var r = parseResponse(data);
          state.slots = Object.assign({}, state.slots, r.slots || {});
          state.turns.push({ role: 'user', content: text });
          state.turns.push({ role: 'assistant', content: r.message });
          state.result = r;
          addBubble('uk', r.message);
          if (r.kind === 'clarify') {
            if (r.options && r.options.length) renderFollowup(r); else clearResult();
            return;
          }
          renderActionCard(r);
          setFrameState();
          return;
        }

        var B = window.UKASKBRAIN;
        if (!B) {
          showFailure('Try again in a moment, or use the normal filters and views if you need to move faster.');
          setFrameState();
          return;
        }
        var turn = state.brain
          ? B.answer(opts.role, state.brain, state.pendingSlot, [text])
          : B.start(opts.role, text);
        renderTurn(turn);
      });
    }

    /* One question, one set of chips, one answer — and nothing offered until every
       slot is filled. A half-specified search is a worse answer than a question. */
    function renderTurn(turn) {
      state.brain = turn.state;
      state.turns.push({ role: 'assistant', content: turn.message });
      if (turn.message) addBubble('uk', turn.message);

      if (turn.kind === 'ask') {
        state.pendingSlot = turn.slot;
        state.picked = [];
        addBubble('uk', turn.question);
        renderChips(turn);
        return;
      }
      state.pendingSlot = null;
      renderSummary(turn);
    }

    function renderChips(turn) {
      result.hidden = false;
      result.innerHTML =
        '<div class="ukAsk_chips" role="group" aria-label="' + esc(turn.question) + '">' +
          turn.chips.map(function (c) {
            return '<button class="ukAsk_chip" type="button" data-chip="' + esc(c) + '" ' +
              'aria-pressed="false">' + esc(c) + '</button>';
          }).join('') +
        '</div>' +
        (turn.multi
          ? '<div class="ukAsk_chipsAct">' +
              '<p class="ukAsk_chipsHint">Pick as many as apply</p>' +
              '<button class="ukBtn ukBtn--sm" type="button" data-chip-done disabled>Continue</button>' +
            '</div>'
          : '');
      result.dataset.multi = turn.multi ? '1' : '';
      toBottom();
      /* Chips ARE the input for this question. Leaving a text field open beside
         them offers two ways to answer the same thing, and the typed one is the
         one that can go wrong. */
      shell.classList.add('is-chips');
    }

    function renderSummary(turn) {
      shell.classList.remove('is-chips');
      result.hidden = false;
      toBottom();
      result.innerHTML =
        '<div class="ukAsk_card">' +
          '<p class="ukAsk_cardK">Ready to open</p>' +
          '<dl class="ukAsk_sum">' + turn.summary.map(function (r) {
            return '<div><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd></div>';
          }).join('') + '</dl>' +
          '<p class="ukAsk_cardP">Nothing is created yet \u2014 this opens the form filled in.</p>' +
          '<button class="ukBtn" type="button" data-ask-go2>' + esc(turn.cta) + '</button>' +
        '</div>';
      state.handoff = turn;
    }

    result.addEventListener('click', function (e) {
      var chip = e.target.closest('[data-chip]');
      if (chip) {
        var multi = result.dataset.multi === '1';
        if (!multi) { pickChips([chip.dataset.chip]); return; }
        var on = chip.getAttribute('aria-pressed') === 'true';
        chip.setAttribute('aria-pressed', String(!on));
        chip.classList.toggle('is-on', !on);
        state.picked = [].slice.call(result.querySelectorAll('[data-chip][aria-pressed="true"]'))
          .map(function (b) { return b.dataset.chip; });
        var done = result.querySelector('[data-chip-done]');
        if (done) done.disabled = !state.picked.length;
        return;
      }
      if (e.target.closest('[data-chip-done]')) { pickChips(state.picked); return; }
      if (e.target.closest('[data-ask-go2]')) {
        var h = state.handoff;
        if (!h) return;
        closePanel();
        var pre = window.UKPREFILL || window.UKCPREFILL;
        if (pre) pre(h.view, h.prefill);
        return;
      }
    });

    function pickChips(values) {
      if (!values || !values.length) return;
      var B = window.UKASKBRAIN;
      addBubble('you', values.join(', '));
      clearResult();
      renderTurn(B.answer(opts.role, state.brain, state.pendingSlot, values));
    }

    var more = container.querySelector('[data-ask-more]');
    var moreGo = container.querySelector('[data-ask-more-go]');
    function sendMore() {
      var v = more && more.value.trim();
      if (!v) return;
      more.value = '';
      addBubble('you', v);
      clearResult();
      var B = window.UKASKBRAIN;
      if (!B) return;
      renderTurn(state.brain && state.pendingSlot
        ? B.answer(opts.role, state.brain, state.pendingSlot, [v])
        : B.start(opts.role, v));
    }
    if (moreGo) moreGo.addEventListener('click', sendMore);
    if (more) more.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); sendMore(); }
    });

    var closeX = container.querySelector('[data-ask-close]');
    if (closeX) closeX.addEventListener('click', function () { closePanel(); });

    input.addEventListener('focus', function () {
      state.focused = true;
      setFrameState();
    });
    input.addEventListener('blur', function () {
      state.focused = false;
      setFrameState();
    });
    input.addEventListener('input', function () {
      setFrameState();
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        submit();
      }
    });

    /* "Clicked outside" has to mean outside — and a node this panel has just
       REMOVED is not outside, it is gone. Answering a chip rebuilds the result
       block, so by the time the click reaches document the chip is detached,
       container.contains() is false, and the panel closed itself on every answer.
       An element no longer in the document cannot have been an outside click. */
    document.addEventListener('click', function (e) {
      if (!state.open) return;
      var t = e.target;
      if (!t || !t.isConnected) return;          // detached: it came from inside
      if (!container.contains(t)) closePanel();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && state.open) {
        closePanel();
        input.blur();
      }
      if (e.key === '/' && !state.open) {
        var t = e.target;
        var typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
        if (!typing) {
          e.preventDefault();
          input.focus();
        }
      }
    });

    window.addEventListener('beforeunload', closePanel);
    setFrameState();
  }

  function hotelContext() {
    var D = window.UK;
    var stayCities = uniq(D.stays.map(function (s) { return (s.city || '').split(',')[0].trim(); }).filter(Boolean));
    var stayRegions = uniq(D.stays.map(function (s) { return (s.city || '').split(',')[1] ? (s.city.split(',')[1] || '').trim() : ''; }).filter(Boolean));
    return {
      side: 'hotel',
      property: D.property.name,
      city: D.property.city,
      views: ['creators', 'host', 'collabs'],
      actionVocabulary: ['Check creators', 'Create hosted stay', 'Open collaboration'],
      cities: stayCities.length ? stayCities : [D.property.city],
      regions: stayRegions,
      stays: D.stays.map(function (s) { return { id: s.id, hotel: s.t, title: s.t, dates: s.from + ' to ' + s.to, type: s.type, status: s.status, nights: s.nights }; }),
      creators: D.creators.map(function (c) { return { id: c.id, name: c.n, type: c.type, city: c.loc, platforms: c.p.join(', ') }; }),
      packages: D.packages.map(function (p) { return p.id + ': ' + p.n + ' — ' + p.why; })
    };
  }

  function creatorContext() {
    var D = window.UKC;
    return {
      side: 'creator',
      person: D.me.n,
      city: D.me.city,
      views: ['pitch', 'stays', 'collabs', 'apply'],
      actionVocabulary: ['Check hotels', 'Start pitch', 'Open application'],
      cities: uniq(D.stays.map(function (s) { return s.city.split(',')[0].trim(); })),
      regions: uniq(D.stays.map(function (s) { return (s.city.split(',')[1] || '').trim(); }).filter(Boolean)),
      stays: D.stays.map(function (s) { return { id: s.id, hotel: s.hotel, city: s.city, style: s.style, vibe: s.vibe, budget: s.budget }; }),
      creator: { id: D.me.h, name: D.me.n, niche: D.me.niche, platforms: D.me.plats.map(function (p) { return p.k; }).join(', ') }
    };
  }

  function initHotel(root) {
    var D = window.UK;
    var slot = root.querySelector('[data-ask]');
    if (!slot || !D) return;
    mountAsk(slot, {
      role: 'hotel',
      buttonLabel: 'Ask Ukreate',
      inputLabel: 'Ask Ukreate what you need',
      placeholders: [
        'I need creators for a weekend launch...',
        'I have an empty room next Tuesday...',
        'Find me creators who fit wellness and design...'
      ],
      context: hotelContext(),
      onSearch: function (r) { window.UKPREFILL(r.view, r.patch); },
      onNav: function (r) { window.UKPREFILL(r.view, r.patch); },
      onAction: function (r) { window.UKPREFILL(r.prefillView, r.prefill); }
    });
  }

  function initCreator(root) {
    var D = window.UKC;
    var slot = root.querySelector('[data-ask]');
    if (!slot || !D) return;
    mountAsk(slot, {
      role: 'creator',
      buttonLabel: 'Ask Ukreate',
      inputLabel: 'Ask Ukreate what you are after',
      placeholders: [
        'I am traveling to Lisbon next month...',
        'Find me hotels that want food content...',
        'Which stays fit wellness and slow travel?'
      ],
      context: creatorContext(),
      onSearch: function (r) { window.UKCPREFILL(r.view, r.patch); },
      onNav: function (r) { window.UKCPREFILL(r.view, r.patch); },
      onAction: function (r) { window.UKCPREFILL(r.prefillView, r.prefill); }
    });
  }
})();
