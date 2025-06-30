import { saveToStorage, loadFromStorage } from "./storage.js";

const timePerQuestion = 15;
const pointsPerCorrect = 5;
const pointsPerWrong = -2;

let currentQuestionIndex = 0;
let currentScore = 0;
let timer;
let timeLeft = timePerQuestion;
let questions = [];

fetch("data/questions.json")
  .then((res) => res.json())
  .then((data) => {
    questions = data;
    showQuestion();
    startTimer();
  });

function showQuestion() {
  const q = questions[currentQuestionIndex];

  document.getElementById("questionNumber").textContent = `Soal ${currentQuestionIndex + 1}`;

  document.getElementById("questionText").innerHTML = q.question;

  if (q.image) {
    document.getElementById("questionText").innerHTML += `<br><img src="${q.image}" class="img-fluid my-2" style="max-height:200px">`;
  }

  const optionsContainer = document.getElementById("answerOptions");
  optionsContainer.innerHTML = "";

  for (const key in q.options) {
    const btn = document.createElement("button");
    btn.classList.add("btn", "btn-outline-primary", "btn-answer");
    btn.textContent = `${key.toUpperCase()}. ${q.options[key]}`;
    btn.onclick = () => checkAnswer(key);
    optionsContainer.appendChild(btn);
  }

  document.getElementById("timerText").textContent = timePerQuestion;
  document.getElementById("score").textContent = `Skor: ${currentScore}`;
}

function startTimer() {
  timeLeft = timePerQuestion;
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timerText").textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      showFeedback(false, true);
    }
  }, 1000);
}

function checkAnswer(selectedKey) {
  clearInterval(timer);

  const optionsContainer = document.getElementById("answerOptions");
  Array.from(optionsContainer.children).forEach((btn) => {
    btn.disabled = true; // Matikan semua tombol
  });

  const q = questions[currentQuestionIndex];
  const isCorrect = selectedKey === q.answer;

  currentScore += isCorrect ? pointsPerCorrect : pointsPerWrong;
  showFeedback(isCorrect, false);
}

function showFeedback(isCorrect, isTimeout) {
  const feedback = document.getElementById("feedbackBox");
  const feedbackMessage = document.getElementById("feedbackMessage");
  const explanationText = document.getElementById("explanationText");

  feedback.style.display = "block";
  feedbackMessage.textContent = isTimeout ? "⏳ Waktu habis!" : isCorrect ? "✅ Jawaban benar!" : "❌ Jawaban salah.";

  explanationText.textContent = questions[currentQuestionIndex].explanation;

  setTimeout(() => {
    feedback.style.display = "none";
    if (currentQuestionIndex >= questions.length - 1) {
      showResult(); // langsung tampilkan hasil kalau sudah soal terakhir
    } else {
      nextQuestion(); // lanjut soal berikutnya
    }
  }, 4000);
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
    startTimer();
  } else {
    showResult();
  }
}

function showResult() {
  const name = loadFromStorage("userName") || "Mahasiswa";
  const avatar = loadFromStorage("userAvatar") || "img/default.png";
  const score = currentScore;
  clearInterval(timer);

  saveToStorage("userScore", score);

  let scoreHistory = loadFromStorage("scoreHistory") || [];

  const existing = scoreHistory.find((item) => item.name === name);
  const timestamp = new Date().toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  if (existing) {
    if (score > existing.score) {
      existing.score = score;
      existing.time = timestamp;
    }
  } else {
    scoreHistory.push({ name, avatar, score, time: timestamp });
  }

  saveToStorage("scoreHistory", scoreHistory);
  window.location.replace("result.html");
}
