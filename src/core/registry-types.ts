export interface BreakpointRegistry {}
export interface ColorTokenRegistry {}

export type RegisteredBreakpointName = Extract<keyof BreakpointRegistry, string>
export type RegisteredColorTokenName = Extract<keyof ColorTokenRegistry, string>
