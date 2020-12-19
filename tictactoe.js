
// Player Constructor
function Player(piece) {
    this.piece = piece;
    this.score = 0;
    this.move = null;
}

function TicTacToe() {
    /********************************
       Game Variables
    ********************************/
    let gameBoard = Array.from({ length: 9 }, () => '-');
    const playerX = new Player('X');
    const playerO = new Player('O');
    let currentPlayer = playerX;
    let mode = '2P';

    /********************************
       DOM ELEMENTS
    ********************************/
    // Board and Spaces
    const board = document.querySelector('.gameboard');
    const spaces = board.querySelectorAll('.space');

    // Modal
    const modal = document.querySelector('.messages-outer');
    const messages = modal.querySelector('.messages');

    // Play Mode
    const modeDisplay = document.querySelector('.mode-type');
    const modeButton = document.querySelector('.mode button')
    
    //ScoreBoard Elements
    const pXScoreboardEl = document.querySelector('.player-x');
    const pOScoreboardEl = document.querySelector('.player-o');
    const pXScoreEl = pXScoreboardEl.querySelector('.score-x');
    const pOScoreEl = pOScoreboardEl.querySelector('.score-o');


    /********************************
      Modal Functionality
    ********************************/
    
    // Open modal that displays game end messages
    function openModal() {
        modal.classList.remove('hidden');
        window.addEventListener('keyup', handleKeyUp);
    }

    // Close the modal that displays game end messages
    function closeModal() {
        modal.classList.add('hidden');
        window.removeEventListener('keyup', handleKeyUp);
        swapPlayer();
        resetBoard();
        renderBoard();
        checkMode();
    }

    // Support for closing modal with escape
    function handleKeyUp(e) {
        if (e.key === 'Escape') return closeModal();
    }

    // Handle closing the modal when clicking outside of the form
    function handleClickOutside(e) {
        if (e.currentTarget === e.target) return closeModal();
    }
    
    /*********************************
       Render Functionality
    **********************************/

    // Renders the gameboard to the browser
    function renderBoard() {
        spaces.forEach(space => {
            let location = space.dataset.number;
            if (gameBoard[location] !== '-') {
                space.innerHTML = `<div class="content"> ${gameBoard[location]} </div>`;
            }
            else {
                space.innerHTML = `<div class="content"></div>`;
            }
        });
    }

    // Renders the scoreboard to the browser
    function renderScoreBoard() {
        pXScoreEl.textContent = playerX.score;
        pOScoreEl.textContent = playerO.score;
    }

    // Highlights the winning spaces
    function highlightWin(win) {
        win.forEach(win => {
            spaces[win].classList.add('win');
        });  
    }

    /****************************** 
      Main Game Play Functionality
    *******************************/
   // Checks if PC is playing and if so, gets its move
   function checkMode() {
       if (mode === 'PC' && currentPlayer === playerO) {
           getPCMove(); 
        }
    }

   // Main game logic
  function play(e) {
        let  location = e.target.dataset.number;
        if (validMove(location)) {
            placePiece(location)
            renderBoard();
            if (isGameOver()) {
                  return handleGameOver(); 
              }
              else {
                swapPlayer(); 
              }
        }
       checkMode();
    }
    
    // Checks if the game is over
    function isGameOver() {
        return (checkForDraw() || checkForWin().win);
    }

    // Handles game over logic
    function handleGameOver() {
        openModal();
        const isWin = checkForWin();
        if (isWin.win) {
            const winnerName = (mode === 'PC' && currentPlayer === playerO) ? 'Computer' : 'Player'
            highlightWin(isWin.location);
            messages.textContent = `Game Over! ${winnerName} (${currentPlayer.piece}) has won!`;
            currentPlayer.score++;
            renderScoreBoard();  
        }
        else {
            messages.textContent = `Game Over! It's a draw!`;
        }
        
    }    

    /******************************* 
      Computer (AI) Functionality
    *******************************/
    function wait(ms = 0) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    // Gets all available open spaces
    function getAvailableSquares() {
        let possibleMoves = [];
        gameBoard.forEach((space, index) => {
            if (space === '-') {
                possibleMoves.push(index);
            }
        });
        return possibleMoves;
    }

    // Generates the move for the PC
    async function getPCMove() {
        let moves = getAvailableSquares();
        let location = Math.floor(Math.random() * 9);
        if (moves.includes(location)) {
            await wait(500);
            spaces[location].click();
        }
        else {
            getPCMove();
        }
    }

    /*********************************
      Game Play Helper Functionality
    **********************************/
    
    // Place a piece on the board
    function placePiece(location) {
        gameBoard[location] = currentPlayer.piece;
    }

    // Checks if the desired move is valid
    function validMove(location) {
        if (gameBoard[location] === '-') {
            return true;
        }
        return false;
    }

    // Swaps the current player
    function swapPlayer() {  
        if (currentPlayer === playerX) {
            currentPlayer = playerO
            pOScoreboardEl.classList.add('current-turn');
            pXScoreboardEl.classList.remove('current-turn');

        }
        else {
            currentPlayer = playerX;
            pXScoreboardEl.classList.add('current-turn');
            pOScoreboardEl.classList.remove('current-turn');
            
        }
    }

    // Check if there are any empty spaces left
    function checkForDraw() {
        return !gameBoard.includes('-');
    }


    // Check if there is a win
    function checkForWin() {
        let result = {
            win: false,
            type: '',
            location: []
        };
        // Check Rows
        for (let i = 0; i <= 6; i += 3) {
            let spaces = [gameBoard[i], gameBoard[i + 1], gameBoard[i + 2]];
            if (isWin(spaces)) { 
                result.win = true;
                result.type = "row";
                result.location = [i, i + 1, i + 2];
                return result;
            }
        }
        // Check Columns
        for (let i = 0; i < 3; i++) {
            let spaces = [gameBoard[i], gameBoard[i + 3], gameBoard[i + 6]];
            if (isWin(spaces)) { 
                result.win = true;
                result.type = "column";
                result.location = [i, i + 3, i + 6];
                return result;
            }
        }
        // Check Diagonals
        let diag1 = [gameBoard[0], gameBoard[4], gameBoard[8]];
        let diag2 = [gameBoard[2], gameBoard[4], gameBoard[6]];
        if (isWin(diag1)) {
            result.win = true;
            result.type = "diag";
            result.location = [0, 4, 8];
            return result;
        }
        else if (isWin(diag2)) {
            result.win = true;
            result.type = "diag";
            result.location = [2, 4, 6];
            return result;
        }
        return result;
    }

    // Check if given array of spaces is all X or all O
    function isWin(spaces) {
        return (spaces.every(space => space === 'X') || (spaces.every(space => space === 'O')));
    }

    /*************************************
       Reset & New Game Functionality
    ***************************************/
    
    // Resets everything back to initial state
    function newGame() {
        // Reset board & player
        resetBoard();
        resetPlayers();  
        //Re-render
        renderBoard();
        renderScoreBoard();
        changeMode();
    }

    // Resets the gameboard to blanks
    function resetBoard() {
        gameBoard = Array.from({ length: 9 }, () => '-');
        spaces.forEach(space => space.classList.remove('win'));
    }
    
    // Resets the players back to their initial state
    function resetPlayers() {
        playerX.score = 0;
        playerO.score = 0;
        currentPlayer = playerX;
        pXScoreboardEl.classList.add('current-turn');
        pOScoreboardEl.classList.remove('current-turn');
    }

    // Changes the game play mode
    function changeMode() {
        if (mode === 'PC') {
            mode = '2P'
            modeDisplay.textContent = '2 Player';
            pOScoreboardEl.querySelector('.name').textContent = 'Player (O)';
        }
        else {
            mode = 'PC';
            modeDisplay.textContent = 'Computer';
            pOScoreboardEl.querySelector('.name').textContent = 'Computer (O)';
        }
    }

    /************************** 
      Event Listeners
    **************************/
    board.addEventListener('click', play);
    modal.addEventListener('click', handleClickOutside);
    modeButton.addEventListener('click', newGame);
}

TicTacToe();


