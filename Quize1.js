document.addEventListener("DOMContentLoaded", () => {
    const questionText = document.getElementById("question-text");
    const optionsContainer = document.querySelector(".quiz-options");
    const nextButton = document.getElementById("next-button");
    const playAgainButton = document.getElementById("play-again");
    const quizScore = document.querySelector(".quiz-score");
    const resultContainer = document.getElementById("result");
    const feedbackMessage = document.createElement("p"); // Message for wrong answers
    feedbackMessage.classList.add("feedback-message");
    
    let currentQuestionIndex = 0;
    let score = 0;
    let questions = [];

    // ✅ Fetch quiz questions from OpenTDB API
    function fetchQuestions() {
        fetch("https://opentdb.com/api.php?amount=5&type=multiple")
            .then(response => response.json())
            .then(data => {
                questions = data.results.map(q => ({
                    question: decodeHTML(q.question),
                    correctAnswer: decodeHTML(q.correct_answer),
                    options: shuffle([...q.incorrect_answers.map(a => decodeHTML(a)), decodeHTML(q.correct_answer)])
                }));
                score = 0;
                quizScore.textContent = "0";
                currentQuestionIndex = 0;
                resultContainer.style.display = "none";
                playAgainButton.style.display = "none";
                showQuestion();
            })
            .catch(error => {
                console.error("Error fetching quiz data:", error);
                questionText.textContent = "Failed to load questions. Try again.";
            });
    }

    // ✅ Display the current question
    function showQuestion() {
        if (currentQuestionIndex >= questions.length) {
            showResult();
            return;
        }

        const questionData = questions[currentQuestionIndex];
        questionText.textContent = questionData.question;
        optionsContainer.innerHTML = "";
        feedbackMessage.textContent = ""; // Clear previous feedback message

        questionData.options.forEach(option => {
            const li = document.createElement("li");
            li.textContent = option;
            li.addEventListener("click", () => selectAnswer(li, option === questionData.correctAnswer));
            optionsContainer.appendChild(li);
        });

        optionsContainer.appendChild(feedbackMessage); // Append feedback message below options
        nextButton.style.display = "none";
    }

    // ✅ Handle answer selection
    function selectAnswer(selectedOption, isCorrect) {
        document.querySelectorAll(".quiz-options li").forEach(li => li.classList.add("selected"));
        selectedOption.classList.add(isCorrect ? "correct" : "wrong");

        if (isCorrect) {
            score++;
            quizScore.textContent = score;
            feedbackMessage.textContent = "Correct! 🎉";
            feedbackMessage.style.color = "green";
        } else {
            feedbackMessage.textContent = "Wrong Answer! ❌";
            feedbackMessage.style.color = "red";
        }

        nextButton.style.display = "block";
    }

    // ✅ Move to the next question
    nextButton.addEventListener("click", () => {
        currentQuestionIndex++;
        showQuestion();
    });

    // ✅ Show quiz result
    function showResult() {
        resultContainer.innerHTML = `<h2>Quiz Completed!</h2><p>Your Score: ${score}/${questions.length}</p>`;
        resultContainer.style.display = "block";
        nextButton.style.display = "none";
        playAgainButton.style.display = "block";
    }

    // ✅ Play again button functionality
    playAgainButton.addEventListener("click", fetchQuestions);

    // ✅ Utility function: Shuffle array
    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    // ✅ Utility function: Decode HTML entities
    function decodeHTML(text) {
        const txt = document.createElement("textarea");
        txt.innerHTML = text;
        return txt.value;
    }

    // 🚀 Fetch initial questions on page load
    fetchQuestions();
});
