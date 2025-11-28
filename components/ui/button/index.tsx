import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

interface ButtonProps  extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    fullWidth?: boolean 
    loading?: boolean   
    disabled?: boolean  
    onClick?: () => void 
    type?: 'button' | 'submit' | 'reset'
    children: React.ReactNode
    className?: string   
  }

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = 
      'inline-flex items-center justify-center gap-3 font-medium transition-all duration-450 ease-out rounded-md disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed focus:outline-none'

    const variants = {
      primary: 
        'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 active:bg-primary-700',
      secondary: 
        'bg-secondary-500 text-white hover:bg-secondary-600 focus:ring-secondary-500 active:bg-secondary-700',
      outline: 
        'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 focus:ring-primary-500 active:bg-primary-100',
      ghost: 
        'text-primary-500 hover:bg-primary-50 focus:ring-primary-500 active:bg-primary-100',
      success: 
        'bg-success-500 text-white hover:bg-success-600 focus:ring-success-500 active:bg-success-700',
      danger: 
        'bg-error-500 text-white hover:bg-error-600 focus:ring-error-500 active:bg-error-700',
    }

    const sizes = {
      sm: 'h-[42px] px-5 py-2 text-sm gap-2',
      md: 'h-[50px] px-7 py-3.5 text-base gap-3',
      lg: 'h-[58px] px-9 py-4 text-lg gap-3',
    }

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button