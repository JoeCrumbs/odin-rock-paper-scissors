(function() {
    // remove stop-transition (initially added to stop transitions showing on page load)
    document.body.classList.remove('stop-transition')

    //initialize counters and get nodes/elements
    const PLAY_OPTIONS = ['rock', 'paper', 'scissors'];
    const playerDivs = document.querySelectorAll('.weapon-choice.active');
    const weapons = document.querySelectorAll('.weapon-choice');
    const newGameButton = document.querySelector('#new-game');
    let playerScore = computerScore = 0;
    let round = 0;

    // capitalize first letter for output and comparison with PLAY_OPTIONS
    function capitalizeFirstLetter(string) {
        return string.slice(0,1).toUpperCase() + string.slice(1).toLowerCase();
    }

    // generate computer Choice - create random index to use with PLAY_OPTIONS Array
    function computerPlay() {
        let computerChoice = Math.floor(Math.random() * 3);
        return PLAY_OPTIONS[computerChoice];
    }

    // add one point to winner of round
    function incrementScore(string) {
        let oldScore = document.querySelector(`#${string}-score`);
        let newScore = +oldScore.textContent + 1;
        oldScore.textContent = newScore.toString();
        return newScore;
    }

    //check if game has ended
    function checkForWinner() {
        return (playerScore === 5 || computerScore === 5);
    }

    //send output to game-log
    function sendMessage(string) {
        let message = document.createElement('p');
        let gameLog = document.querySelector('.game-log__scroll');
        let newLine = document.querySelector('#new-line');
        message.textContent = '> '+ string;
        if (checkForWinner()) message.style.fontWeight = 'bold';
        gameLog.insertBefore(message, newLine);
        gameLog.scrollTop = gameLog.scrollHeight;
    }

    //animation of win, lose or draw
    function startTransition(div1, div2, customClass) {
        div1.classList.add((customClass) ? customClass : 'winning');
        div2.classList.add((customClass) ? customClass : 'losing')
    }

    //eventlistener function for rock paper scissors player buttons
    function game() {
        let computerSelection = computerPlay();
        let computerDiv = document.querySelector(`.weapon-choice.computer#${computerSelection}`);
        playerSelectionIndex = PLAY_OPTIONS.indexOf(this.id);
        computerSelectionIndex = PLAY_OPTIONS.indexOf(computerSelection);
        /* short evaluation (better than if else...): next element alway wins over last;
        use modulo evaluate place in sequence, use +1 to avoid 0 and when true
        (x + 1) % 3 === y -> y will win */
        if ((computerSelectionIndex + 1) % 3 === playerSelectionIndex) {
            // don't use template strings when older browser must be supported
            sendMessage(`Round ${round}: You Win! ${capitalizeFirstLetter(this.id)} beats ${computerSelection}!`);
            startTransition(this,computerDiv);
            playerScore = incrementScore('player');
        } else if ((playerSelectionIndex + 1) % 3 === computerSelectionIndex) {
            sendMessage(`Round ${round}: You Lose! ${capitalizeFirstLetter(computerSelection)} beats ${this.id}!`);
            startTransition(computerDiv,this);
            computerScore = incrementScore('computer');
        } else {
            sendMessage(`Round ${round}: Its a draw! Try Again!`);
            startTransition(this,computerDiv,'drawing');
        }
        // Determine if game ends
        if (playerScore === 5 || computerScore === 5) {
            playerDivs.forEach((div) => {
                div.removeEventListener('click', game);
                div.classList.remove('active');
            });
            sendMessage(`${(playerScore === 5) ? 'Player' : 'Computer'} wins!
            The final score is ${playerScore}:${computerScore}!`) 
        }
        round++;
    }

    //add EventListener
    playerDivs.forEach((div) => {
        div.addEventListener('click', game);
    });

    newGameButton.addEventListener('click', () => {
        window.location.reload();
    })

    function removeTransition(e) {
        if (e.propertyName !== 'transform') return;
        this.classList.remove('winning','losing','drawing');
    }

    weapons.forEach(function(weapon) {
        weapon.addEventListener('transitionend', removeTransition);
    });
})();