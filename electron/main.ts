import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { promises as fs } from 'fs'
import babelConfig from '../babel.config'
import { Howl, Howler } from 'howler';

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


async function registerListeners() {
  /**
   * This comes from bridge integration, check bridge.ts
   */
  ipcMain.on('message', (_, message) => {
    console.log(message)
  })
  ipcMain.on('open-file-dialog', async (event, _) => {
    const filePaths = dialog.showOpenDialogSync({
      properties: ['openFile', 'multiSelections'],
    })
    console.log(`selected files ${filePaths}`)
    if (filePaths) {
      // const fileData: Buffer = await fs.readFile(filePaths[0])
      const blob = ""
      // const blob = fileData.toString("base64") 
      // const objectURL = window.URL.createObjectURL(blob)
      // console.log(blob)
      const sound = new Howl({
        src: [filePaths[0]]
      });

      sound.play();
      event.reply('open-file-dialog-reply', { "filePath": filePaths[0], "blob": `data:application/ogg;base64;${blob}` })
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
