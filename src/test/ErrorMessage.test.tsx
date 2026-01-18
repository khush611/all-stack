import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorMessage } from '@/components'

describe('ErrorMessage', () => {
  it('renders the error message', () => {
    render(<ErrorMessage message="Something went wrong" />)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('renders custom title', () => {
    render(<ErrorMessage title="Network Error" message="Failed to fetch" />)
    expect(screen.getByText('Network Error')).toBeInTheDocument()
  })

  it('renders default title when not provided', () => {
    render(<ErrorMessage message="Failed to fetch" />)
    expect(screen.getByText('Error')).toBeInTheDocument()
  })

  it('renders retry button when onRetry is provided', () => {
    const handleRetry = jest.fn()
    render(<ErrorMessage message="Failed" onRetry={handleRetry} />)

    expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument()
  })

  it('calls onRetry when retry button is clicked', () => {
    const handleRetry = jest.fn()
    render(<ErrorMessage message="Failed" onRetry={handleRetry} />)

    fireEvent.click(screen.getByRole('button', { name: 'Try Again' }))
    expect(handleRetry).toHaveBeenCalledTimes(1)
  })

  it('does not render retry button when onRetry is not provided', () => {
    render(<ErrorMessage message="Failed" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('has alert role for accessibility', () => {
    render(<ErrorMessage message="Error occurred" />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})
