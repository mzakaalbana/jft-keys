// assets/js/app.js
// Logika kuis untuk LATIHAN — memakai window.BANK dari assets/js/bank.js

(function () {
  const stage = document.getElementById("quizStage");
  const progEl = document.getElementById("quizProgress");
  const btnPrev = document.getElementById("btnPrev");
  const btnNext = document.getElementById("btnNext");
  const btnSubmit = document.getElementById("btnSubmit");
  const resultCard = document.getElementById("resultCard");
  const scoreLine = document.getElementById("scoreLine");
  const answerReview = document.getElementById("answerReview");

  if (!stage || !progEl) return; // halaman lain, biarkan diam

  const BANK = Array.isArray(window.BANK) ? window.BANK : [];
  const TOTAL = BANK.length;

  // State kuis
  let idx = 0; // index soal aktif (0-based)
  // jawaban pengguna: { [questionId]: "A" | "B" | "C" }
  const answers = loadAnswers() || {};

  // ---- boot ----
  if (TOTAL === 0) {
    stage.innerHTML = `
      <div class="empty">
        <p>Data soal belum tersedia.</p>
        <p class="muted">Pastikan <code>assets/js/bank.js</code> berisi array <code>window.BANK</code>.</p>
      </div>`;
    progEl.textContent = "Soal 0 / 0";
    toggleNavButtons();
    return;
  }

  // Render awal
  renderQuestion();
  updateProgress();
  toggleNavButtons();

  // Event handlers
  btnPrev?.addEventListener("click", () => {
    if (idx > 0) {
      idx--;
      renderQuestion();
      updateProgress();
      toggleNavButtons();
    }
  });

  btnNext?.addEventListener("click", () => {
    if (idx < TOTAL - 1) {
      idx++;
      renderQuestion();
      updateProgress();
      toggleNavButtons();
    }
  });

  btnSubmit?.addEventListener("click", onSubmit);

  // ---- Functions ----

  function renderQuestion() {
    const q = BANK[idx];
    if (!q) return;

    const selectedKey = answers[q.id] || null;

    stage.innerHTML = `
      <article class="card" style="border:none; background:transparent; padding:0;">
        <h2 style="margin:.25rem 0 .6rem; font-size:1.05rem">Soal ${idx + 1}.</h2>
        <p class="muted" style="margin:.2rem 0 .9rem">${escapeHTML(q.prompt || "")}</p>

        <div class="options">
          ${q.choices
            .map((ch, i) => {
              const key = ch.key || String.fromCharCode(65 + i);
              const checked = selectedKey === key ? "checked" : "";
              return `
                <label class="option">
                  <input type="radio" name="opt" value="${key}" ${checked} />
                  <div class="opt-text">
                    <div>${escapeHTML(ch.t || "")}</div>
                  </div>
                </label>
              `;
            })
            .join("")}
        </div>
      </article>
    `;

    // pasang listener untuk radio
    stage.querySelectorAll('input[name="opt"]').forEach((input) => {
      input.addEventListener("change", (ev) => {
        const chosen = ev.target.value;
        answers[q.id] = chosen;
        saveAnswers(answers);
        toggleNavButtons();
      });
    });
  }

  function updateProgress() {
    progEl.textContent = `Soal ${idx + 1} / ${TOTAL}`;
  }

  function toggleNavButtons() {
    btnPrev.disabled = idx === 0;
    btnNext.hidden = idx >= TOTAL - 1;
    // Tampilkan tombol Submit hanya di soal terakhir
    btnSubmit.hidden = !(idx === TOTAL - 1);

    // (opsional) nonaktifkan Next jika belum pilih jawaban untuk soal ini
    const q = BANK[idx];
    if (!q) return;
    const selected = answers[q.id];
    // Kalau mau Next bebas tanpa jawab, ubah ke: btnNext.disabled = false;
    btnNext.disabled = idx < TOTAL - 1 && !selected;
    // Submit juga harus sudah ada jawaban terakhir
    btnSubmit.disabled = idx === TOTAL - 1 && !selected;
  }

  function onSubmit() {
    const { score, details } = evaluate();
    // tampilkan hasil
    scoreLine.textContent = `Skor: ${score} / ${TOTAL}`;

    // ringkasan jawaban
    answerReview.innerHTML = details
      .map((row) => {
        const status = row.correct ? "✅ Benar" : "❌ Salah";
        const your = row.userKey ? row.userKey : "—";
        return `
          <div style="border-top:1px solid var(--line); padding:.7rem 0;">
            <div style="font-weight:600; margin-bottom:.25rem;">${row.no}. ${escapeHTML(row.prompt)}</div>
            <div class="muted" style="margin-bottom:.35rem">${status}</div>
            <div><b>Jawaban kamu:</b> ${escapeHTML(labelOf(row.userKey, row.choices))}</div>
            <div><b>Kunci benar:</b> ${escapeHTML(labelOf(row.correctKey, row.choices))}</div>
          </div>
        `;
      })
      .join("");

    // sembunyikan kartu kuis, tampilkan hasil
    document.querySelector(".quiz-card")?.classList.add("hidden");
    resultCard?.classList.remove("hidden");
    // simpan skor terakhir
    try {
      localStorage.setItem("jft-keys:lastScore", JSON.stringify({ score, total: TOTAL, ts: Date.now() }));
    } catch {}
    // scroll ke hasil
    resultCard?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function evaluate() {
    let score = 0;
    const details = BANK.map((q, i) => {
      const userKey = answers[q.id] || null;
      const ok = userKey === q.correctKey;
      if (ok) score++;
      return {
        no: i + 1,
        id: q.id,
        prompt: q.prompt || "",
        userKey,
        correctKey: q.correctKey,
        correct: ok,
        choices: q.choices || [],
      };
    });
    return { score, details };
  }

  function labelOf(key, choices) {
    if (!key) return "";
    const found = (choices || []).find((c) => c.key === key);
    return found ? found.t || "" : key;
  }

  // ---- simple persistence ----
  function saveAnswers(obj) {
    try {
      localStorage.setItem("jft-keys:answers", JSON.stringify(obj || {}));
    } catch {}
  }
  function loadAnswers() {
    try {
      const raw = localStorage.getItem("jft-keys:answers");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  // ---- utils ----
  function escapeHTML(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }
})();