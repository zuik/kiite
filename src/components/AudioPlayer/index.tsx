import { Container, Text } from './styles'
import { Button } from '../Button'
import { useState } from 'react'

export function AudioPlayer() {
  const [filePath, setFilePath] = useState<String | undefined>(undefined)

  function handleOpenFile() {
    window.Main.sendMessage('Click')

    window.Main.openFileDialog()

    window.Main.on('open-file-dialog-reply', (filePath: string) => {
      setFilePath(filePath)
    })
  }
  return (
    <Container>
      <Text>Hello, world!</Text>
      <Button onClick={handleOpenFile}>Click here!</Button>
      <Text>{filePath ? `Filepath: ${filePath}` : 'No file selected'}</Text>
    </Container>
  )
}
