import { app, BrowserWindow } from 'electron';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const PRELOAD_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

let preloadWindow: BrowserWindow | null = null;
let mainWindow: BrowserWindow | null = null;

const createPreloadWindow = (): BrowserWindow => {
  const window = new BrowserWindow({
    width: 300,
    height: 300,
    transparent: true,
    autoHideMenuBar: true,
    alwaysOnTop: true,
    resizable: false,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  window.loadURL(PRELOAD_WINDOW_WEBPACK_ENTRY);
  window.on('ready-to-show', () => {
    window.show();
  });

  return window;
};

const createMainWindow = (): BrowserWindow => {
  const window = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
    show: false
  });

  window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  
  window.on('ready-to-show', () => {
    if (preloadWindow) {
      preloadWindow.close();
      preloadWindow = null;
    }
    window.show();
    window.webContents.openDevTools(); 
  });

  return window;
};

if (require('electron-squirrel-startup')) {
  app.whenReady().then(() => {
    preloadWindow = createPreloadWindow();
    
    setTimeout(() => {
      app.quit();
    }, 2000);
  });
} else {
  app.whenReady().then(() => {
    preloadWindow = createPreloadWindow();
    
    mainWindow = createMainWindow();
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    preloadWindow = createPreloadWindow();
    mainWindow = createMainWindow();
  }
});