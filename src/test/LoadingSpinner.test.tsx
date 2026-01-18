import { render, screen } from '@testing-library/react'
import { LoadingSpinner } from '@/components'

describe('LoadingSpinner', () => {
  it('renders with status role', () => {
    render(<LoadingSpinner />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('has accessible loading text', () => {
    render(<LoadingSpinner />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('displays optional message', () => {
    render(<LoadingSpinner message="Fetching data..." />)
    expect(screen.getByText('Fetching data...')).toBeInTheDocument()
  })

  it('applies different size classes', () => {
    const { container, rerender } = render(<LoadingSpinner size="sm" />)
    expect(container.querySelector('.w-6')).toBeInTheDocument()

    rerender(<LoadingSpinner size="lg" />)
    expect(container.querySelector('.w-16')).toBeInTheDocument()
  })
})
