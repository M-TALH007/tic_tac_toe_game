// var originalBorad = [9];
var originalBorad = Array.from(Array(9).keys());
console.log(originalBorad);

var huPlayer = "X";
var aiPlayer = "0"

const winCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,4,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [2,4,6]
]

var cell = document.querySelectorAll(".cell");
var bt = document.querySelector(".hello");
bt.addEventListener("click", newGame);

newGame();

function newGame() {
    document.querySelector(".endgame").style.display = "none";
    for (const cellElement of cell) {
        cellElement.innerText = "";
        cellElement.style.removeProperty("background-color");
        cellElement.addEventListener("click", turnClick, false);
    }
    originalBorad = Array.from(Array(9).keys());
}

function turnClick(square){
    // console.log(square.target.id)
    if(typeof originalBorad[square.target.id] == "number"){
        turn(square.target.id,huPlayer);
        if(!checkTie()) turn(bestSpot(),aiPlayer);
    }
   
}
function turn(id,player){
    originalBorad[id]= player;
    console.log(originalBorad);
    document.getElementById(id).innerText = player;
    let gameWOn = checkWin(originalBorad,player);
    if(gameWOn) gameOver(gameWOn);
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
    let gameWOn = null;

    let index = 0;
    for (let win of winCombos) {
        let wining = win.every(index => plays.includes(index));
        if (wining) {
            gameWOn = { index: index, player: player };
            break;
        }
        index++;
    }

    return gameWOn;
}

function gameOver(gameWOn){
    // console.log("gameWOn.index:", gameWOn.index);
    console.log("winCombos[gameWOn.index]:", winCombos[gameWOn.index]);
    // console.log("winCombos:", winCombos);
    for (let index of winCombos[gameWOn.index]){
        document.getElementById(index).style.backgroundColor = gameWOn.player == huPlayer ? "green" : "red";
    }
    for (let i = 0; i < cell.length; i++){
        cell[i].removeEventListener("click", turnClick, false);
    }
    declarationWiner(gameWOn.player==huPlayer ? "you win":"you lose");
    
}


function declarationWiner(who){
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
    
}

function emptySquares() {
    return originalBorad.filter(s => typeof s === "number");
}
function countEmptySpaces() {
    return emptySquares().length;
    // return minimax(originalBorad,huPlayer).index;
}

function bestSpot() {
    // const emptySquaresArray = emptySquares();
    // return emptySquaresArray.length > 0 ? emptySquaresArray[0] : null;
    return minimax(originalBorad,aiPlayer).index;
}

const numberOfEmptySpaces = countEmptySpaces();
console.log("Number of empty spaces:", numberOfEmptySpaces);


function checkTie(){
     if(emptySquares().length == 0){
        for(var i=0; i<cell.length;i++){
           cell[i].style.backgroundColor = "yellow";
           cell[i].removeEventListener("click", turnClick, false);
        }
        declarationWiner("tie game");
        return true;
     }
     return false;
    }

    function minimax(newBoard, player) {
        var availSpots = emptySquares();
    
        if (checkWin(newBoard, huPlayer)) {
            return {score: -10};
        } else if (checkWin(newBoard, aiPlayer)) {
            return {score: 10};
        } else if (availSpots.length === 0) {
            return {score: 0};
        }
        var moves = [];
        for (var i = 0; i < availSpots.length; i++) {
            var move = {};
            move.index = newBoard[availSpots[i]];
            newBoard[availSpots[i]] = player;
    
            if (player == aiPlayer) {
                var result = minimax(newBoard, huPlayer);
                move.score = result.score;
            } else {
                var result = minimax(newBoard, aiPlayer);
                move.score = result.score;
            }
    
            newBoard[availSpots[i]] = move.index;
    
            moves.push(move);
        }
    
        var bestMove;
        if(player === aiPlayer) {
            var bestScore = -10000;
            for(var i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            var bestScore = 10000;
            for(var i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
    
        return moves[bestMove];
    }