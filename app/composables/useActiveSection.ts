export const sections = [
  { id: 'profundidade', label: 'Profundidade' },
  { id: 'horizonte', label: 'Horizonte' },
  { id: 'descida', label: 'Descida' }
] as const

// Índice da seção visível no momento (compartilhado entre header e seções)
export const useActiveSection = () => useState('active-section', () => 0)
