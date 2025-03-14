document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll(".cell");
    const playerScoreDisplay = document.getElementById("player-score");
    const computerScoreDisplay = document.getElementById("computer-score");
    const turnIndicator = document.getElementById("turn-indicator");
    const restartButton = document.getElementById("restart");
    const mainMenuButton = document.getElementById("main-menu");
    
    let board = Array(9).fill("");
    let currentPlayer = "X";
    let gameActive = true;
    let mode = new URLSearchParams(window.location.search).get("mode") || "player";
    let playerScore = 0;
    let computerScore = 0;
    
    function updateTurnIndicator() {
        if (mode === "player") {
            turnIndicator.innerText = `Player ${currentPlayer === "X" ? "1" : "2"}'s Turn`;
        } else {
            turnIndicator.innerText = currentPlayer === "X" ? "Your Turn" : "Computer's Turn";
        }
    }
    updateTurnIndicator();
    
    function checkWin() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                gameActive = false;
                if (board[a] === "X") {
                    playerScore++;
                } else {
                    computerScore++;
                }
                updateScore();
                turnIndicator.innerText = `Player ${board[a]} Wins!`;
                drawWinningLine(pattern);
                setTimeout(resetBoard, 1500);
                return true;
            }
        }
        if (!board.includes("")) {
            turnIndicator.innerText = "It's a Tie!";
            gameActive = false;
            setTimeout(resetBoard, 1500);
            return true;
        }
        return false;
    }

    function drawWinningLine(pattern) {
        pattern.forEach(index => cells[index].classList.add("winner"));
    }

    function handleClick(event) {
        const cellIndex = Array.from(cells).indexOf(event.target);
        if (!gameActive || board[cellIndex] !== "") return;

        board[cellIndex] = currentPlayer;
        event.target.innerText = currentPlayer;

        if (checkWin()) return;

        if (mode === "player") {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
        } else {
            currentPlayer = "O";
            setTimeout(computerMove, 500);
        }
        updateTurnIndicator();
    }

    function computerMove() {
        if (!gameActive) return;
        let emptyCells = board.map((val, idx) => val === "" ? idx : null).filter(v => v !== null);
        let move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[move] = "O";
        cells[move].innerText = "O";

        if (checkWin()) return;

        currentPlayer = "X";
        updateTurnIndicator();
    }

    function updateScore() {
        playerScoreDisplay.innerText = playerScore;
        computerScoreDisplay.innerText = computerScore;
    }

    function resetBoard() {
        board.fill("", 0, 9);
        gameActive = true;
        currentPlayer = "X";
        updateTurnIndicator();
        cells.forEach(cell => {
            cell.innerText = "";
            cell.classList.remove("winner");
        });
    }

    cells.forEach(cell => cell.addEventListener("click", handleClick));
    restartButton.addEventListener("click", () => {
        playerScore = 0;
        computerScore = 0;
        updateScore();
        resetBoard();
    });
    mainMenuButton.addEventListener("click", () => window.location.href = "main_menu.html");
});
