// --- STATE ---
const WINNING_SCORE = 10;
let players = [];
let currentPlayerIndex = 0;

// --- DOM ELEMENTS ---
const screens = {
    setup: document.getElementById('setup-screen'),
    game: document.getElementById('game-screen'),
    win: document.getElementById('win-screen')
};

function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
}

// --- INITIALIZATION ---
function startGame() {
    // Get names from inputs
    const p1 = document.getElementById('p1').value || "Player 1";
    const p2 = document.getElementById('p2').value || "Player 2";
    const p3 = document.getElementById('p3').value || "Player 3";
    const p4 = document.getElementById('p4').value || "Player 4";

    // Initialize players with 0 score
    players = [
        { name: p1, score: 0 },
        { name: p2, score: 0 },
        { name: p3, score: 0 },
        { name: p4, score: 0 }
    ];

    currentPlayerIndex = 0;
    
    renderScoreboard();
    updateActivePlayerDisplay();
    showScreen('game');
}

// --- CORE GAMEPLAY ---
function submitRoll(rollValue) {
    const player = players[currentPlayerIndex];
    let msg = "";

    // GAME LOGIC: Even = +1, Odd = -1
    const isEven = rollValue % 2 === 0;

    if (isEven) {
        player.score++;
        msg = `${player.name} rolled ${rollValue} (EVEN) -> Gained 1 Chip!`;
    } else {
        // Decrease score, but prevent going below 0
        if (player.score > 0) {
            player.score--;
            msg = `${player.name} rolled ${rollValue} (ODD) -> Lost 1 Chip.`;
        } else {
            msg = `${player.name} rolled ${rollValue} (ODD) -> Stayed at 0.`;
        }
    }

    // Update UI
    document.getElementById('log-display').innerText = msg;
    renderScoreboard();

    // Check Win Condition
    if (player.score >= WINNING_SCORE) {
        handleWin(player);
    } else {
        // Next Turn
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        updateActivePlayerDisplay();
    }
}

// --- UI UPDATES ---
function renderScoreboard() {
    const board = document.getElementById('scoreboard');
    board.innerHTML = '';

    players.forEach((p, index) => {
        const div = document.createElement('div');
        div.className = `player-card ${index === currentPlayerIndex ? 'active-turn' : ''}`;
        div.innerHTML = `
            <div class="p-name">${p.name}</div>
            <span class="score">${p.score}</span>
        `;
        board.appendChild(div);
    });
}

function updateActivePlayerDisplay() {
    // Highlight the current player in the control panel
    const p = players[currentPlayerIndex];
    document.getElementById('active-player-name').innerText = p.name;
    
    // Re-render scoreboard to move the highlight border
    renderScoreboard();
}

function handleWin(player) {
    document.getElementById('winner-name').innerText = player.name;
    showScreen('win');
}
