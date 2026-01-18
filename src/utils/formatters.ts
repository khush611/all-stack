export function formatId(id: number): string {
    return `#${id.toString().padStart(3, '0')}`
  }
  
  export function formatName(name: string): string {
    return name
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
  
  export function formatHeight(decimeters: number): string {
    const meters = decimeters / 10
    return `${meters.toFixed(1)}m`
  }
  
  export function formatWeight(hectograms: number): string {
    const kg = hectograms / 10
    return `${kg.toFixed(1)}kg`
  }
  