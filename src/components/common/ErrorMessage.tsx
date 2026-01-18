interface ErrorMessageProps {
    title?: string
    message: string
    onRetry?: () => void
  }
  
  export function ErrorMessage({
    title = 'Error',
    message,
    onRetry,
  }: ErrorMessageProps) {
    return (
      <div
        className="bg-red-50 border border-red-200 rounded-lg p-6 text-center"
        role="alert"
      >
        <div className="text-red-600 text-xl mb-2">⚠️</div>
        <h3 className="text-lg font-semibold text-red-800 mb-1">{title}</h3>
        <p className="text-red-600 text-sm mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 
                       transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 
                       focus:ring-offset-2"
          >
            Try Again
          </button>
        )}
      </div>
    )
  }
  