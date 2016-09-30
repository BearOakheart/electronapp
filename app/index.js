// Require moment.js
const moment = require('moment');
// Require ipcRender
const {ipcRenderer} = require('electron');

var start = 0;
let timer = 0;
let currentTime;
let status;

// Helper function, to format the time
const secondsToTime = (s) => {
    let momentTime = moment.duration(s, 'seconds');
    let sec = momentTime.seconds() < 10 ? ('0' + momentTime.seconds()) : momentTime.seconds();
    let min = momentTime.minutes() < 10 ? ('0' + momentTime.minutes()) : momentTime.minutes();
    let hour = momentTime.hours() < 10 ? ('0' + momentTime.hours()) : momentTime.hours();

    return `${hour}:${min}:${sec}`;
};
// kuunnellaan napin eventti lähetetään siitä viesti IpcMainille main.js
var startTime = document.querySelector('#startTime');
startTime.addEventListener('click', function () {
    ipcRenderer.send('btnStart', 'Timer was started');
    start = 1;
});

var stopTime = document.querySelector('#stopTime');
stopTime.addEventListener('click', function () {
    ipcRenderer.send('btnStop', 'Timer was stopped');

});

var resetTime = document.querySelector('#resetTime');
resetTime.addEventListener('click', function () {
    ipcRenderer.send('btnReset', 'Timer was cleared');
      timerDiv.innerHTML = secondsToTime(0);
      currentTime = 0;
      start = 0;
});

ipcRenderer.on('macro-loaded', (event, arg) => {
  status = arg;
  macro.innerHTML = "Macro status:" + arg;
  macroStatus.innerHTML = "Online";

});

// Listen to the 'timer-change' event
ipcRenderer.on('timer-change', (event, t) => {
    // Initialize time with value send with event
    currentTime = t;


// Print out the time
    timerDiv.innerHTML = secondsToTime(currentTime);

// Execute every second

if(start == 1 && timer == 0){
    timer = setInterval(() => {


      currentTime = currentTime + 1;

        // Print out the time
        timerDiv.innerHTML = secondsToTime(currentTime);
        ipcRenderer.send('Time', currentTime);

        console.log(start);
    }, 1000); // 1 second
  }

});

ipcRenderer.on('timer-stop', (event, t) => {
  clearInterval(timer);
  timer = 0;
  console.log(timer);
});
