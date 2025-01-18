const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const path = require('path');
require('dotenv').config();
const LIST_ID = process.env.LIST_ID;
const API_KEY = process.env.API_KEY;
const TOKEN = process.env.TOKEN;

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 300,

    alwaysOnTop: true, // Ensures the window stays on top
    skipTaskbar: true, // Hides the window from the taskbar
    frame: false, // Optional: Makes the window framed
    transparent: true, // Optional: Transparent background
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  mainWindow.setAlwaysOnTop(true, 'screen-saver');
  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  123;
  mainWindow.setFullScreenable(false);

  mainWindow.loadFile('src/index.html');

  // Register a global shortcut
  globalShortcut.register('CommandOrControl+Shift+T', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
      mainWindow.focus();
      mainWindow.webContents.send('focus-input'); // Notify renderer to refocus input
    }
  });

  // Handle minimize request
  ipcMain.on('minimize-window', () => {
    if (mainWindow) {
      mainWindow.hide();
    }
  });

  ipcMain.on('close-window', () => {
    if (mainWindow) {
      mainWindow.close(); // Quit the app entirely
    }
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
