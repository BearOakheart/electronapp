const electron = require('electron');
const {shell} = electron;
const {app} = electron;
const {BrowserWindow} = electron;
const {ipcMain} = electron;

var file = require('file-system');
var fs = require('fs');
var readline = require('linebyline');

let win;
let timerTime;
var macroLoaded ="No";
var file;


function createWindow() {

  win = new BrowserWindow({width:800, height:600});

  win.loadURL(`file://${__dirname}/app/index.html`);
  win.openDevTools();

  win.on('closed', () => {
    win = null;
  });
  win.webContents.on('did-finish-load', (event, arg) => {
    if(macroLoaded == "Yes"){
      console.log("Macro has successfully loaded");
      event.sender.send('macro-loaded', macroLoaded);
      event.sender.send('file-loaded', file);
    }

  });

  ipcMain.on('btnStart', (event, arg) =>{
    console.log(arg);
    event.sender.send('timer-change', timerTime);
  });

  ipcMain.on('btnStop', (event, arg) =>{
    console.log(arg);
    event.sender.send('timer-stop', 0);

  });

  ipcMain.on('btnReset', (event, arg) =>{
    console.log(arg);
    timerTime = 0;

  });

  ipcMain.on('Time', (event, arg) =>{
    timerTime = arg;
  });

  ipcMain.on('list-append', (event, index, arg) =>{
    console.log("Nykyinen lista " +index+ arg);
    var logger = fs.createWriteStream('input.txt', {
      flags: 'a' // append old data will be preserved
    });
    logger.write(index+" "+arg+"\n");
    logger.end();
  });


}

function openMacro() {
  console.log('macro open');
  macroLoaded = "Yes";
  console.log(macroLoaded);
  shell.openItem('C://Users/Asmo/Desktop/macro.exe');
}

function createCsv(){
  fs.readFile('input.txt', function (err, data) {
     if (err) {
        return console.error(err);
     }
     console.log("Asynchronous read: " + data.toString());
     file = data.toString();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', openMacro);
app.on('ready', createCsv);
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {

    createWindow();
    openMacro();
  }

});
