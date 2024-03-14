const createPlayer =(inputName, inputSign) => {
    const sign = inputSign;
    const name = inputName;
    const getSign = () => sign;
    const getName = () => name;
    let score = 0;
    const won = () => {score++};
    const getScore = () => score;
    return {getSign, getName, won, getScore}
}

const Tile = () => {
    let value='';
    const addToken = (playerSign) => {
        value = playerSign;
      };
      const getValue = () => value;
      return { addToken, getValue};
}

//the board is global variable
const board = (() => {
    const board = [];
    const rows = 3;
    const columns = 3;
    for(let i = 0 ;i <rows;i++) {
        board[i] = []
        for(let j = 0; j<columns;j++) {
            board[i].push(Tile())
            
        }
    }
    const getBoard = () => board;

    const placeToken = (player, x, y) => {
        console.log(player.getSign())
        if(!board[x][y].getValue()) board[x][y].addToken(player.getSign());
        
    }

    return {placeToken, getBoard}
})();

const GameController = ()=> {

    //Initialize Players
    const player1 = createPlayer('Hiep','X');
    const player2 = createPlayer('Hiep2','O');
    
    
    //TURNS
    let turn = 1;
    let currentPlayer = player1;

    const getTurn = () =>turn;

    const switchPlayerTurn = () => {
        turn = turn == 1 ? 2 : 1;
        if(turn==1) currentPlayer = player1;
        else currentPlayer = player2;
    }
    
    const playRound = (x,y) => {
        //di ne
        if(turn == 0) turn = 1;
        board.placeToken(currentPlayer,x,y);

        //doi turn
        switchPlayerTurn();
    }


    const checkWin = () => {
        const boardLocation = board.getBoard();
        // console.log(boardLocation)
        if(
            (boardLocation[0][0].getValue()== boardLocation[0][1].getValue() && boardLocation[0][1].getValue() == boardLocation[0][2].getValue()
            && boardLocation[0][0].getValue() && boardLocation[0][2].getValue() &&boardLocation[0][1].getValue()) ||
            (boardLocation[0][0].getValue()== boardLocation[1][1].getValue() && boardLocation[1][1].getValue() == boardLocation[2][2].getValue()
            &&boardLocation[0][0].getValue() && boardLocation[1][1].getValue() && boardLocation[2][2].getValue()) ||
            (boardLocation[0][0].getValue()== boardLocation[1][0].getValue() && boardLocation[1][0].getValue() == boardLocation[2][0].getValue()
            &&boardLocation[0][0].getValue() && boardLocation[1][0].getValue() && boardLocation[2][0].getValue()) ||
            (boardLocation[0][1].getValue()== boardLocation[1][1].getValue() && boardLocation[1][1].getValue() == boardLocation[2][1].getValue()
            && boardLocation[0][1].getValue() && boardLocation[1][1].getValue() && boardLocation[2][1].getValue()) ||
            (boardLocation[0][2].getValue()== boardLocation[1][2].getValue() && boardLocation[1][2].getValue() == boardLocation[2][2].getValue()
            && boardLocation[0][2].getValue() && boardLocation[1][2].getValue() && boardLocation[2][2].getValue()) ||
            (boardLocation[1][0].getValue()== boardLocation[1][1].getValue() && boardLocation[1][1].getValue() == boardLocation[1][2].getValue()
            &&boardLocation[1][0].getValue() && boardLocation[1][2].getValue() && boardLocation[1][1].getValue()) ||
            (boardLocation[2][0].getValue()== boardLocation[2][1].getValue() && boardLocation[2][1].getValue() == boardLocation[2][2].getValue()
            && boardLocation[2][0].getValue() && boardLocation[2][1].getValue() && boardLocation[2][2].getValue()) ||
            (boardLocation[0][2].getValue()== boardLocation[1][1].getValue() && boardLocation[1][1].getValue() == boardLocation[2][0].getValue()
            && boardLocation[0][2].getValue() && boardLocation[1][1].getValue() && boardLocation[2][0].getValue()) 

        ) return true;

        else return false;
        
    }
    const getCurrentPlayer  = () => currentPlayer;

    return {playRound, getTurn ,getCurrentPlayer, checkWin, switchPlayerTurn};
}



const UIController = () => {
    let start = false;

    const gameController = GameController();
    const DOMboard = document.querySelector('#board')
    const tiles = [];
    const playerOne = document.querySelector('.one')
    const playerTwo = document.querySelector('.two')
    const backgroundTheme = document.querySelector('body')
    const startButton = document.querySelector('#title');

    const p1Score= document.querySelector('.P1.score');
    const p2Score = document.querySelector('.P2.score');
    startButton.addEventListener('click',(e)=>{
        
        if(start == false ) {
            updateScreen(gameController.getTurn());
            start =true;
        } else {
            resetScreen();

        }
    })

    const resetScreen = () => {
        if (start == true) {
            console.log('kkmao')
            playerOne.classList.remove('turn');
            playerTwo.classList.remove('turn');
            backgroundTheme.style.backgroundColor = 'white';
            start = false;

            for(let i = 0;i<3;i++) {
                for(let j =0;j<3;j++) {
                    tiles[i][j].innerHTML ='';
                    let temp =board.getBoard()
                    console.log(temp[i][j])
                    temp[i][j].addToken('')
                }
            }
        }
        
    }
    const modal = document.querySelector('.modal')
    const modalContainer = document.querySelector('.modal-container')
    modal.addEventListener('click',(e)=>{
        modalContainer.style.visibility ='hidden';
        resetScreen();
    });
    const updateScreen = (turn) => {
        if (turn==1) {
            playerOne.classList.add('turn')
            playerTwo.classList.remove('turn')
            backgroundTheme.style.backgroundColor = 'var(--blue)';       
        } else {
            playerTwo.classList.add('turn')
            playerOne.classList.remove('turn')
            backgroundTheme.style.backgroundColor = 'var(--red)';       
        }
    }

    const clickHandlerBoard = (e) => {
        if(start) {
            const x = e.target.dataset.location.split('-')[0];
            const y = e.target.dataset.location.split('-')[1];
            const sign = gameController.getCurrentPlayer().getSign();
            
            e.target.innerHTML = `
            <p class = "${sign}">${sign}</p>
        `
            ;
            gameController.playRound(x,y)
            if(gameController.checkWin()) {
                gameController.switchPlayerTurn();
                const currentPlayer = gameController.getCurrentPlayer();
                currentPlayer.won();
                modalContainer.style.visibility = 'visible';
                modal.innerHTML = `
                <h1>${currentPlayer.getName()} ${currentPlayer.getSign()} won!</h1>`
                
                if(currentPlayer.getSign()=='X') {
                    p1Score.textContent = currentPlayer.getScore()
                } else {
                    p2Score.textContent=currentPlayer.getScore()
                }
                return;
            }

            updateScreen(gameController.getTurn())
        }
    }

    for(let i = 0 ;i<3;i++) {
        tiles[i] = [];
        for(let j = 0;j<3;j++) {
            tiles[i][j] = document.createElement('div');
            tiles[i][j].classList.add(`tile`);
            tiles[i][j].setAttribute('data-location',`${i}-${j}`)
            DOMboard.append(tiles[i][j]);
            tiles[i][j].addEventListener('click',clickHandlerBoard)
        }
    }
}

UIController();




