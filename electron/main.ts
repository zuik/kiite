import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { promises as fs } from 'fs'
const dataurl = require('dataurl')

let mainWindow: BrowserWindow | null

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

// const assetsPath =
//   process.env.NODE_ENV === 'production'
//     ? process.resourcesPath
//     : app.getAppPath()

function createWindow() {
  mainWindow = new BrowserWindow({
    // icon: path.join(assetsPath, 'assets', 'icon.png'),
    width: 1100,
    height: 700,
    backgroundColor: '#191622',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  })

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

/**
 * Convert local filePath to a URL that we can reference from the browser.
 * @param filePath local path to the file
 */
async function getFileURL(filePath: string): Promise<string> {
  const fileData = await fs.readFile(filePath)

  return dataurl.convert({ fileData, mimetype: 'audio/mp3' })
}

async function registerListeners() {
  /**
   * This comes from bridge integration, check bridge.ts
   */
  ipcMain.on('message', (_, message) => {
    console.log(message)
  })
  ipcMain.on('open-file-dialog', (event, _) => {
    const filePaths = dialog.showOpenDialogSync({
      properties: ['openFile', 'multiSelections'],
    })
    console.log(`selected files ${filePaths}`)
    if (filePaths) {
      event.reply('open-file-dialog-reply', getFileURL(filePaths[0]))
    }
  })
}

app
  .on('ready', createWindow)
  .whenReady()
  .then(registerListeners)
  .catch(e => console.error(e))

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
