const squares = document.getElementsByClassName("square");
const tickedsquares = document.getElementsByClassName("ticked");
const replayBtn = document.getElementById("replay");
const resultBox = document.getElementById("resultContainer");
const players = document.getElementsByClassName("players");
const toggleBtn = document.getElementById("switch");
const squareXY = {
    square1 : [0,0],
    square2 : [0,1],
    square3 : [0,2],
    square4 : [1,0],
    square5 : [1,1],
    square6 : [1,2],
    square7 : [2,0],
    square8 : [2,1],
    square9 : [2,2],
}

const Player = (name,playerSymbol,algo="none") => {
    this.score = 0;
    const getName = () => name;
    const getScore = () => score;
    const play = playerSymbol;
    const win = () => ++score;
    return {getName,getScore,play,win,algo};
};


const gameBoard = (function(){
    let array =[...Array(3)].map(e => Array(3).fill(0));
    let amendArray = (array,newArray) => {return Object.assign(array,newArray)};
    let resetArray = (array) => { return Object.assign( array,[...Array(3)].map( e => Array(3).fill(0) ) ) };
    let addPawn = (playerSymbol,squareX,squareY) => array[squareX][squareY] = playerSymbol;
    return {array,amendArray,resetArray,addPawn};
})();

const cpuLogic = (() => {
    function getKeyByArray(object,target){
        for (key in squareXY){
            if (object[key][0]===target[0] && object[key][1]===target[1]) {
                return key
             }
        }
    }
    const isEmpty = (squareX,squareY) => { return gameBoard.array[squareX][squareY] === 0}; 
    const randomize = (max) => { return Math.floor(Math.random()*max) }
    const random = () => {
        let squareX=randomize(3); 
        let squareY=randomize(3);
        isEmpty(squareX,squareY) ? squareId=getKeyByArray(squareXY,[squareX,squareY]) : random();
        return squareId; 
    }
    const algoTable = { "random" : random , "minimax" : "N/A"}
    const play = (algo) => { document.getElementById(algoTable[algo]()).click() }
    

    const enableCPU = ( () => { toggleBtn.addEventListener("click",function() {
        gameData.p2.algo = (this.checked) ? "random" : "none";
    })
    })()
    return {random,play};
})()

const gameData = (function() {
     let p1 = Player("Player1",1,"none");
     let p2 = Player("Player2",-1,"none"); 
     let round=0;
     let isCPU = () => ( gameData.round % 2 === 0) ? false : toggleBtn.checked; 
     let playerTurn = () => ( gameData.round % 2 === 0) ? p1.play : p2.play; 
     let playerName = () => ( (gameData.round + 1) % 2 === 0) ? p1.getName() : p2.getName(); 
     const playerPawn = {"1" : "X","-1" : "O"};
     let pawn = () => playerPawn[playerTurn()];
     let result = {winner : "" , winningDir : ""}; 
   return {p1,p2,playerName,isCPU,playerTurn,pawn,result,round}
})()

const display = (function() {
    const board = ( () => {
        const clear = () => {
            [...tickedsquares].forEach( tickedSquare => { tickedSquare.remove(); } )    
        }
        const addPawn = (that) => {
            newDiv = document.createElement("div");
            newDiv.classList.add("ticked");
            newDiv.textContent = gameData.pawn();
            that.appendChild(newDiv);
        }
        return {clear,addPawn};
    })()
    const toggleReplayButton = ( () => { replayBtn.classList.toggle("hidden") } )
    const toggleResult = ( () => {
        resultBox.classList.toggle("hidden");
        winnerName=document.getElementById(gameData.playerName().toLowerCase()).textContent;
        resultBox.textContent = gameData.result.winner==="draw" ? "It is a draw!" : `Congratulations ${winnerName} won this round!`;
    })
    const gameOver = () => {
        toggleReplayButton();
        toggleResult();
    }
    const changePlayerName = () => {
        [...players].forEach( player => player.addEventListener("mouseover",function() { 
            let inputExists = () => { return document.querySelector(".nameInput") };
            
            if (inputExists() === null) {
                inputBox = document.createElement("input");
                inputBox.classList.add("nameInput")
                inputBox.value = "new name?"
                player.appendChild(inputBox);
            }
            inputBox.addEventListener("keydown",evt => {
                if (evt.keyCode===13) {
                    player.textContent= inputBox.value ==="" ? player.textContent : inputBox.value;
                    inputBox.style.display="none";
                }
            })
        }))
    }
    return {board,toggleReplayButton,toggleResult,gameOver,changePlayerName};
})()

const initGame = (function() {
    const triggerGame = function() {
        display.board.addPawn(this);
        gameStatus = gameFlow( squareXY[this.id] );
        this.removeEventListener("click",triggerGame);
        (!gameStatus) ? stopGame() : "";
        (!gameStatus) ? display.gameOver() : "";
        if (gameStatus) {
            gameData.isCPU() ? cpuLogic.play(gameData.p2.algo) : "" 
        }
    }
    const startGame = () => {
        [...squares].forEach(square => { square.addEventListener("click", triggerGame); })    
    }
    const stopGame = () => {
        [...squares].forEach(square => { square.removeEventListener("click", triggerGame); })    
    }
    const clearGame = () => {
        display.board.clear();
        gameBoard.resetArray(gameBoard.array);
        gameData.round=0;
        gameData.result.winner = "";
        gameData.result.winningDir = "";
    }   
   

    const replayGame = () => {
        replayBtn.addEventListener("click", () => {
        clearGame();
        startGame();
        display.gameOver();
        })
    }
    gameBoard.resetArray(gameBoard.array);
    display.changePlayerName();
    display.gameOver();
    replayGame();
    startGame(); 
})()

const gameFlow = function(targetXY){
    let gameStatus = true;
    let square = {x : targetXY[0], y : targetXY[1]} ;
    let isEmpty = () => gameBoard.array[square.x][square.y] === 0; 
    let playerWon = () => outcome.result(square.x,square.y);
    let lastRound = () => (gameData.round===9);
    const outcome = (function() {
        let count = (squareX,squareY) => {
            let sum = {row : 0, col : 0, diagOne : 0, diagTwo : 0};
            for (let i = 0; i < 3; i++ ) {
                sum.row += gameBoard.array[squareX][i];
                sum.col += gameBoard.array[i][squareY];
                sum.diagOne += gameBoard.array[i][i];
                sum.diagTwo += gameBoard.array[i][2-i];
            }
            return sum
        }
        let isWinner = (sum) => {
            let status = false;
            let winDirection = {row : false, col : false, diagOne : false, diagTwo : false};    
            let winCheck = (input) =>  Math.abs(input) === 3;
            for (direction in sum) {
                if (winCheck(sum[direction])) {
                    winDirection[direction]=true;
                    status=true;
                }
            }   
            return {status,winDirection};
        }
        let result = (squareX,SquareY) => isWinner(count(squareX,SquareY));
        return {result};     
    })()

    if (isEmpty() && !playerWon().status) {
        gameBoard.addPawn(gameData.playerTurn(),square.x,square.y);
        gameData.round++;
    } 
    if (lastRound() && !playerWon().status) {
        gameData.result.winner = "draw";
        gameStatus = false;
    }
    if (playerWon().status){
        gameData.result.winner = gameData.playerName();
        gameData.result.winningDir = playerWon().winDirection;
        gameStatus = false;
    }
    return gameStatus;
}






