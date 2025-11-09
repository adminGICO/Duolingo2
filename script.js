// =====================
// Dataset di esempio
// =====================
const flashcards = [
  { frase_completamento: "Quiero una ___ de agua.", soluzione: "botella", traduzione_italiano: "bottiglia" },
  { frase_completamento: "Ella vive en una ___ grande.", soluzione: "casa", traduzione_italiano: "casa" },
  { frase_completamento: "Necesito ___ este libro.", soluzione: "leer", traduzione_italiano: "leggere" }
];

// =====================
// Stato app
// =====================
let queue = flashcards.map((c, i) => ({ ...c, id: i, ease: 2.5, seen: 0 }));
let currentIndex = 0;

// =====================
// Elementi DOM
// =====================
const cardText = document.getElementById("card-text");
const userInput = document.getElementById("user-input");
const solutionArea = document.getElementById("solution-area");
const solutionText = document.getElementById("solution-text");
const translationText = document.getElementById("translation-text");
const ratingArea = document.getElementById("rating-area");
const showSolutionBtn = document.getElementById("show-solution-btn");
const form = document.getElementById("input-form");
const easyBtn = document.getElementById("rating-easy");
const normalBtn = document.getElementById("rating-normal");
const hardBtn = document.getElementById("rating-hard");

// =====================
// Funzioni SRP
// =====================
function getCurrentCard() { return queue[currentIndex]; }

// Render card
function renderCard() {
  const card = getCurrentCard();
  if (!card) return;
  const text = card.frase_completamento.replace("___", "_____");
  cardText.textContent = text;
  userInput.value = "";
  solutionArea.classList.add("hidden");
  ratingArea.classList.add("hidden");
  userInput.focus();
}

// Validazione input
function validateInput(value) {
  if (typeof value !== "string") return { ok: false, reason: "Input non valido" };
  if (value.trim().length === 0) return { ok: false, reason: "Campo vuoto" };
  if (/^\d+$/.test(value)) return { ok: false, reason: "Non inserire numeri" };
  return { ok: true };
}

// Check risposta
function checkAnswer(userValue, solution) {
  return userValue.trim().toLowerCase() === solution.trim().toLowerCase();
}

// Mostra soluzione
function showSolution(card) {
  solutionText.textContent = card.soluzione;
  translationText.textContent = card.traduzione_italiano;
  solutionArea.classList.remove("hidden");
  ratingArea.classList.remove("hidden");
}

// SRS: riordino semplice
function scheduleCard(cardId, rating) {
  const idx = queue.findIndex(c => c.id === cardId);
  if (idx === -1) return;

  const card = queue.splice(idx, 1)[0];

  let offset;
  if (rating === "easy") offset = Math.ceil(queue.length * 0.7) + 1;
  else if (rating === "normal") offset = Math.ceil(queue.length * 0.4) + 1;
  else offset = 1;

  const insertAt = Math.min(offset, queue.length);

  card.seen += 1;
  if (rating === "easy") card.ease = Math.min(3.5, card.ease + 0.5);
  if (rating === "hard") card.ease = Math.max(1.3, card.ease - 0.6);

  queue.splice(insertAt, 0, card);
  currentIndex = 0;
  renderCard();
}

// =====================
// Gestione eventi
// =====================
function handleSubmit(e) {
  e.preventDefault();
  const card = getCurrentCard();
  const val = userInput.value;
  const validation = validateInput(val);

  if (!validation.ok) {
    alert(validation.reason);
    return;
  }

  const correct = checkAnswer(val, card.soluzione);
  showSolution(card);
  if (correct) solutionText.textContent += " ✅";
}

// Event listeners
form.addEventListener("submit", handleSubmit);
showSolutionBtn.addEventListener("click", () => showSolution(getCurrentCard()));
easyBtn.addEventListener("click", () => scheduleCard(getCurrentCard().id, "easy"));
normalBtn.addEventListener("click", () => scheduleCard(getCurrentCard().id, "normal"));
hardBtn.addEventListener("click", () => scheduleCard(getCurrentCard().id, "hard"));

// Init
renderCard();

// =====================
// Test boilerplate
// =====================
console.assert(validateInput("").ok === false, "Test input vuoto fallito");
console.assert(validateInput("123").ok === false, "Test numerico fallito");
console.assert(validateInput("hola").ok === true, "Test stringa valido fallito");
console.assert(checkAnswer("Botella", "botella") === true, "Test checkAnswer case insensitive fallito");
console.log("Basic tests passed");
