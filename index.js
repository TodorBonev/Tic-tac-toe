const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");
const computerAmateurBtn = document.querySelector("#computerAmateurBtn");
const computerMasterBtn = document.querySelector("#computerMasterBtn");
const multiplayerBtn = document.querySelector("#multiplayerBtn");
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [2, 4, 6],
    [0, 4, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8]
];

let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;
let gameMode = "amateur";
let startingPlayer = "X";

initializeGame();

let xPlayerScore = 0;
let oPlayerScore = 0;
let draws = 0;

function initializeGame(){
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    restartBtn.addEventListener("click", restartGame);
    computerAmateurBtn.addEventListener("click", () => setGameMode("amateur"));
    computerMasterBtn.addEventListener("click", () => setGameMode("master"));
    multiplayerBtn.addEventListener("click", () => setGameMode("multiplayer"));
    statusText.textContent = `${currentPlayer}'s turn`;
    running = true;
}

function setGameMode(mode){
    gameMode = mode;
    resetScores();
    updateScoreLabels();
    restartGame();
}

function resetScores(){
    xPlayerScore = 0;
    oPlayerScore = 0;
    draws = 0;
}

function updateScoreLabels(){
    if (gameMode === "multiplayer") {
        document.getElementById("humanScore").textContent = `X Player: ${xPlayerScore}`;
        document.getElementById("computerScore").textContent = `O Player: ${oPlayerScore}`;
    } else if (gameMode === "amateur") {
        document.getElementById("humanScore").textContent = `Human: ${xPlayerScore}`;
        document.getElementById("computerScore").textContent = `Amateur Computer: ${oPlayerScore}`;
    } else if (gameMode === "master") {
        document.getElementById("humanScore").textContent = `Human: ${xPlayerScore}`;
        document.getElementById("computerScore").textContent = `Master Computer: ${oPlayerScore}`;
    }
    else{
        document.getElementById("humanScore").textContent = `Human: ${xPlayerScore}`;
        document.getElementById("computerScore").textContent = `Amateur Computer: ${oPlayerScore}`; 
    }
    document.getElementById("draws").textContent = `Draws: ${draws}`;
}

function cellClicked(){
    const cellIndex = this.getAttribute("cellIndex");
    if(options[cellIndex] != "" || !running){
        return;
    }

    updateCell(this, cellIndex);
    checkWinner();

    if(running && gameMode !== "multiplayer" && currentPlayer === "O"){
        setTimeout(computerMove, 500);
    }
}

function updateCell(cell, index){
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
}

function changePlayer(){
    currentPlayer = (currentPlayer == "X") ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s turn`;
}

function checkWinner(){
    let roundWon = false;
    for(let i = 0; i < winConditions.length; i++){
        const condition = winConditions[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];

        if(cellA == "" || cellB == "" || cellC == ""){
            continue;
        }
        if(cellA == cellB && cellB == cellC){
            roundWon = true;

            document.querySelector(`[cellIndex='${condition[0]}']`).classList.add("winningCell");
            document.querySelector(`[cellIndex='${condition[1]}']`).classList.add("winningCell");
            document.querySelector(`[cellIndex='${condition[2]}']`).classList.add("winningCell");
            break;
        }
    }

    if(roundWon){
        if(currentPlayer == "X"){
            statusText.textContent = `X Player wins!`;
            xPlayerScore++;
        } else {
            statusText.textContent = `O Player wins!`;
            oPlayerScore++;
        }
        running = false;
        updateScoreDisplay();
    } else if(!options.includes("")){
        statusText.textContent = `Draw!`;
        running = false;
        draws++;
        updateScoreDisplay();
    } else {
        changePlayer();
    }
}

function updateScoreDisplay(){
    if (gameMode === "multiplayer") {
        document.getElementById("humanScore").textContent = `X Player: ${xPlayerScore}`;
        document.getElementById("computerScore").textContent = `O Player: ${oPlayerScore}`;
    } else if (gameMode === "amateur") {
        document.getElementById("humanScore").textContent = `Human: ${xPlayerScore}`;
        document.getElementById("computerScore").textContent = `Amateur Computer: ${oPlayerScore}`;
    } else if (gameMode === "master") {
        document.getElementById("humanScore").textContent = `Human: ${xPlayerScore}`;
        document.getElementById("computerScore").textContent = `Master Computer: ${oPlayerScore}`;
    }
    else{
        document.getElementById("humanScore").textContent = `Human: ${xPlayerScore}`;
        document.getElementById("computerScore").textContent = `Amateur Computer: ${oPlayerScore}`; 
    }
    document.getElementById("draws").textContent = `Draws: ${draws}`;
}

function restartGame(){
    options = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = startingPlayer;
    statusText.textContent = `${currentPlayer}'s turn`;
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("winningCell");
    });
    running = true;

    startingPlayer = (startingPlayer == "X") ? "O" : "X";

    if(gameMode !== "multiplayer" && currentPlayer === "O"){
        setTimeout(computerMove, 500);
    }
}

function computerMove(){
    if (gameMode === "master") {
        const bestMove = minimax(options, currentPlayer).index;
        const cell = document.querySelector(`[cellIndex='${bestMove}']`);
        updateCell(cell, bestMove);
        checkWinner();
    } else {
        let emptyCells = [];
        options.forEach((option, index) => {
            if(option === ""){
                emptyCells.push(index);
            }
        });

        if(emptyCells.length > 0){
            const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            const cell = document.querySelector(`[cellIndex='${randomIndex}']`);
            updateCell(cell, randomIndex);
            checkWinner();
        }
    }
}

function minimax(newOptions, player){
    const availSpots = newOptions.map((val, index) => val === "" ? index : null).filter(val => val !== null);

    if (checkWin(newOptions, "X")) {
        return { score: -10 };
    } else if (checkWin(newOptions, "O")) {
        return { score: 10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }

    const moves = [];
    for (let i = 0; i < availSpots.length; i++) {
        const move = {};
        move.index = availSpots[i];
        newOptions[move.index] = player;

        if (player === "O") {
            const result = minimax(newOptions, "X");
            move.score = result.score;
        } else {
            const result = minimax(newOptions, "O");
            move.score = result.score;
        }

        newOptions[move.index] = "";
        moves.push(move);
    }

    let bestMove;
    if (player === "O") {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

function checkWin(board, player) {
    return winConditions.some(condition => {
        return condition.every(index => board[index] === player);
    });
}






