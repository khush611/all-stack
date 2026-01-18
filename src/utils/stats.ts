export function getStatColor(value: number): string {
    if (value < 50) return 'bg-red-500'
    if (value < 80) return 'bg-yellow-500'
    if (value < 100) return 'bg-green-500'
    return 'bg-blue-500'
  }
  
  export function getStatWidth(value: number, max: number = 255): string {
    const percentage = Math.min((value / max) * 100, 100)
    return `${percentage}%`
  }
  