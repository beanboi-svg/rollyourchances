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

// --- SETUP LOGIC ---
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


// --- INITIALIZATION & ANIMATION ---
function startGame() {
    // 1. Collect names from inputs
    const inputs = document.querySelectorAll('.player-input-field');
    players = [];

    inputs.forEach((input) => {
        let pName = input.value.trim();
        if(!pName) pName = input.placeholder; // Fallback if empty
        players.push({ name: pName, score: 0 });
    });

    // 2. SCRAMBLE LOGIC (Math) - This is the "Bias Reduction"
    // Fisher-Yates Shuffle Algorithm
    for (let i = players.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [players[i], players[j]] = [players[j], players[i]]; // Swap
    }

    // 3. PREPARE SCREEN
    currentPlayerIndex = 0;
    renderScoreboard();
    showScreen('game');

    // 4. ANIMATION SEQUENCE (Slot Machine Effect)
    const nameDisplay = document.getElementById('active-player-name');
    const logDisplay = document.getElementById('log-display');
    const buttons = document.querySelectorAll('.num-btn');
    
    // Disable buttons so no one can play yet
    buttons.forEach(btn => btn.disabled = true);
    logDisplay.innerText = "🎲 Randomizing turn order...";
    
    let steps = 0;
    const maxSteps = 20; // How many name-swaps to show
    const intervalTime = 100; // Speed of shuffle in ms

    const shuffleInterval = setInterval(() => {
        // Show a random name purely for visual effect
        const randomName = players[Math.floor(Math.random() * players.length)].name;
        nameDisplay.innerText = randomName;
        steps++;
        
        // Stop animation
        if (steps >= maxSteps) {
            clearInterval(shuffleInterval);
            finishSetup();
        }
    }, intervalTime);

    function finishSetup() {
        // Set the actual true first player (from the scrambled array)
        updateActivePlayerDisplay();
        
        // Re-enable buttons
        buttons.forEach(btn => btn.disabled = false);
        logDisplay.innerText = `Order set! ${players[0].name} starts.`;
    }
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
