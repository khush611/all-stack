import { render, screen } from '@testing-library/react'
import { TypeBadge } from '@/components'

describe('TypeBadge', () => {
  it('renders the type name', () => {
    render(<TypeBadge type="fire" />)
    expect(screen.getByText('Fire')).toBeInTheDocument()
  })

  it('renders the type icon when showIcon is true', () => {
    render(<TypeBadge type="fire" showIcon={true} />)
    expect(screen.getByText('🔥')).toBeInTheDocument()
  })

  it('does not render the icon when showIcon is false', () => {
    render(<TypeBadge type="fire" showIcon={false} />)
    expect(screen.queryByText('🔥')).not.toBeInTheDocument()
  })

  it('applies different size classes', () => {
    const { rerender } = render(<TypeBadge type="water" size="sm" />)
    expect(screen.getByRole('img', { name: 'water type' })).toHaveClass('text-xs')

    rerender(<TypeBadge type="water" size="lg" />)
    expect(screen.getByRole('img', { name: 'water type' })).toHaveClass('text-base')
  })

  it('has accessible label', () => {
    render(<TypeBadge type="grass" />)
    expect(screen.getByRole('img', { name: 'grass type' })).toBeInTheDocument()
  })
})
