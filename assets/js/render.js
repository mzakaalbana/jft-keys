/* Rendering helpers (mode-agnostic) */

export function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

export function skeletonLines(n = 3) {
  const wrap = document.createElement('div');
  wrap.className = 'skeleton';
  for (let i = 0; i < n; i++) {
    const w = i % 3 === 0 ? 'w-80' : i % 3 === 1 ? 'w-90' : 'w-70';
    wrap.append(el(`<div class="skeleton-line ${w}"></div>`));
  }
  return wrap;
}

export function renderLearnList(target, items) {
  target.innerHTML = '';
  if (!items || !items.length) {
    target.append(el(`
      <div class="card">
        <div class="muted">Belum ada data untuk sesi ini. Tambahkan item di <code>data/jft-keys.json</code>.</div>
      </div>
    `));
    return;
  }
  const grid = target;
  items.forEach((it, idx) => {
    const jp = it.jp ?? '';
    const hira = it.hira ? ` (${it.hira})` : '';
    const idn = it.id ?? it.idn ?? it.ind ?? '';
    grid.append(el(`
      <div class="item" tabindex="0" aria-label="Item ${idx+1}">
        <div class="jp">${escapeHtml(jp)}<span class="hira">${escapeHtml(hira)}</span></div>
        <div class="idn">${escapeHtml(idn)}</div>
      </div>
    `));
  });
}

export function renderQuestionCard(stage, q, idx, total, selectedKey = null, locked = false) {
  stage.innerHTML = '';
  if (!q) { stage.append(el(`<div class="card"><div class="muted">Tidak ada soal.</div></div>`)); return; }
  const card = el(`<div class="card"></div>`);
  card.append(el(`<div class="badge">Soal ${idx+1} / ${total}</div>`));
  card.append(el(`<div class="q-title" style="margin-top:.4rem">${escapeHtml(q.prompt || q.jp || '')}</div>`));

  const list = el(`<div class="options"></div>`);
  (q.choices || []).forEach((c,i) => {
    const id = `opt-${idx}-${i}`;
    const checked = selectedKey === c.key ? 'checked' : '';
    const disabled = locked ? 'disabled' : '';
    list.append(el(`
      <label class="option" for="${id}">
        <input type="radio" name="q-${idx}" id="${id}" value="${c.key}" ${checked} ${disabled} />
        <div class="text">${escapeHtml(c.t)}</div>
      </label>
    `));
  });
  card.append(list);
  stage.append(card);
}

export function renderReview(container, questions, answers) {
  container.innerHTML = '';
  if (!questions?.length) { container.textContent = '—'; return; }
  questions.forEach((q, i) => {
    const ans = answers[i];
    const correct = q.correctKey;
    const user = ans ?? '(kosong)';
    const ok = user === correct;
    container.append(el(`
      <div class="item" style="border-color:${ok?'#2f6b53':'#6b2f3b'}">
        <div class="jp">${escapeHtml(q.prompt)}</div>
        <div class="idn">Jawabanmu: <b>${escapeHtml(user)}</b> • Kunci: <b>${escapeHtml(correct)}</b></div>
      </div>
    `));
  });
}

export function escapeHtml(s=''){
  return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}