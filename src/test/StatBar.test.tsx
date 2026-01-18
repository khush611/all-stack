import { render, screen } from '@testing-library/react'
import { StatBar } from '@/components'

describe('StatBar', () => {
  it('renders the stat name and value', () => {
    render(<StatBar name="HP" value={65} />)

    expect(screen.getByText('HP')).toBeInTheDocument()
    expect(screen.getByText('65')).toBeInTheDocument()
  })

  it('renders a progress bar with correct aria attributes', () => {
    render(<StatBar name="Attack" value={100} maxValue={255} />)

    const progressbar = screen.getByRole('progressbar')
    expect(progressbar).toHaveAttribute('aria-valuenow', '100')
    expect(progressbar).toHaveAttribute('aria-valuemin', '0')
    expect(progressbar).toHaveAttribute('aria-valuemax', '255')
    expect(progressbar).toHaveAttribute('aria-label', 'Attack: 100')
  })

  it('uses default max value of 255', () => {
    render(<StatBar name="Speed" value={90} />)

    const progressbar = screen.getByRole('progressbar')
    expect(progressbar).toHaveAttribute('aria-valuemax', '255')
  })
})
