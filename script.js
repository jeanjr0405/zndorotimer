//configuração do cronometro
let timer;
let isRunning = false;
let timeLeft;
let isFocusMode = true; //

const startPauseButton = document.getElementById('start-pause');
const resetButton = document.getElementById('reset');
const minutesSpan = document.getElementById('minutes');
const secondsSpan = document.getElementById('seconds');

// caregar configs salvas
function loadConfig() {
    const savedFocusTime = parseInt(localStorage.getItem('focusTime')) || 25;
    const savedBreakTime = parseInt(localStorage.getItem('breakTime')) || 5;
    const savedBackgroundImage = localStorage.getItem('backgroundImage') || '/assets/img01.jpg';

    document.getElementById('focus-time').value = savedFocusTime;
    document.getElementById('break-time').value = savedBreakTime;
    document.getElementById('background-image').value = savedBackgroundImage;

    document.body.style.backgroundImage = `url(${savedBackgroundImage})`;

    timeLeft = (isFocusMode ? savedFocusTime : savedBreakTime) * 60;
    updateTimerDisplay();
}

// atualizar o cronometro
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    minutesSpan.textContent = minutes.toString().padStart(2, '0');
    secondsSpan.textContent = seconds.toString().padStart(2, '0');
}

// reseter o cronometro
function resetTimer() {
    clearInterval(timer);
    isRunning = false;

    const focusTime = parseInt(localStorage.getItem('focusTime')) || 25;
    const breakTime = parseInt(localStorage.getItem('breakTime')) || 5;

    timeLeft = (isFocusMode ? focusTime : breakTime) * 60;
    updateTimerDisplay();
    startPauseButton.textContent = 'Start';
}

// botão de reset
resetButton.addEventListener('click', resetTimer);

// salvar as configs e fechar 
document.getElementById('save-config').addEventListener('click', () => {
    const focusTimeInput = parseInt(document.getElementById('focus-time').value);
    const breakTimeInput = parseInt(document.getElementById('break-time').value);
    const backgroundImageInput = document.getElementById('background-image').value;

    localStorage.setItem('focusTime', focusTimeInput);
    localStorage.setItem('breakTime', breakTimeInput);
    localStorage.setItem('backgroundImage', backgroundImageInput);

    // atualizar o tempo que falta
     if (isFocusMode) {
        timeLeft = focusTimeInput * 60;
    } else {
        timeLeft = breakTimeInput * 60;
    }
    updateTimerDisplay();

    // Atualizar a imagem de fundo
    document.body.style.backgroundImage = `url(${backgroundImageInput})`;
    
    // fechar as configs
    document.getElementById('config-modal').style.display = 'none';
});

document.getElementById('focus-tab').addEventListener('click', () => {
    isFocusMode = true;
    resetTimer();

    // Mudar estilos das abas
    document.getElementById('focus-tab').classList.add('active');
    document.getElementById('focus-tab').classList.remove('inactive');
    document.getElementById('break-tab').classList.add('inactive');
    document.getElementById('break-tab').classList.remove('active');
});

document.getElementById('break-tab').addEventListener('click', () => {
    isFocusMode = false;
    resetTimer();

    // Mudar estilos das abas
    document.getElementById('break-tab').classList.add('active');
    document.getElementById('break-tab').classList.remove('inactive');
    document.getElementById('focus-tab').classList.add('inactive');
    document.getElementById('focus-tab').classList.remove('active');
});

// para abrir a aba de config
document.getElementById('config-btn').addEventListener('click', () => {
    document.getElementById('config-modal').style.display = 'flex';
});

// fechar as configs ao clicar no x
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('config-modal').style.display = 'none';
});

// fechar as configs ao clicar fora
window.onclick = function(event) {
    if (event.target == document.getElementById('config-modal')) {
        document.getElementById('config-modal').style.display = 'none';
    }
};

// carregar as configs quando iniciar
window.onload = loadConfig;

startPauseButton.addEventListener('click', () => {
    if (isRunning) {
        clearInterval(timer);
        startPauseButton.textContent = 'Start';
    } else {
        timer = setInterval(updateTimer, 1000);
        startPauseButton.textContent = 'Pause';
    }
    isRunning = !isRunning;
});

function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
    } else {
        clearInterval(timer);
        alert('O tempo acabou!');
        resetTimer();

        const alarmSound = document.getElementById('alarm-sound');
        alarmSound.play();

        resetTimer();
    }
}