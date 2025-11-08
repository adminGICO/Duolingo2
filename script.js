// Flashcard App Script — versione corretta
// ======================================

// Stato globale
let queue = [];
let currentIndex = 0;

// DOM elements
const input = document.getElementById("answerInput");
const solutionArea = document.getElementById("solutionArea");
const solutionText = document.getElementById("solutionText");
const translationText = document.getElementById("translationText");
const ratingArea = document.getElementById("ratingButtons");
const form = document.getElementById("flashForm");

/* =====================
Validazione input e confronto risposte
===================== */
function validateInput(value) {
  if (typeof value !== "string") return { ok: false, reason: "Tipo non valido" };
  if (value.length === 0) return { ok: false, reason: "Input vuoto" };
  if (/^\d+$/.test(value)) return { ok: false, reason: "Input numerico" };
  return { ok: true };
}

function checkAnswer(userValue, solution) {
  if (typeof userValue !== "string" || typeof solution !== "string") return false;
  return userValue.trim().toLowerCase() === solution.trim().toLowerCase();
}

/* =====================
SRS — scheduling carta
===================== */
function scheduleCard(cardId, rating) {
  const idx = queue.findIndex((c) => c.id === cardId);
  if (idx === -1) return;

  const card = queue.splice(idx, 1)[0];
  let offset;

  if (rating === "easy") offset = Math.ceil(queue.length * 0.7) + 1;
  else if (rating === "normal") offset = Math.ceil(queue.length * 0.4) + 1;
  else offset = 1;

  const insertAt = Math.min(Math.max(0, currentIndex + offset), queue.length);

  card.seen = (card.seen || 0) + 1;
  if (rating === "easy") card.ease = Math.min(3.5, (card.ease || 2.5) + 0.5);
  if (rating === "hard") card.ease = Math.max(1.3, (card.ease || 2.5) - 0.6);

  queue.splice(insertAt, 0, card);
}

/* =====================
UI: mostra soluzione
===================== */
function showSolution(card) {
  solutionText.textContent = card.soluzione;
  translationText.textContent = card.traduzione_italiano;
  solutionArea.classList.remove("hidden");
  ratingArea.classList.remove("
