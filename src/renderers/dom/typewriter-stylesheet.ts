import { ensureStaticStylesheet } from './static-stylesheet'

const stylesheet = `
:where([data-weave-typewriter-cursor]) {
  animation: weave-typewriter-cursor-blink 1000ms step-end infinite;
}

:where([data-weave-typewriter][data-weave-reduced-motion="reduce"] [data-weave-typewriter-cursor]) {
  animation: none;
}

@keyframes weave-typewriter-cursor-blink {
  0%, 49.999% {
    opacity: 1;
  }

  50%, 100% {
    opacity: 0;
  }
}
`

export function ensureTypewriterStylesheet(): void {
  ensureStaticStylesheet('typewriter', stylesheet)
}
