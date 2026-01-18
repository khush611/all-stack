interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    message?: string
  }
  
  export function LoadingSpinner({ size = 'md', message }: LoadingSpinnerProps) {
    const sizeClasses = {
      sm: 'w-6 h-6',
      md: 'w-10 h-10',
      lg: 'w-16 h-16',
    }
  
    return (
      <div
        className="flex flex-col items-center justify-center gap-4"
        role="status"
        aria-live="polite"
      >
        <div
          className={`
            ${sizeClasses[size]} border-4 border-gray-200 border-t-red-500 
            rounded-full animate-spin
          `}
          aria-hidden="true"
        />
        {message && (
          <p className="text-gray-600 text-sm animate-pulse">{message}</p>
        )}
        <span className="sr-only">Loading...</span>
      </div>
    )
  }
  