export type WarmindoTable = {
  columns: string[]
  rows: string[][]
}

export function parseWarmindoCsv(text: string): WarmindoTable {
  const lines = text.trim().split(/\r?\n/).filter((line) => line.length > 0)
  const header = lines[0]
  if (!header) return { columns: [], rows: [] }
  const columns = header.split(',')
  const rows = lines.slice(1).map((line) => line.split(','))
  return { columns, rows }
}

export const warmindoIdeas = [
  {
    title: 'Menu per shift',
    body: 'Jumlahkan porsi per menu, lalu pisahkan shift pagi dan malam.',
  },
  {
    title: 'Omzet kasar per hari',
    body: 'Kalikan porsi dengan harga_satuan, lalu jumlahkan per tanggal.',
  },
  {
    title: 'Es teh, pagi lawan malam',
    body: 'Saring menu Es teh, lalu bandingkan porsi pada shift pagi dan malam.',
  },
] as const
