const interactiveSelector = [
  'a[href]',
  'button',
  'input',
  'select',
  'textarea',
  '[contenteditable="true"]',
  '[role="button"]',
  '[role="checkbox"]',
  '[role="link"]',
  '[role="radio"]',
  '[role="slider"]',
  '[role="spinbutton"]',
  '[role="switch"]',
  '[role="textbox"]',
].join(',')

export function fromInteractiveDescendant(
  eventTarget: EventTarget | null,
  currentTarget: HTMLElement,
): boolean {
  if (!(eventTarget instanceof Element) || eventTarget === currentTarget) {
    return false
  }

  const interactive = eventTarget.closest(interactiveSelector)
  return interactive !== null && interactive !== currentTarget
}
