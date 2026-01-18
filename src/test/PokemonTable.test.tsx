import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { PokemonTable } from '@/components/pokemon/PokemonTable'
import type { TableData, SortField, SortDirection } from '@/types'

// Mock useNavigate
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}))

const mockPokemon: TableData[] = [
    {
        id: 1,
        name: 'bulbasaur',
        sprite: 'https://example.com/bulbasaur.png',
        baseExperience: 64,
        types: ['grass', 'poison'],
        hp: 45,
        speed: 45,
        primaryAbility: 'overgrow',
    },
    {
        id: 4,
        name: 'charmander',
        sprite: 'https://example.com/charmander.png',
        baseExperience: 62,
        types: ['fire'],
        hp: 39,
        speed: 65,
        primaryAbility: 'blaze',
    },
    {
        id: 7,
        name: 'squirtle',
        sprite: null,
        baseExperience: 63,
        types: ['water'],
        hp: 44,
        speed: 43,
        primaryAbility: 'torrent',
    },
]

const defaultProps = {
    pokemon: mockPokemon,
    sortField: 'name' as SortField,
    sortDirection: 'asc' as SortDirection,
    onSort: jest.fn(),
}

const renderWithRouter = (props = {}) => {
    return render(
        <BrowserRouter>
            <PokemonTable {...defaultProps} {...props} />
        </BrowserRouter>
    )
}

describe('PokemonTable', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should render table with pokemon data', () => {
        renderWithRouter()

        expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
        expect(screen.getByText('Charmander')).toBeInTheDocument()
        expect(screen.getByText('Squirtle')).toBeInTheDocument()
    })

    it('should render pokemon types', () => {
        renderWithRouter()

        expect(screen.getByText('Grass')).toBeInTheDocument()
        expect(screen.getByText('Poison')).toBeInTheDocument()
        expect(screen.getByText('Fire')).toBeInTheDocument()
        expect(screen.getByText('Water')).toBeInTheDocument()
    })

    it('should render pokemon stats', () => {
        renderWithRouter()

        // HP values (may appear multiple times)
        expect(screen.getAllByText('45').length).toBeGreaterThan(0)
        expect(screen.getAllByText('39').length).toBeGreaterThan(0)
        expect(screen.getAllByText('44').length).toBeGreaterThan(0)
    })

    it('should render pokemon sprites', () => {
        renderWithRouter()

        // should get only the sprite images 
        const sprites = screen.getAllByAltText(/sprite/i)
        expect(sprites).toHaveLength(2) // Only 2 have sprites, squirtle is null
    })

    it('should render placeholder for missing sprites', () => {
        renderWithRouter()

        // Squirtle should have a placeholder 
        expect(screen.getByText('?')).toBeInTheDocument()
    })

    it('should call onSort when sortable header is clicked', () => {
        const onSort = jest.fn()
        renderWithRouter({ onSort })

        // Click check
        const pokemonHeader = screen.getByRole('columnheader', { name: /pokémon/i })
        fireEvent.click(pokemonHeader)

        expect(onSort).toHaveBeenCalledWith('name')
    })

    it('should call onSort with hp when HP header is clicked', () => {
        const onSort = jest.fn()
        renderWithRouter({ onSort })

        const hpHeader = screen.getByRole('columnheader', { name: /hp/i })
        fireEvent.click(hpHeader)

        expect(onSort).toHaveBeenCalledWith('hp')
    })

    it('should call onSort with speed when Speed header is clicked', () => {
        const onSort = jest.fn()
        renderWithRouter({ onSort })

        const speedHeader = screen.getByRole('columnheader', { name: /speed/i })
        fireEvent.click(speedHeader)

        expect(onSort).toHaveBeenCalledWith('speed')
    })

    it('should show ascending indicator for active sort field', () => {
        renderWithRouter({ sortField: 'name', sortDirection: 'asc' })

        const pokemonHeader = screen.getByRole('columnheader', { name: /pokémon/i })
        expect(pokemonHeader).toHaveAttribute('aria-sort', 'ascending')
    })

    it('should show descending indicator for active sort field', () => {
        renderWithRouter({ sortField: 'name', sortDirection: 'desc' })

        const pokemonHeader = screen.getByRole('columnheader', { name: /pokémon/i })
        expect(pokemonHeader).toHaveAttribute('aria-sort', 'descending')
    })

    it('should show none for inactive sort fields', () => {
        renderWithRouter({ sortField: 'hp', sortDirection: 'asc' })

        const pokemonHeader = screen.getByRole('columnheader', { name: /pokémon/i })
        expect(pokemonHeader).toHaveAttribute('aria-sort', 'none')
    })

    it('should navigate to detail page when row is clicked', () => {
        renderWithRouter()

        const firstRow = screen.getByText('Bulbasaur').closest('tr')
        if (firstRow) {
            fireEvent.click(firstRow)
        }

        expect(mockNavigate).toHaveBeenCalledWith('/pokemon/1')
    })

    it('should navigate on Enter key press', () => {
        renderWithRouter()

        const firstRow = screen.getByText('Bulbasaur').closest('tr')
        if (firstRow) {
            fireEvent.keyDown(firstRow, { key: 'Enter' })
        }

        expect(mockNavigate).toHaveBeenCalledWith('/pokemon/1')
    })

    it('should navigate on Space key press', () => {
        renderWithRouter()

        const secondRow = screen.getByText('Charmander').closest('tr')
        if (secondRow) {
            fireEvent.keyDown(secondRow, { key: ' ' })
        }

        expect(mockNavigate).toHaveBeenCalledWith('/pokemon/4')
    })

    it('should not navigate on other key presses', () => {
        renderWithRouter()

        const firstRow = screen.getByText('Bulbasaur').closest('tr')
        if (firstRow) {
            fireEvent.keyDown(firstRow, { key: 'Tab' })
        }

        expect(mockNavigate).not.toHaveBeenCalled()
    })

    it('should render empty table when no pokemon', () => {
        renderWithRouter({ pokemon: [] })

        const table = screen.getByRole('table')
        expect(table).toBeInTheDocument()

        // Should still have headers but no data rows
        expect(screen.queryByText('Bulbasaur')).not.toBeInTheDocument()
    })

    it('should have accessible table structure', () => {
        renderWithRouter()

        expect(screen.getByRole('table')).toBeInTheDocument()
        expect(screen.getAllByRole('columnheader').length).toBeGreaterThan(0)
        expect(screen.getAllByRole('row').length).toBeGreaterThan(1) // Header + data rows
    })
})
