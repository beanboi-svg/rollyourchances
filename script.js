// --- STATE ---
const WINNING_SCORE = 4;
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

// --- SETUP LOGIC (NEW) ---
// Run this immediately to generate default inputs
window.onload = function() {
    renderInputs(4); // Default to 4 players
};

function renderInputs(count) {
    const container = document.getElementById('players-container');
    const currentCount = container.children.length;
    
    // If we need more, add them
    if (count > currentCount) {
        for (let i = currentCount + 1; i <= count; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'player-input-field';
            input.placeholder = `Player ${i} Name`;
            input.value = `Player ${i}`; // Default text
            container.appendChild(input);
        }
    } 
    // If we need fewer, remove them
    else if (count < currentCount) {
        while (container.children.length > count) {
            container.removeChild(container.lastChild);
        }
    }
    
    updateCountDisplay();
}

function addPlayerInput() {
    const container = document.getElementById('players-container');
    // Limit to 10 players max to prevent UI breaking
    if (container.children.length < 10) {
        renderInputs(container.children.length + 1);
    }
}

function removePlayerInput() {
    const container = document.getElementById('players-container');
    // Minimum 2 players
    if (container.children.length > 2) {
        renderInputs(container.children.length - 1);
    }
}

function updateCountDisplay() {
    const count = document.getElementById('players-container').children.length;
    document.getElementById('player-count-display').innerText = `${count} Players`;
}


// --- INITIALIZATION ---
function startGame() {
    // Get all input fields
    const inputs = document.querySelectorAll('.player-input-field');
    
    // Reset players array
    players = [];

    // Loop through inputs and create player objects
    inputs.forEach((input) => {
        let pName = input.value.trim();
        if(!pName) pName = input.placeholder; // Fallback if empty
        players.push({ name: pName, score: 0 });
    });

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
        msg = `${player.name} rolled ${rollValue} (EVEN) -> Gained 1 Point!`;
    } else {
        // Decrease score, but prevent going below 0
        if (player.score > 0) {
            player.score--;
            msg = `${player.name} rolled ${rollValue} (ODD) -> Lost 1 Point.`;
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
    const p = players[currentPlayerIndex];
    document.getElementById('active-player-name').innerText = p.name;
    renderScoreboard();
}

function handleWin(player) {
    document.getElementById('winner-name').innerText = player.name;
    showScreen('win');
}
