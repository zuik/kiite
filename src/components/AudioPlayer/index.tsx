import { Container, Text } from './styles'
import { Button } from '../Button'
import { useState } from 'react'

/**
 * Actual audio player component.
 * @param filePath path to the audio file
 */
function AudioPlayerControl(props: { filePath: string }) {
  const filePath = props.filePath
  return (
    <Container>
      <audio controls src={filePath}></audio>
    </Container>
  )
}

export function AudioPlayer() {
  const [filePath, setFilePath] = useState<string | undefined>(undefined)

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

      {filePath && <AudioPlayerControl filePath={filePath} />}
    </Container>
  )
}
