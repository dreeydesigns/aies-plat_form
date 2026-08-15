const { app, BrowserWindow, shell, ipcMain } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow = null;

// Register custom protocol for Google OAuth Callback
const PROTOCOL = 'aiessat';
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, [path.resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient(PROTOCOL);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 1024,
    minHeight: 700,
    title: 'AIES SAT — Adaptive Learning Platform',
    icon: path.join(__dirname, '../public/favicon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      sandbox: true
    }
  });

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:') || url.startsWith('http:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Handle Deep Link Protocol Handshake (Windows & macOS)
app.on('open-url', (event, urlStr) => {
  event.preventDefault();
  handleProtocolUrl(urlStr);
});

// Windows Second Instance Handler for Protocol Activation
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
    const urlStr = commandLine.find(arg => arg.startsWith(`${PROTOCOL}://`));
    if (urlStr) {
      handleProtocolUrl(urlStr);
    }
  });

  app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });
}

function handleProtocolUrl(urlStr) {
  if (!mainWindow) return;
  try {
    const parsed = new URL(urlStr);
    if (parsed.pathname.includes('auth-callback') || parsed.host === 'auth-callback') {
      const token = parsed.searchParams.get('token') || parsed.searchParams.get('credential');
      mainWindow.webContents.send('oauth-callback-received', { token });
    }
  } catch (err) {
    console.error('Error parsing protocol URL:', err);
  }
}

// System Browser OAuth Trigger via IPC
ipcMain.handle('open-external-oauth', async (event, provider) => {
  const authUrl = `https://aies-plat-form.vercel.app/api/auth-desktop?provider=${provider}&redirect=${PROTOCOL}://auth-callback`;
  shell.openExternal(authUrl);
  return { status: 'opened' };
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
