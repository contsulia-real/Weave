declare global {
  namespace Weave {
    interface BreakpointRegistry {}
    interface ColorTokenRegistry {}
  }
}

export type RegisteredBreakpointName = Extract<keyof Weave.BreakpointRegistry, string>
export type RegisteredColorTokenName = Extract<keyof Weave.ColorTokenRegistry, string>
