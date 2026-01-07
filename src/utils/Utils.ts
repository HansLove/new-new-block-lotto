/**
 * Game identifiers used across the platform
 */
export const GAMES_ID = {
  secuencer: 'secuencer',
  squares: 'squares',
  blackjack: 'blackjack',
  poker: 'poker',
  dice: 'dice',
  roulette: 'roulette',
  slots: 'slots',
  lotto: 'lotto',
} as const;

export type GameId = keyof typeof GAMES_ID;

