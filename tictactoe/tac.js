const gameBoard = Array(9).fill(""); 
const players = [
  { name: "Vinay", marker: "V" },
  { name: "Raju", marker: "R" },
];
let currentPlayerIndex = 0; 
function renderBoard() {
  const cells = document.querySelectorAll(".cell");
  gameBoard.forEach((mark, index) => {
    cells[index].textContent = mark;
  });
}
function checkWin(board = gameBoard) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6], 
  ];

  for (let i = 0; i < winPatterns.length; i++) {
    const [a, b, c] = winPatterns[i]; 
    if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
      return true; 
    }
  }
  
  return false; 
}
function checkDraw(board = gameBoard) {
  return board.every(cell => cell !== "");
}


function calculateProbabilities(board, currentPlayerIndex) {
  let player1Wins = 0;
  let player2Wins = 0;
  let draws = 0;
  let totalOutcomes = 0;

  
  function simulate(board, currentPlayerIndex) {
    if (checkWin(board)) {
      if (currentPlayerIndex === 1) player1Wins++; 
      else player2Wins++; 
      totalOutcomes++;
      return;
    }
 if (checkDraw(board)) {
      draws++;
      totalOutcomes++;
      return;
    }

    // Simulate moves for each empty cell
 for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = players[currentPlayerIndex].marker; // Simulate move
        simulate(board, 1 - currentPlayerIndex); // Switch player
        board[i] = ""; // Undo move (backtrack)
      }
    }
  }

  simulate([...board], currentPlayerIndex); // Start simulation

  // Prevent division by zero
  if (totalOutcomes === 0) {
    return { player1WinPercent: 0, player2WinPercent: 0, drawPercent: 0 };
  }
  const player1WinPercent = ((player1Wins / totalOutcomes) * 100).toFixed(2);
  const player2WinPercent = ((player2Wins / totalOutcomes) * 100).toFixed(2);
  const drawPercent = ((draws / totalOutcomes) * 100).toFixed(2);

  return { player1WinPercent, player2WinPercent, drawPercent };
}


function makeMove(index) {
  if (gameBoard[index] === "") {
    gameBoard[index] = players[currentPlayerIndex].marker;
    renderBoard(); // Render the board with the new move

    // Check for win or draw after rendering
    const win = checkWin();
    const draw = checkDraw();

    
    let alertMessage = "";

    if (win) {
      alertMessage = `${players[currentPlayerIndex].name} wins!`;
    } else if (draw) {
      alertMessage = "It's a draw!";
    }
    if (alertMessage) {
      // Use a small timeout to allow the UI to update before showing the alert
      setTimeout(() => {
        alert(alertMessage);
        resetGame();
      }, 0); // 0 milliseconds to allow the UI to update
    } else {
      currentPlayerIndex = 1 - currentPlayerIndex; // Switch player

      // Calculate and display probabilities
      const { player1WinPercent, player2WinPercent, drawPercent } = calculateProbabilities(gameBoard, currentPlayerIndex);
      document.getElementById("probabilities").textContent = 
        `Player 1 Win %: ${player1WinPercent}%, Player 2 Win %: ${player2WinPercent}%, Draw %: ${drawPercent}%`;
    }
  } else {
    alert("That cell is already taken! Try another one.");
  }
}
function resetGame() {
  gameBoard.fill("");
  renderBoard();
  currentPlayerIndex = 0; 
  document.getElementById("probabilities").textContent = 
    `Player 1 Win %: 0%, Player 2 Win %: 0%, Draw %: 0%`; 
}
document.querySelectorAll(".cell").forEach((cell, index) => {
  cell.addEventListener("click", () => makeMove(index));
});
document.getElementById("restartBtn").addEventListener("click", resetGame);
renderBoard();
