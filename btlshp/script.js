const gamesBoardContainer = document.querySelector('#gamesboard-container');
const optionContainer = document.querySelector('.option-container');
const flipButton = document.querySelector('#flip-button');
const startButton = document.querySelector('#start-button');
const infoDisplay = document.querySelector('#info');
const turnDisplay = document.querySelector('#turn-display')

let angle = 0;

function flip() {
    const optionShips = Array.from(optionContainer.children);
    angle = angle === 0 ? 90 : 0;

    optionShips.forEach(optionShip => {
        optionShip.style.transform = `rotate(${angle}deg)`;
    });
}
flipButton.addEventListener('click', flip);


// Creating the game board
const width=10
function createBoard(color,user) {
    const gameBoardContainer = document.createElement('div'); 
    gameBoardContainer.classList.add('game-board');
    gameBoardContainer.style.backgroundColor = color;
    gameBoardContainer.id=user;
    for (let i=0; i < width * width; i++){
        const block=document.createElement('div')
        block.classList.add('block');
        block.id=i
        gameBoardContainer.append(block)
    }
    gamesBoardContainer.append(gameBoardContainer);
}

createBoard('yellow','player');
createBoard('pink','computer')

//shipscreation
class Ship {
    constructor(name, length) {
        this.name = name;
        this.length = length;
    }
}

const destroyer = new Ship('destroyer', 2);
const submarine = new Ship('submarine', 3);
const cruiser = new Ship('cruiser', 3);
const battleship = new Ship('battleship', 4);
const carrier = new Ship('carrier', 5);

const ships=[destroyer,submarine,cruiser,battleship,carrier]
let notDropped;
function getValidity(allBoardBlocks, isHorizontal, startIndex, ship) {
    let validStart;
    if (isHorizontal) {
        validStart = startIndex <= width * width - ship.length ? startIndex : width * width - ship.length;
    } else {
        validStart = startIndex <= width * width - width * ship.length ? startIndex : startIndex - ship.length * width + width;
    }

    let shipBlocks = [];
    for (let i = 0; i < ship.length; i++) {
        if (isHorizontal) {
            shipBlocks.push(allBoardBlocks[Number(validStart) + i]);
        } else {
            shipBlocks.push(allBoardBlocks[Number(validStart) + i * width]);
        }
    }

    // Check for valid placement (no overlap or out-of-bound)
    let valid = true;
    if (isHorizontal) {
        shipBlocks.every((_shipBlock, index) =>
            valid = shipBlocks[0].id % width !== width - (shipBlocks.length - (index + 1))
        );
    } else {
        shipBlocks.every((_shipBlock, index) =>
            valid = shipBlocks[0].id < (width * index + 1)
        );
    }

    const notTaken = shipBlocks.every(shipBlock => !shipBlock.classList.contains('taken'));
    return { shipBlocks, valid, notTaken };
}
function addShipPiece(user,ship,startId){
     const allBoardBlocks = document.querySelectorAll(`#${user} div`);

     let randomBoolean=Math.random()<0.5;

     let isHorizontal=user === 'player'? angle === 0 :randomBoolean;

     let randomStartIndex = Math.floor(Math.random() * width * width );
     let startIndex = startId? startId : randomStartIndex;

     const {shipBlocks,valid,notTaken} = getValidity(allBoardBlocks,isHorizontal,startIndex,ship)

     
     if (valid && notTaken){
        shipBlocks.forEach(shipBlock=>{
            shipBlock.classList.add(ship.name)
            shipBlock.classList.add('taken')
         })

     }
     else{
         if (user === 'computer') addShipPiece( user,ship,startId)
            if (user === 'player') notDropped=true ;
     }

     

}
ships.forEach(ship => addShipPiece('computer',ship))

//dragplayerships
let draggedShip
const optionShips=Array.from(optionContainer.children);
optionShips.forEach(optionShip=> optionShip.addEventListener('dragstart',dragStart));
const allPlayerBlocks=document.querySelectorAll('#player div')
allPlayerBlocks.forEach(playerBlock=>{
    playerBlock.addEventListener('dragover',dragOver)
    playerBlock.addEventListener('drop',dropShip)
})





function dragStart(e) { 
    notDropped=false;
    draggedShip = e.target;
}
function dragOver(e) {
    e.preventDefault()
    const ship = ships[draggedShip.id]
    highLightArea(e.target.id,ship)
    }
    function dropShip(e) {
        const startId = e.target.id;
        const ship = ships[draggedShip.id];  
        addShipPiece('player', ship, startId);
    
        if (!notDropped) {
            draggedShip.remove(); // This removes the preview element
        }
    
        // Ensure the ship placed on the grid gets the correct class
        const shipElement = document.querySelector(`#${startId}`);
        shipElement.classList.add(ship.name);
    }
//addhighlight
function highLightArea(startIndex,ship){
    const allBoardBlocks = document.querySelectorAll('#player div');

    let isHorizontal = angle === 0

    const {shipBlocks,valid,notTaken} =   getValidity(allBoardBlocks,isHorizontal,startIndex,ship)
    if (valid  && notTaken){
    shipBlocks.forEach(shipBlock => {
        shipBlock.classList.add('hover');
        setTimeout(() => shipBlock.classList.remove('hover'), 500);
    });
    
}
}
 let gameOver = false;
 let playerTurn;
 //startgame
 function startGame() {
    if (playerTurn=== undefined){
        if (optionContainer.children.length != 0){
            infoDisplay.textContent='please place all your ships first my dear!'
    
        }else{
           const allBoardBlocks =  document.querySelectorAll('#computer div');
           allBoardBlocks.forEach(block=> block.addEventListener('click',handleClick))
           playerTurn=true
           turnDisplay.textContent='your go!'
           infoDisplay.textContent='the game has started'
        
        }
       

    }
    
   
 }
 startButton.addEventListener('click',startGame)
 let playerHits = [];
 let computerHits = [];
 const playerSunkShips = [];
 const computerSunkShips = [];
 function handleClick(e){
    if (!gameOver){
        if (e.target.classList.contains('taken')){
            e.target.classList.add('boom')
            infoDisplay.textContent='hey you hit the computers ship awwww!'
             let classes = Array.from(e.target.classList)
             classes =classes.filter(className => className !== 'block')
             classes =classes.filter(className => className !== 'boom')
             classes =classes.filter(className => className !== 'taken')
             playerHits.push(...classes)
             checkScore('player',playerHits,playerSunkShips)

        }
        if (!e.target.classList.contains('taken')){
            infoDisplay.textContent='nothing hits this time uhhhh!'
            e.target.classList.add('empty')
        }
        playerTurn=false;
         const allBoardBlocks = document.querySelectorAll('#computer div')
         allBoardBlocks.forEach(block => block.replaceWith(block.cloneNode(true)))
         setTimeout(computerGo,3000)
    }

 }
 //definethe computers go

 function computerGo(){
    if (!gameOver){
        turnDisplay.textContent='Computers Go!'
        infoDisplay.textContent=' The computer is thinkig....'
        setTimeout(()=>{
            let randomGo = Math.floor(Math.random() * width * width)
             const allBoardBlocks = document.querySelectorAll('#player div')

             if (allBoardBlocks[randomGo].classList.contains('taken') &&
              allBoardBlocks[randomGo].classList.contains('boom')
            ){
        computerGo()
        return
        }else if(
            allBoardBlocks[randomGo].classList.contains('taken') &&
     !allBoardBlocks[randomGo].classList.contains('boom')
    )
    {
        allBoardBlocks[randomGo].classList.add('boom')
        infoDisplay.textContent='The computer hit your ship'
        let classes = Array.from(allBoardBlocks[randomGo].classList)
        classes =classes.filter(className => className !== 'block')
        classes =classes.filter(className => className !== 'boom')
        classes =classes.filter(className => className !== 'taken')
        computerHits.push(...classes)
        checkScore('computer',computerHits,computerSunkShips)

    } else {
        infoDisplay.textContent='Nothing hits this time.'
        allBoardBlocks[randomGo].classList.add('empty')
    }

    },3000)
    setTimeout(() => {
        playerTurn=true
        turnDisplay.textContent='Your Go!'
        infoDisplay.textContent='Please take tour go!'
         const allBoardBlocks = document.querySelectorAll('#computer div')
         allBoardBlocks.forEach(block => block.addEventListener('click',handleClick))

    },6000)
        
}

 }
 // Check if all ships are sunk (win or lose condition)
function checkScore(user, userHits, userSunkShips) {
    function checkShip(shipName, shipLength) {
        if (
            userHits.filter(storedShipName => storedShipName === shipName).length === shipLength
        ) {
            if (user === 'player') {
                infoDisplay.textContent = `You sunk the computer's ${shipName}!`;
                playerHits = playerHits.filter(storedShipName => storedShipName !== shipName);
            }
            if (user === 'computer') {
                infoDisplay.textContent = `The computer sunk your ${shipName}!`;
                computerHits = computerHits.filter(storedShipName => storedShipName !== shipName);
            }
            userSunkShips.push(shipName);
        }
    }

    // Check all ships
    checkShip('destroyer', 2);
    checkShip('submarine', 3);
    checkShip('cruiser', 3);
    checkShip('battleship', 4);
    checkShip('carrier', 5);

    // Check if player won (all computer ships sunk)
    if (playerSunkShips.length === 5) {
        infoDisplay.textContent = 'You sunk all the computer\'s ships! You won, my dear! Awwww!';
        gameOver = true;
        turnDisplay.textContent = 'Game Over!';
    }

    // Check if computer won (all player ships sunk)
    if (computerSunkShips.length === 5) {
        infoDisplay.textContent = 'The computer sunk all your ships! You lost, my dear! Awwww!';
        gameOver = true;
        turnDisplay.textContent = 'Game Over!';
    }
}

 




