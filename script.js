/*
function validateInput(value){
if (typeof value !== 'string') return { ok: false, reason: 'Tipo non valido' };
if (value.length === 0) return { ok: false, reason: 'Input vuoto' };
if (/^\d+$/.test(value)) return { ok: false, reason: 'Input numerico' };
return { ok: true };
}

// Confronta la risposta utente con la soluzione (case-insensitive, trim)
function checkAnswer(userValue, solution){
if (typeof userValue !== 'string' || typeof solution !== 'string') return false;
return userValue.trim().toLowerCase() === solution.trim().toLowerCase();
}

/* =====================
Funzioni: mostrare soluzione e valutazione SRS
===================== */

// Mostra la soluzione e la traduzione (solo manipolazione DOM)
function showSolution(card){
solutionText.textContent = card.soluzione;
translationText.textContent = card.traduzione_italiano;
solutionArea.classList.remove('hidden');
ratingArea.classList.remove('hidden');
}

// Applica una semplice regola SRS: reinserisce la card nella coda in posizione dipendente dalla valutazione
// SRP: questa funzione decide *solo* la nuova posizione e aggiorna gli attributi della card
function scheduleCard(cardId, rating){
// trova indice attuale della card nella coda (potrebbe cambiare se skip o altre operazioni)
const idx = queue.findIndex(c => c.id === cardId);
if (idx === -1) return;

const card = queue.splice(idx,1)[0]; // rimuove la card attuale dalla coda

// semplificazione: usare offset per reinserimento
// Facile -> sposta più in fondo (offset alto)
// Normale -> sposta a metà strada
// Difficile -> lascia nelle prime posizioni (offset basso)
let offset;
if (rating === 'easy') offset = Math.ceil(queue.length * 0.7) + 1;
else if (rating === 'normal') offset = Math.ceil(queue.length * 0.4) + 1;
else offset = 1; // hard

const insertAt = Math.min(Math.max(0, currentIndex + offset), queue.length);

// Aggiorna metadati: seen e ease (semplice heuristica)
card.seen = (card.seen || 0) + 1;
if (rating === 'easy') card.ease = Math.min(3.5, (card.ease || 2.5) + 0.5);
if (rating === 'hard') card.ease = Math.max(1.3, (card.ease || 2.5) - 0.6);

queue.splice(insertAt, 0, card);
}

/* =====================
Funzioni: flusso utente
===================== */

// Gestisce il submit del form: validazione e confronto. Non esegue scheduling.
function handleSubmit(event){
event.preventDefault();
const card = getCurrentCard();
if (!card) return;

const userVal = getUserInputValue();
const validation = validateInput(userVal);
if (!validation.ok){
// messaggio semplice (accessibility): user-facing
alert(validation.reason);
return;
}

const correct = checkAnswer(userVal, card.soluzione);
if (correct){
// mostra soluzione, ma segnala che era corretta
showSolution
