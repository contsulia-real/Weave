import type { ViewCoreProps, ViewDynamicBreakpointProps } from './view-types'

export type MusicVisualizationMode = 'bars' | 'waveform'
export type MusicVisualizationDirection = 'horizontal' | 'vertical'
export type MusicVisualizationAlign = 'start' | 'center' | 'end'
export type MusicVisualizationSource = HTMLMediaElement | MediaStream | AnalyserNode | null

export type MusicVisualizationViewProps = Omit<ViewCoreProps<HTMLDivElement>, 'children' | 'role'> &
  ViewDynamicBreakpointProps

export interface MusicVisualizationProps {
  /** A media player, a live recording stream, or an existing Web Audio analyser. */
  source: MusicVisualizationSource
  mode?: MusicVisualizationMode
  /** Direction of the frequency bars; not used for waveform. */
  direction?: MusicVisualizationDirection
  /** Position of the bars along their amplitude axis; not used for waveform. */
  align?: MusicVisualizationAlign
  viewProps?: MusicVisualizationViewProps
}
