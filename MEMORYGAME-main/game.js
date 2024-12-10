let revealedCount = 0;
let activeCard = null;
let awaitingEndOfMove = false;
let startTime; 
let foundPairs = 0;
let timerInterval;
let elapsedSeconds = 0;

const cardsContainer = document.getElementById('cardsContainer');

const colors = ["aqua", "aquamarine", "crimson", "blue", "dodgerblue", "gold", 
    "greenyellow", "gray", "purple", "orange", "turquoise", "yellow", 
    "white", "silver", "olivegreen"];

function startGame() {

    startTime = Date.now(); 
    const playerName = document.querySelector('.form-control').value;
    const cardCount = parseInt(document.getElementById('cardCountSelect').value, 10);

    if (!playerName || isNaN(cardCount)) {
        alert("אנא מלא את שמך ובחר מספר כרטיסים.");
        return;
    }

    document.getElementById('setup').classList.add('hidden');
    document.getElementById('gameBoard').classList.remove('hidden');
    hello.style.display="block";
    playMusic();
    startTimer();


    const helloDiv = document.getElementById('hello');
    helloDiv.textContent = `${playerName} `; 

    buildCards(cardCount);
}

function resetGame() {
    resetTimer();
    document.querySelector('.form-control').value = '';
    document.getElementById('cardCountSelect').value = 'Number of cards';

    document.getElementById('gameBoard').classList.add('hidden');
    document.getElementById('endMessage').style.display = 'none';
    title.style.display="block";
    document.getElementById('setup').classList.remove('hidden');

    cardsContainer.innerHTML = '';

    revealedCount = 0;
    foundPairs = 0; 
    document.getElementById('foundPairs').textContent = foundPairs;
    activeCard = null;
    awaitingEndOfMove = false;
}

function buildCards(cardCount) {
    cardsContainer.innerHTML = '';

    const colorsPickList = [...colors.slice(0, cardCount / 2), ...colors.slice(0, cardCount / 2)];
    colorsPickList.sort(() => Math.random() - 0.5); 

    for (let i = 0; i < cardCount; i++) {
        const color = colorsPickList[i];
        const card = buildCard(color);
        cardsContainer.appendChild(card);
    }

    revealedCount = 0;
    activeCard = null;
    awaitingEndOfMove = false;
}

function buildCard(color) {
    const element = document.createElement("div");
    element.classList.add("card");
    element.setAttribute("data-color", color);
    element.setAttribute("data-revealed", "false");

    element.addEventListener("click", () => {
        const revealed = element.getAttribute("data-revealed");
        if (awaitingEndOfMove || revealed === "true" || element === activeCard) {
            return;
        }

        element.style.backgroundColor = color;

        if (!activeCard) {
            activeCard = element;
            return;
        }

        const colorToMatch = activeCard.getAttribute("data-color");
        if (colorToMatch === color) {
            activeCard.setAttribute("data-revealed", "true");
            element.setAttribute("data-revealed", "true");

            activeCard = null;
            awaitingEndOfMove = false;
            revealedCount += 2;

            foundPairs++;
            document.getElementById('foundPairs').textContent = foundPairs;

            const cardCount = parseInt(document.getElementById('cardCountSelect').value, 10);
            if (revealedCount === cardCount) {
                stopTimer();
                document.getElementById('gameBoard').classList.add('hidden');
                title.style.display="none";
                hello.style.display="none";
                showEndMessage();
            }
            return;
        }

        awaitingEndOfMove = true;
        setTimeout(() => {
            activeCard.style.backgroundColor = '#0e1101';
            element.style.backgroundColor = '#0e1101';
            activeCard = null;
            awaitingEndOfMove = false;
        }, 800);
    });

    return element;
}

function showEndMessage() {
    const endTime = Date.now(); 
    const elapsedTime = Math.floor((endTime - startTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;

    document.getElementById('elapsedTime').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    const endMessage = document.getElementById('endMessage');
    endMessage.style.display = 'block';
    endMessage.style.animation = 'fadeIn 1s forwards'; 

    const victoryMusic = document.getElementById('victoryMusic');
    victoryMusic.pause();
    victoryMusic.currentTime = 0; 
}
function startTimer() {
    stopTimer(); 
    elapsedSeconds = 0; 
    updateTimerDisplay(); 
    timerInterval = setInterval(() => {
        elapsedSeconds++;
        updateTimerDisplay();
    }, 1000); 
}

function updateTimerDisplay() {
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    document.getElementById('liveTime').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function stopTimer() {
    clearInterval(timerInterval);
}

function resetTimer() {
    stopTimer();
    elapsedSeconds = 0;
    updateTimerDisplay();
}

function playMusic() {
    const victoryMusic = document.getElementById('victoryMusic');
    victoryMusic.currentTime = 0; 
    victoryMusic.play().catch(error => console.error("Error playing music:", error)); 

}
