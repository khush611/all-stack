import { render, screen, fireEvent } from '@testing-library/react'
import { Pagination } from '@/components'

describe('Pagination', () => {
  it('displays current page and total pages', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={10}
        onPrevious={() => { }}
        onNext={() => { }}
      />
    )

    expect(screen.getByText('3')).toBeInTheDocument() // currentPage + 1
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('disables previous button on first page', () => {
    render(
      <Pagination
        currentPage={0}
        totalPages={10}
        onPrevious={() => { }}
        onNext={() => { }}
      />
    )

    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled()
  })

  it('disables next button on last page', () => {
    render(
      <Pagination
        currentPage={9}
        totalPages={10}
        onPrevious={() => { }}
        onNext={() => { }}
      />
    )

    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled()
  })

  it('calls onPrevious when previous button is clicked', () => {
    const handlePrevious = jest.fn()
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPrevious={handlePrevious}
        onNext={() => { }}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /previous/i }))
    expect(handlePrevious).toHaveBeenCalledTimes(1)
  })

  it('calls onNext when next button is clicked', () => {
    const handleNext = jest.fn()
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPrevious={() => { }}
        onNext={handleNext}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    expect(handleNext).toHaveBeenCalledTimes(1)
  })

  it('has accessible navigation role', () => {
    render(
      <Pagination
        currentPage={0}
        totalPages={10}
        onPrevious={() => { }}
        onNext={() => { }}
      />
    )

    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument()
  })
})
