
const MAX_ATTEMPTS = 7;

let secretNumber;
let attempts;

// Selecionando os elementos do HTML
const guessInput = document.getElementById('guess');
const tryButton = document.getElementById('tryButton');
const resetButton = document.getElementById('resetButton');

const message = document.getElementById('message');
const usedDisplay = document.getElementById('used');
const remainingDisplay = document.getElementById('remaining');

const progressDots = [...document.querySelectorAll('.dot')];

const safeWrap = document.getElementById('safeWrap');
const safeStatus = document.getElementById('safeStatus');

const overlay = document.getElementById('overlay');
const successText = document.getElementById('successText');

// Sorteia um número aleatório entre 1 e 50
function drawSecretNumber() {
    return Math.floor(Math.random() * 50) + 1;
}

// Mostra uma mensagem na tela
function setMessage(text, type = '') {
    message.className = 'message' + (type ? ' ' + type : '');

    const symbol = type === 'good' ? '✓' :
        type === 'warn' ? '!' :
        type === 'error' ? '×' : '✦';

    message.innerHTML = `<span>${symbol} ${text}</span>`;
}

// Atualiza o contador de tentativas
function updateStats() {
    const remaining = MAX_ATTEMPTS - attempts;

    usedDisplay.textContent = `${attempts} / ${MAX_ATTEMPTS}`;
    remainingDisplay.textContent = remaining;

    progressDots.forEach((dot, index) => {
        dot.className = 'dot';

        if (index < attempts) {
            dot.classList.add(
                remaining <= 2 ? 'last' : 'used'
            );
        }
    });
}

// Finaliza o jogo
function finishGame(won) {
    guessInput.disabled = true;
    tryButton.disabled = true;

    if (won) {
        // Abre o cofre com animação
        safeWrap.classList.add('unlocked');

        safeStatus.textContent = '✧ COFRE DESBLOQUEADO';
        safeStatus.classList.add('open');

        successText.textContent =
            `A combinação era ${secretNumber}. Você conseguiu em ${attempts} ${attempts === 1 ? 'tentativa' : 'tentativas'}!`;

        setTimeout(() => {
            overlay.classList.add('show');
        }, 650);

    } else {
        setMessage(
            `Suas 7 tentativas acabaram. A senha era ${secretNumber}. Reinicie para tentar de novo.`,
            'error'
        );
    }
}

// Verifica o número digitado
function checkGuess() {

    if (guessInput.disabled) return;

    const rawValue = guessInput.value.trim();
    const guess = Number(rawValue);

    // Verifica se o número é válido
    if (
        rawValue === '' ||
        !Number.isInteger(guess) ||
        guess < 1 ||
        guess > 50
    ) {
        setMessage('Digite um número inteiro de 1 a 50.', 'error');
        guessInput.focus();
        return;
    }

    // Conta a tentativa
    attempts++;

    updateStats();

    const remaining = MAX_ATTEMPTS - attempts;

    // Se acertar
    if (guess === secretNumber) {

        setMessage(
            'Combinação perfeita! O mecanismo está abrindo…',
            'good'
        );

        finishGame(true);

    }

    // Se acabarem as tentativas
    else if (remaining === 0) {

        finishGame(false);

    }

    // Se restarem apenas duas tentativas
    else if (remaining <= 2) {

        const clue = guess < secretNumber
            ? 'A senha é maior!'
            : 'A senha é menor!';

        setMessage(
            `${clue} Atenção: só restam ${remaining} tentativas!`,
            'warn'
        );

    }

    // Dicas normais
    else {

        if (guess < secretNumber) {
            setMessage('A senha é maior!');
        } else {
            setMessage('A senha é menor!');
        }

    }

    guessInput.value = '';

    if (!guessInput.disabled) {
        guessInput.focus();
    }
}

// Reinicia o jogo e sorteia outra senha
function resetGame() {

    secretNumber = drawSecretNumber();

    attempts = 0;

    guessInput.disabled = false;
    tryButton.disabled = false;

    guessInput.value = '';

    safeWrap.classList.remove('unlocked');

    safeStatus.textContent = '● SISTEMA BLOQUEADO';
    safeStatus.classList.remove('open');

    overlay.classList.remove('show');

    updateStats();

    setMessage('Novo segredo sorteado. Boa sorte!');

    guessInput.focus();
}

// Eventos dos botões
tryButton.addEventListener('click', checkGuess);

guessInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        checkGuess();
    }
});

resetButton.addEventListener('click', resetGame);

document.getElementById('playAgain')
    .addEventListener('click', resetGame);

// Inicia o jogo automaticamente
resetGame();
