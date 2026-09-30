import { tasks } from './tasks.js';
import { askGemini } from './gemini.js';

const $ = s => document.querySelector(s);
const main = $('#main');

// ---------- tiny DOM helper (uses textContent, so AI output can't inject HTML) ----------
function el(tag, props = {}, ...kids) {
  const n = Object.assign(document.createElement(tag), props);
  for (const k of kids.flat()) n.append(k);
  return n;
}

// ---------- components ----------
function renderNav(current) {
  $('#task-nav').replaceChildren(...tasks.map(t =>
    el('a', { href: `#/task/${t.id}`, textContent: t.id, title: t.title, ariaLabel: `Task ${t.id}: ${t.title}`,
      ...(t.id === current ? { ariaCurrent: 'page' } : {}) })));
}
function renderPager(current) {
  const prev = tasks[current - 2], next = tasks[current];
  $('#pager').replaceChildren(
    prev ? el('a', { href: `#/task/${prev.id}`, textContent: `Previous: ${prev.title}` }) : el('span'),
    next ? el('a', { href: `#/task/${next.id}`, textContent: `Next: ${next.title}` }) : el('span'));
}
function taskCard(t) {
  return el('li', {}, el('article', { className: 'project-card' },
    el('div', { className: 'project-card__top' },
      el('span', { className: 'project-number', textContent: String(t.id).padStart(2, '0'), ariaHidden: 'true' }),
      el('span', { className: 'project-label', textContent: 'PROJECT' })),
    el('h2', {}, el('a', { href: `#/task/${t.id}`, textContent: t.title })),
    el('p', { className: 'project-card__description', textContent: t.objective }),
    el('a', { className: 'project-card__link', href: `#/task/${t.id}`, ariaLabel: `Open project ${t.id}: ${t.title}` },
      el('span', { textContent: 'Open project' }), el('span', { className: 'arrow', textContent: '↗', ariaHidden: 'true' }))));
}
function taskDetail(t) {
  return el('article', { className: 'task-page', ariaLabelledby: 'task-title' },
    el('a', { className: 'back-link', href: '#/', textContent: '← All projects' }),
    el('header', { className: 'task-heading' },
      el('p', { className: 'eyebrow', textContent: `PROJECT ${String(t.id).padStart(2, '0')} / 10` }),
      el('h1', { id: 'task-title', textContent: t.title }),
      el('p', { className: 'task-intro', textContent: t.objective })),
    el('div', { className: 'task-layout' },
      el('div', { className: 'task-guide' },
        el('section', { className: 'info-section' },
          el('p', { className: 'section-index', textContent: '01 / LEARNING OUTCOME' }),
          el('h2', { textContent: 'What you will learn' }),
          el('p', { textContent: t.outcome })),
        el('section', { className: 'info-section' },
          el('p', { className: 'section-index', textContent: '02 / TOOLKIT' }),
          el('h2', { textContent: 'Tools and materials' }),
          el('ul', { className: 'tools' }, t.tools.map(x => el('li', { textContent: x })))),
        el('section', { className: 'info-section' },
          el('p', { className: 'section-index', textContent: '03 / PROCESS' }),
          el('h2', { textContent: 'Build steps' }),
          el('ol', { className: 'proc' }, t.steps.map((x, i) => el('li', {},
            el('span', { className: 'step-marker', textContent: String(i + 1).padStart(2, '0'), ariaHidden: 'true' }),
            el('span', { textContent: x })))))),
      demoPanel(t)));
}

// ---------- Gemini demo panel ----------
function demoPanel(t) {
  const d = t.demo;
  const input = el('textarea', { id: `in-${t.id}`, placeholder: d.placeholder });
  const out = el('div', { className: 'out', ariaLive: 'polite' });
  const btn = el('button', { type: 'button', textContent: 'Generate with Gemini' });
  btn.onclick = async () => {
    if (!input.value.trim()) { out.replaceChildren(el('p', { className: 'err', textContent: 'Enter some text first.' })); return; }
    btn.disabled = true; out.textContent = 'Working...';
    try {
      const result = await askGemini(d.prompt(input.value.trim()), { json: d.json });
      out.replaceChildren(renderers[d.render](result));
    } catch (e) {
      out.replaceChildren(el('p', { className: 'err', role: 'alert', textContent: e.message }));
    } finally { btn.disabled = false; }
  };
  return el('section', { className: 'demo-panel', ariaLabelledby: 'demo-title' },
    el('p', { className: 'section-index', textContent: 'WORKSPACE / LIVE DEMO' }),
    el('h2', { id: 'demo-title', textContent: 'Try the tool' }),
    el('p', { className: 'demo-intro', textContent: 'Enter a topic or source text to see a working example.' }),
    el('label', { htmlFor: input.id, textContent: d.label }), input,
    el('div', { className: 'demo-actions' }, btn), out);
}

// ---------- renderers for AI output ----------
const renderers = {
  text: s => el('pre', { textContent: s, style: 'white-space:pre-wrap;font:inherit' }),
  slides(list) {
    let i = 0;
    const box = el('div', { className: 'card' });
    const show = () => box.replaceChildren(
      el('h3', { textContent: `${i + 1}/${list.length}  ${list[i].title}` }),
      el('ul', {}, list[i].bullets.map(b => el('li', { textContent: b }))),
      el('button', { className: 'alt', textContent: 'Previous', disabled: i === 0, onclick: () => { i--; show(); } }),
      ' ', el('button', { className: 'alt', textContent: 'Next', disabled: i === list.length - 1, onclick: () => { i++; show(); } }));
    show(); return box;
  },
  quiz(qs) {
    let score = 0, done = 0;
    const status = el('p', { textContent: 'Score: 0', ariaLive: 'polite' });
    const wrap = el('div', { className: 'quiz' }, status);
    qs.forEach((q, qi) => {
      const opts = q.options.map((o, oi) => el('button', { type: 'button', className: 'opt', textContent: o }));
      opts.forEach((b, oi) => b.onclick = () => {
        if (b.dataset.done) return;
        opts.forEach(x => x.dataset.done = 1);
        b.classList.add(oi === q.answer ? 'ok' : 'bad'); opts[q.answer].classList.add('ok');
        if (oi === q.answer) score++; done++;
        status.textContent = done === qs.length ? `Final score: ${score}/${qs.length}` : `Score: ${score}`;
      });
      wrap.append(el('fieldset', {}, el('legend', { textContent: `${qi + 1}. ${q.question}` }), ...opts));
    });
    return wrap;
  },
  cards: list => el('div', { className: 'grid' }, list.map(c => {
    const card = el('li', {}, el('button', { className: 'alt card', textContent: c.question, ariaLabel: 'Flip card' }));
    let flipped = false;
    card.firstChild.onclick = e => { flipped = !flipped; e.currentTarget.textContent = flipped ? c.answer : c.question; };
    return card;
  })),
  plan(rows) {
    const t = el('table', { className: 'card' }, el('tr', {}, ['Day', 'Slot', 'Subject'].map(h => el('th', { scope: 'col', textContent: h }))));
    rows.forEach(r => t.append(el('tr', {}, [r.day, r.slot, r.subject].map(v => el('td', { textContent: v })))));
    return el('div', { style: 'overflow-x:auto' }, t);
  }
};

// ---------- hash router ----------
function route() {
  const m = location.hash.match(/^#\/task\/(\d+)$/);
  const t = m && tasks.find(x => x.id === +m[1]);
  if (t) {
    document.title = `Task ${t.id}: ${t.title}`;
    main.replaceChildren(taskDetail(t));
    renderNav(t.id); renderPager(t.id);
  } else {
    document.title = 'Study Tools Workshop | Ten Classroom Projects';
    main.replaceChildren(
      el('section', { className: 'landing-intro', ariaLabelledby: 'home-title' },
        el('div', { className: 'landing-copy' },
          el('p', { className: 'eyebrow', textContent: 'STUDY TOOLS WORKSHOP' }),
          el('h1', { id: 'home-title', textContent: 'Make something useful for the way you learn.' }),
          el('p', { className: 'landing-description', textContent: 'Ten guided classroom projects for building practical tools, from a study planner to a quiz maker. Choose a project and work through it at your own pace.' }),
          el('a', { className: 'primary-link', href: '#/task/1' },
            el('span', { textContent: 'Start with project 01' }), el('span', { className: 'arrow', textContent: '↗', ariaHidden: 'true' }))),
        el('aside', { className: 'workshop-note', ariaLabel: 'Featured projects' },
          el('p', { className: 'workshop-note__label', textContent: 'INSIDE THE WORKSHOP' }),
          ...tasks.slice(0, 3).map(t => el('a', { className: 'featured-project', href: `#/task/${t.id}` },
            el('span', { className: 'featured-project__number', textContent: String(t.id).padStart(2, '0') }),
            el('span', { className: 'featured-project__title', textContent: t.title }),
            el('span', { className: 'arrow', textContent: '↗', ariaHidden: 'true' }))))),
      el('section', { className: 'catalogue', ariaLabelledby: 'catalogue-title' },
        el('div', { className: 'catalogue-heading' },
          el('div', {},
            el('p', { className: 'eyebrow', textContent: 'THE PROJECT INDEX' }),
            el('h2', { id: 'catalogue-title', textContent: 'Choose a project' })),
          el('p', { className: 'catalogue-count', textContent: '01 TO 10' })),
        el('ul', { className: 'project-grid' }, tasks.map(taskCard))));
    renderNav(0); $('#pager').replaceChildren(el('a', { href: '#/task/1', textContent: 'Start with project 01' }));
  }
  main.focus();
}
addEventListener('hashchange', route);
route();