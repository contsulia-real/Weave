import { Button } from '../../../index'

export default function ButtonResponsiveButtonDemo() {
  return (
    <Button
      text="Responsive action"
      size="small"
      variant="ghost"
      md={{ size: 'medium', variant: 'secondary' }}
      lg={{ size: 'large', variant: 'primary' }}
    />
  )
}
