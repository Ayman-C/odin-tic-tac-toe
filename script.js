// cross or Naught is 1 or -1
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

const initGame = (function() {
    gameBoard.reset
    let logData= (data) => window.prompt(`please enter ${data}`)
    p1=Player(logData("name"),1);
    p2=Player(logData("name"),-1);
    return {p1,p2,logData}
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
    return {isWinner,count};
})()

const gameFlow = (function(){
    let currRound = 0;
    let square = {x : 0, y : 0} 
    const p1=initGame.p1
    const p2=initGame.p2
    let playerTurn = () => ( currRound % 2 === 0) ? p1.play : p2.play; 
    let isGameOver = () => (currRound < 9) ? false : true;
    let playerWon= () => outcome.isWinner(outcome.count(square.x,square.y));

    while (!isGameOver() && !playerWon().status) {
        square.x = window.prompt("please enter x")
        square.y = window.prompt("please enter y")
        gameBoard.addPawn(playerTurn(),square.x,square.y);
        currRound++;
        console.log(gameBoard.array)
    } 
    console.log(-playerTurn());
    console.log(playerWon().winDirection);
    console.log(playerWon().status);
    result = {winner : -playerTurn() , winningDir : playerWon().winDirection}  
    return result
})()
