import {
  formatId,
  formatName,
  formatHeight,
  formatWeight,
  getStatColor,
  getStatWidth,
} from '@/utils'

describe('pokemon utils', () => {
  describe('formatId', () => {
    it('formats single digit id', () => {
      expect(formatId(1)).toBe('#001')
    })

    it('formats double digit id', () => {
      expect(formatId(25)).toBe('#025')
    })

    it('formats triple digit id', () => {
      expect(formatId(150)).toBe('#150')
    })

    it('formats four digit id', () => {
      expect(formatId(1000)).toBe('#1000')
    })
  })

  describe('formatName', () => {
    it('capitalizes first letter', () => {
      expect(formatName('pikachu')).toBe('Pikachu')
    })

    it('handles hyphenated names', () => {
      expect(formatName('mr-mime')).toBe('Mr Mime')
    })

    it('handles multi-hyphenated names', () => {
      expect(formatName('tapu-koko')).toBe('Tapu Koko')
    })
  })

  describe('formatHeight', () => {
    it('converts decimeters to meters', () => {
      expect(formatHeight(7)).toBe('0.7m')
    })

    it('handles larger heights', () => {
      expect(formatHeight(20)).toBe('2.0m')
    })
  })

  describe('formatWeight', () => {
    it('converts hectograms to kilograms', () => {
      expect(formatWeight(60)).toBe('6.0kg')
    })

    it('handles larger weights', () => {
      expect(formatWeight(1000)).toBe('100.0kg')
    })
  })

  describe('getStatColor', () => {
    it('returns red for low stats', () => {
      expect(getStatColor(30)).toBe('bg-red-500')
    })

    it('returns yellow for medium stats', () => {
      expect(getStatColor(60)).toBe('bg-yellow-500')
    })

    it('returns green for good stats', () => {
      expect(getStatColor(90)).toBe('bg-green-500')
    })

    it('returns blue for excellent stats', () => {
      expect(getStatColor(120)).toBe('bg-blue-500')
    })
  })

  describe('getStatWidth', () => {
    it('calculates percentage correctly', () => {
      expect(getStatWidth(127, 255)).toBe('49.80392156862745%')
    })

    it('caps at 100%', () => {
      expect(getStatWidth(300, 255)).toBe('100%')
    })

    it('uses default max of 255', () => {
      expect(getStatWidth(255)).toBe('100%')
    })
  })
})
