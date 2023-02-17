const { app, BrowserWindow } = require('electron');

const isMac = process.platform === 'darwin';

function createWindow(){
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 1200,
  });

  mainWindow.loadFile('index.html');
  mainWindow.setMenuBarVisibility(false);
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit();
  }
});
//