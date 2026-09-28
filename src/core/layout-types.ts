import type {
  ViewDirection,
  ViewProps,
} from './view-types'

type FixedLayoutProps = Omit<
  ViewProps<HTMLDivElement>,
  'layout'
> & {
  layout?: never
}

export type FlexProps = FixedLayoutProps & {
  direction?: ViewDirection
}

export type RowProps = Omit<
  FixedLayoutProps,
  'direction'
> & {
  direction?: never
}

export type ColumnProps = RowProps
export type GridProps = FixedLayoutProps
export type StackProps = FixedLayoutProps
export type AbsoluteProps = FixedLayoutProps
