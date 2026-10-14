import { Typewriter } from '../../../index'

export default function TypewriterOnceDemo() {
  return (
    <Typewriter
      texts={['First phrase', 'Final phrase stays']}
      typeInterval={60}
      deleteInterval={30}
      pauseDuration={600}
      loop={false}
      showCursor={false}
      typo="body-large"
    />
  )
}
