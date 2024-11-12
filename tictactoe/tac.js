const gamebrd=["","","","","","","","",""];
const vin = { name: "vinay", optn: "X" };
const raj = { name: "raju", optn: "O" };
let currentPlayer = vin;
function makeMove(index) {
    if (gamebrd[index] === "") { // Check if cell is empty
      gamebrd[index] = currentPlayer.optn; // Place the player's marker
      renderBoard(); // Update the board on the page
      if (checkWin()) {
        alert(`${currentPlayer.name} wins!`);
        resetGame();
      } else if (checkDraw()) {
        alert("It's a draw!");
        resetGame();
      } else {
        switchPlayer(); // Switch turns
      }
    } else {
      alert("That cell is already taken! Try another one.");
    }
  }
  function switchPlayer() {
    currentPlayer = currentPlayer === vin ? raj : vin;
  }
  function checkWin() {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
  
    return winPatterns.some(pattern => 
      gameBoard[pattern[0]] !== "" &&
      gameBoard[pattern[0]] === gameBoard[pattern[1]] &&
      gameBoard[pattern[1]] === gameBoard[pattern[2]]
    );
  }
  function checkDraw() {
    return gamebrd.every(cell => cell !== "");
  }
  function resetGame() {
    gameBoard.fill(""); // Clear the game board array
    renderBoard(); // Clear the display
    currentPlayer = player1; // Start with player 1 again
  }
  function renderBoard() {
    const cells = document.querySelectorAll(".cell");
    gameBoard.forEach((mark, index) => {
      cells[index].textContent = mark;
    });
  }