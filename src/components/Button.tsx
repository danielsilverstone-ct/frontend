import { forwardRef, FunctionComponent } from 'react'
import styles from './Button.module.scss'

interface Props {
  children: React.ReactNode
  onClick?: (e: any) => void
  type?: 'primary' | 'secondary'
  className?: string
  disabled?: boolean
}

const Button: FunctionComponent<Props> = forwardRef<HTMLButtonElement, Props>(
  ({ children, onClick, type, className, disabled }, ref) => {
    return (
      <button
        className={
          (type === 'secondary'
            ? styles.secondaryButton
            : styles.primaryButton) +
            ' ' +
            className ?? ''
        }
        onClick={onClick}
        ref={ref}
        disabled={disabled ?? false}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
