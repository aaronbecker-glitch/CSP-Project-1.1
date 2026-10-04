const questions = [
  {
    question: "How has your day been so far?",
    answers: ["Good", "Bad"],
    // A question can have one correct answer or several correct answers.
    correctAnswers: "Good",
  },
  {
    question: "If your day was bad, then how can you make it better?",
    answers: [
      "By being kind",
      "By saying kind words and doing kind actions",
      "Looking at it from a positive way",
    ],
    correctAnswers: [
      "By being kind",
      "By saying kind words and doing kind actions",
      "Looking at it from a positive way",
    ],
  },
  {
    question: "What are some benefits to having a good day?",
    answers: ["Increased productivity", "Better mood", "Improved relationships"],
    correctAnswers: ["Increased productivity", "Better mood", "Improved relationships"],
  },
  {
    question: "What are some ways to stay positive during difficult times?",
    answers: ["Focus on what you can control", "Seek support from others", "Practice gratitude"],
    correctAnswers: ["Focus on what you can control", "Seek support from others", "Practice gratitude"],
  },
  {
    question: "If you have a bad day what is one thing you can do to make it better?",
    answers: ["Don't do anything", "Do something you enjoy", "Do something you don't enjoy"],
    correctAnswers: ["Do something you enjoy"],
  },
];

// Find the page elements by their HTML IDs so the script can update them.
// The # selector means "find the element whose ID matches this name."
const questionElement = document.querySelector("#question");
const answersElement = document.querySelector("#answers");
const feedbackElement = document.querySelector("#feedback");
const nextButton = document.querySelector("#next-button");
const gameMenu = document.querySelector("#game-menu");
const quizLink = document.querySelector('a[href="#quiz"]');
const quiz = document.querySelector("#quiz");
const reactionGameLink = document.querySelector('a[href="#reaction-game"]');
const reactionGame = document.querySelector("#reaction-game");
const quizMenuButton = document.querySelector("#quiz-menu-button");
const reactionMenuButton = document.querySelector("#reaction-menu-button");
const reactionButton = document.querySelector("#reaction-button");
const reactionInstructions = document.querySelector("#reaction-instructions");
const reactionTime = document.querySelector("#reaction-time");

let currentQuestionIndex = 0;
let reactionState = "idle";
let reactionTimer;
let reactionStartTime;

function showQuestion() {
  const currentQuestion = questions[currentQuestionIndex];

  questionElement.textContent = currentQuestion.question;
  answersElement.replaceChildren();
  feedbackElement.textContent = "";
  nextButton.disabled = true;

  for (let i = 0; i < currentQuestion.answers.length; i++) {
    const answer = currentQuestion.answers[i];
    const answerButton = document.createElement("button");

    answerButton.textContent = answer;
    answerButton.addEventListener("click", function () {
      // Convert one correct answer to a list so both question formats work.
      const correctAnswers = Array.isArray(currentQuestion.correctAnswers)
        ? currentQuestion.correctAnswers
        : [currentQuestion.correctAnswers];

      if (correctAnswers.includes(answer)) {
        feedbackElement.textContent = "Correct! Well done, brave knight.";
        nextButton.disabled = false;
      } else {
        feedbackElement.textContent = "Not quite—try another answer.";
      }
    });

    answersElement.append(answerButton);
  }
}

function resetQuiz() {
  currentQuestionIndex = 0;
  nextButton.hidden = false;
  showQuestion();
}

function resetReactionGame() {
  window.clearTimeout(reactionTimer);
  reactionState = "idle";
  reactionButton.classList.remove("reaction-ready");
  reactionButton.textContent = "Start reaction test";
  reactionInstructions.textContent =
    "Press start, then click only when the button turns green.";
  reactionTime.textContent = "";
}

// These menu links switch screens instead of scrolling to the section.
quizLink.addEventListener("click", function (event) {
  event.preventDefault();
  gameMenu.hidden = true;
  reactionGame.hidden = true;
  quiz.hidden = false;
  resetQuiz();
});

reactionGameLink.addEventListener("click", function (event) {
  event.preventDefault();
  gameMenu.hidden = true;
  quiz.hidden = true;
  reactionGame.hidden = false;
  resetReactionGame();
});

nextButton.addEventListener("click", function () {
  currentQuestionIndex = currentQuestionIndex + 1;

  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    questionElement.textContent = "You finished the quiz!";
    answersElement.replaceChildren();
    feedbackElement.textContent = "";
    nextButton.hidden = true;
  }
});

// Going back to the menu also cancels any reaction timer still in progress.
quizMenuButton.addEventListener("click", function () {
  quiz.hidden = true;
  gameMenu.hidden = false;
});

reactionMenuButton.addEventListener("click", function () {
  resetReactionGame();
  reactionGame.hidden = true;
  gameMenu.hidden = false;
});

// The player starts waiting; clicking too early or after the green signal
// changes the state and gives the appropriate result.
reactionButton.addEventListener("click", function () {
  if (reactionState === "idle" || reactionState === "early" || reactionState === "complete") {
    resetReactionGame();
    reactionState = "waiting";
    reactionInstructions.textContent = "Wait for the button to turn green…";
    reactionButton.textContent = "Wait…";

    const delay = 1500 + Math.random() * 2500;
    reactionTimer = window.setTimeout(function () {
      reactionState = "ready";
      reactionStartTime = performance.now();
      reactionButton.textContent = "CLICK NOW!";
      reactionButton.classList.add("reaction-ready");
      reactionInstructions.textContent = "Click the green button as fast as you can!";
    }, delay);
  } else if (reactionState === "waiting") {
    window.clearTimeout(reactionTimer);
    reactionState = "early";
    reactionInstructions.textContent = "Too soon! Wait until the button turns green.";
    reactionButton.textContent = "Try again";
  } else if (reactionState === "ready") {
    const elapsedMilliseconds = Math.round(performance.now() - reactionStartTime);
    reactionState = "complete";
    reactionButton.classList.remove("reaction-ready");
    reactionButton.textContent = "Try again";
    reactionInstructions.textContent = "Nice reaction!";
    reactionTime.textContent = `Your reaction time was ${elapsedMilliseconds} ms.`;
  }
});