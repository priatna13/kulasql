export function canOpenHint(opened: number, level: number): boolean {
  if (level !== 1 && level !== 2 && level !== 3) return false
  if (level <= opened) return true
  return level === opened + 1
}

export function visibleHints(
  hints: readonly string[],
  opened: number,
): { level: number; body?: string }[] {
  return [1, 2, 3].map((level) => {
    const body = hints[level - 1]
    if (level <= opened && typeof body === 'string') return { level, body }
    return { level }
  })
}
