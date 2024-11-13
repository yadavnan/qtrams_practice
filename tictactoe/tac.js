
const gameBoard = ["", "", "", "", "", "", "", "", ""];


const player1 = { name: "vinay", marker: "V" };
const player2 = { name: "raju", marker: "R" };
let currentPlayer = player1;


function makeMove(index) {
  if (gameBoard[index] === "") { 
    gameBoard[index] = currentPlayer.marker; 
    renderBoard(); 
    if (checkWin()) {
      alert(`${currentPlayer.name} wins!`);
      resetGame();
    } else if (checkDraw()) {
      alert("It's a draw!");
      resetGame();
    } else {
      switchPlayer(); 
    }
  } else {
    alert("That cell is already taken! Try another one.");
  }
}


function switchPlayer() {
  currentPlayer = currentPlayer === player1 ? player2 : player1;
}


function checkWin() {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]             
  ];

  return winPatterns.some(pattern => 
    gameBoard[pattern[0]] !== "" &&
    gameBoard[pattern[0]] === gameBoard[pattern[1]] &&
    gameBoard[pattern[1]] === gameBoard[pattern[2]]
  );
}


function checkDraw() {
  return gameBoard.every(cell => cell !== "");
}


function resetGame() {
  gameBoard.fill(""); 
  renderBoard(); 
  currentPlayer = player1;
}


function renderBoard() {
  const cells = document.querySelectorAll(".cell");
  gameBoard.forEach((mark, index) => {
    cells[index].textContent = mark;
  });
}


document.querySelectorAll(".cell").forEach((cell, index) => {
  cell.addEventListener("click", () => makeMove(index));
});


document.getElementById("restartBtn").addEventListener("click", resetGame);
