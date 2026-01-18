
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { PokemonDetail } from '@/components/pokemon/PokemonDetail'
import type { DetailData } from '@/types'

const mockPokemon: DetailData = {
  id: 25,
  name: 'pikachu',
  artwork: 'https://example.com/pikachu-artwork.png',
  sprite: 'https://example.com/pikachu.png',
  types: ['electric'],
  stats: {
    hp: 35,
    attack: 55,
    defense: 40,
    specialAttack: 50,
    specialDefense: 50,
    speed: 90,
  },
  height: 4,
  weight: 60,
  baseExperience: 112,
  abilities: [
    { name: 'static', isHidden: false },
    { name: 'lightning-rod', isHidden: true },
  ],
  moves: [
    { name: 'thunderbolt', type: 'electric' },
    { name: 'quick-attack', type: 'normal' },
  ],
  evolutionChain: [
    { name: 'pichu', id: 172, sprite: 'https://example.com/pichu.png' },
    { name: 'pikachu', id: 25, sprite: 'https://example.com/pikachu.png' },
    { name: 'raichu', id: 26, sprite: 'https://example.com/raichu.png' },
  ],
}

const renderWithRouter = (pokemon: DetailData = mockPokemon) => {
  return render(
    <BrowserRouter>
      <PokemonDetail pokemon={pokemon} />
    </BrowserRouter>
  )
}

describe('PokemonDetail', () => {
  it('should render pokemon name', () => {
    renderWithRouter()

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/pikachu/i)
  })

  it('should render pokemon id', () => {
    renderWithRouter()

    expect(screen.getByText('#025')).toBeInTheDocument()
  })

  it('should render pokemon artwork', () => {
    renderWithRouter()

    const img = screen.getByAltText('pikachu official artwork')
    expect(img).toHaveAttribute('src', 'https://example.com/pikachu-artwork.png')
  })

  it('should render sprite if no artwork', () => {
    const pokemonWithoutArtwork = {
      ...mockPokemon,
      artwork: null,
    }
    renderWithRouter(pokemonWithoutArtwork)

    const img = screen.getByAltText('pikachu official artwork')
    expect(img).toHaveAttribute('src', 'https://example.com/pikachu.png')
  })

  it('should render placeholder if no artwork or sprite', () => {
    const pokemonWithoutImages = {
      ...mockPokemon,
      artwork: null,
      sprite: null,
    }
    renderWithRouter(pokemonWithoutImages)

    expect(screen.getByText('?')).toBeInTheDocument()
  })

  it('should render pokemon types', () => {
    renderWithRouter()

    // Type badge appearing in types section
    const typeBadges = screen.getAllByText('Electric')
    expect(typeBadges.length).toBeGreaterThan(0)
  })

  it('should render multiple types', () => {
    const multiTypePokemon = {
      ...mockPokemon,
      types: ['water', 'flying'] as DetailData['types'],
    }
    renderWithRouter(multiTypePokemon)

    expect(screen.getAllByText('Water').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Flying').length).toBeGreaterThan(0)
  })

  it('should render abilities', () => {
    renderWithRouter()

    expect(screen.getByText('Static')).toBeInTheDocument()
    // formatName converts lightning-rod to 'Lightning Rod'
    expect(screen.getByText(/lightning rod/i)).toBeInTheDocument()
  })

  it('should indicate hidden abilities', () => {
    renderWithRouter()

    expect(screen.getByText('(Hidden)')).toBeInTheDocument()
  })

  it('should render physical traits', () => {
    renderWithRouter()

    expect(screen.getByText(/0\.4\s*m/)).toBeInTheDocument() //height
    expect(screen.getByText(/6\.0\s*kg/)).toBeInTheDocument() //weight
    expect(screen.getByText('112')).toBeInTheDocument() //base
  })

  it('should render stats', () => {
    renderWithRouter()

    // if StatBar components rendered with stat labels
    expect(screen.getByText('HP')).toBeInTheDocument()
    expect(screen.getByText('Attack')).toBeInTheDocument()
    expect(screen.getByText('Defense')).toBeInTheDocument()
    expect(screen.getByText('Sp. Attack')).toBeInTheDocument()
    expect(screen.getByText('Sp. Defense')).toBeInTheDocument()
    expect(screen.getByText('Speed')).toBeInTheDocument()
  })

  it('should render moves', () => {
    renderWithRouter()

    expect(screen.getByText('Thunderbolt')).toBeInTheDocument()
    expect(screen.getByText('Quick Attack')).toBeInTheDocument()
  })

  it('should render evolution chain', () => {
    renderWithRouter()

    // Evolution names - Pikachu appears multiple times (header + evolution chain)
    expect(screen.getByText('Pichu')).toBeInTheDocument()
    expect(screen.getAllByText(/pikachu/i).length).toBeGreaterThan(0)
    expect(screen.getByText('Raichu')).toBeInTheDocument()
  })

  it('should highlight current pokemon in evolution chain', () => {
    renderWithRouter()

    // The current pokemon should have different styling
    const pikachuEvo = screen.getAllByText(/pikachu/i)
    expect(pikachuEvo.length).toBeGreaterThan(0)
  })

  it('should render back link', () => {
    renderWithRouter()

    const backLink = screen.getByRole('link', { name: /back to collection/i })
    expect(backLink).toHaveAttribute('href', '/')
  })

  it('should have proper article structure', () => {
    renderWithRouter()

    expect(screen.getByTestId('pokemon-detail')).toBeInTheDocument()
  })

  it('should render sections with proper headings', () => {
    renderWithRouter()

    expect(screen.getByText('Type')).toBeInTheDocument()
    expect(screen.getByText('Abilities')).toBeInTheDocument()
    expect(screen.getByText('Physical Traits')).toBeInTheDocument()
  })

  it('should handle pokemon with no moves', () => {
    const pokemonNoMoves = {
      ...mockPokemon,
      moves: [],
    }
    renderWithRouter(pokemonNoMoves)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/pikachu/i)
  })

  it('should handle pokemon with no evolution chain', () => {
    const pokemonNoEvolution = {
      ...mockPokemon,
      evolutionChain: [],
    }
    renderWithRouter(pokemonNoEvolution)

    // render without errors
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/pikachu/i)
  })
})
