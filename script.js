// const startElem=document.getElementById("start");
const squares=document.getElementsByClassName("square");
const restartBtn=document.getElementById("restart");
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

const Player = (name,playerSymbol) => {
    this.score= 0;
    const getName = () => name;
    const getScore = () => score;
    const play = playerSymbol;
    const win = () => ++score;
    return {getName,getScore,play,win};
};

const gameBoard = (function(){
    let array =[];
    const resetArray = () => { array=[...Array(3)].map(e => Array(3).fill(0)); }
    let reset = resetArray(array);
    let addPawn = (playerSymbol,squareX,squareY) => array[squareX][squareY] = playerSymbol;
    return {array,reset,addPawn};
})();

const gameData = (function() {
     let p1 = Player("player1",1);;
     let p2 = Player("player2",-1);; 
     let round=0;
     let playerTurn = () => ( gameData.round % 2 === 0) ? p1.play : p2.play; 
     let playerName= () => ( (gameData.round + 1) % 2 === 0) ? p1.getName() : p2.getName(); 
     const playerPawn = {"1" : "X","-1" : "O"}
     let result = {winner : "" , winningDir : ""}  
   return {p1,p2,round,playerTurn,playerPawn,result,playerName}
})()

const initGame = (function() {
    gameBoard.reset;
    let pawn= () => gameData.playerPawn[gameData.playerTurn()];
    const triggerGame = function() {
        this.innerHTML=pawn();
        gameStatus=gameFlow(squareXY[this.id]);
        this.removeEventListener("click",triggerGame);
        (!gameStatus) ? stopRound() : console.log("keep going");
    }
    const startRound = () => {
        [...squares].forEach(square => {
            square.addEventListener("click", triggerGame)
        })    
    }
    const stopRound = () => {
        [...squares].forEach(square => {
            square.removeEventListener("click", triggerGame)
        })    
    }
    startRound(); 
})()

const outcome = (function() {
    let count = (squareX,squareY) => {
        let sum = {row : 0, col : 0, diagOne : 0, diagTwo : 0};
        for (let i = 0; i < 3; i++ ) {
            sum.row+=gameBoard.array[squareX][i];
            sum.col+=gameBoard.array[i][squareY];
            sum.diagOne+=gameBoard.array[i][i];
            sum.diagTwo+=gameBoard.array[i][2-i];
        }
        return sum
    }
    let isWinner = (sum) => {
        let winCheck = (input) =>  Math.abs(input)===3  ;
        let winDirection = {row : false, col : false, diagOne : false, diagTwo : false};
        let status = false;
        for (direction in sum) {
            if (winCheck(sum[direction])) {
                winDirection[direction]=true;
                status=true;
            }
        }   
        return {status,winDirection}
    }
    let result =(squareX,SquareY) => isWinner(count(squareX,SquareY))
    return {result};    

    
})()

const gameFlow = function(targetXY){
    let status=true;
    let square = {x : targetXY[0], y : targetXY[1]} 
    let isEmpty = () => gameBoard.array[square.x][square.y]===0 
    let playerWon = () => outcome.result(square.x,square.y);
    let lastRound = () => (gameData.round===9);
    if (isEmpty() && !playerWon().status) {
        gameBoard.addPawn(gameData.playerTurn(),square.x,square.y);
        gameData.round++;
    } 
    if (lastRound() && !playerWon().status) {
        gameData.result[winner]="draw";
        status=false;
    }
    if (playerWon().status){
        gameData.result.winner = gameData.playerName();
        gameData.result.winningDir = playerWon().winDirection;
        status=false;
    }
    
    console.log(gameData.result.winner)
    return status;
}






