import { useMemo, useState } from 'react'
import { Column, Image, Row, Text } from '../../../index'

export default function ImageBlobEventsDemo() {
  const validBlob = useMemo(
    () =>
      new Blob(
        [
          '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="120"><rect width="240" height="120" rx="16" fill="#c2185b"/><circle cx="120" cy="60" r="28" fill="white"/></svg>',
        ],
        { type: 'image/svg+xml' },
      ),
    [],
  )
  const invalidBlob = useMemo(() => new Blob(['not an image'], { type: 'image/png' }), [])
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)

  return (
    <Row gap={2} wrap>
      <Column gap={0.5}>
        <Image
          src={validBlob}
          alt="Blob source example"
          fit="cover"
          onLoad={() => setLoaded(true)}
          viewProps={{ width: 12, height: 6, radius: 'medium' }}
        />
        <Text typo="body-small" color="secondary">
          {loaded ? 'Blob loaded' : 'Loading Blob'}
        </Text>
      </Column>

      <Column gap={0.5}>
        <Image
          src={invalidBlob}
          alt="Invalid Blob source"
          onError={() => setErrored(true)}
          viewProps={{ width: 12, height: 6, background: 'surfaceHover', radius: 'medium' }}
        />
        <Text typo="body-small" color="secondary">
          {errored ? 'Load error received' : 'Waiting for error'}
        </Text>
      </Column>
    </Row>
  )
}
