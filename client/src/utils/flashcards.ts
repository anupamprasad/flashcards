import { flashcards as flashcardSeed } from '../data/flashcards.ts'
import type { Flashcard } from '../types/flashcard.ts'

/**
 * Minimal shape persisted to localStorage for each flashcard.
 * The full vocabulary is sourced from the static seed file.
 */
export type PersistedCard = Pick<Flashcard, 'id' | 'is_known'>

/**
 * Defensive type guard for persisted flashcard entries.
 */
export function isPersistedCard(value: unknown): value is PersistedCard {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Partial<Record<keyof PersistedCard, unknown>>
  return typeof candidate.id === 'number' && typeof candidate.is_known === 'boolean'
}

/**
 * Creates a fresh, mutable copy of the seed flashcard deck.
 */
export function createSeedDeck(): Flashcard[] {
  return flashcardSeed.map((card) => ({ ...card }))
}

/**
 * Restores the flashcard deck from a persisted payload.
 * Returns `null` when the payload is absent or invalid.
 */
export function restoreDeckFromStorage(
  rawValue: string | null,
  seedDeck: Flashcard[],
): Flashcard[] | null {
  if (!rawValue) {
    return null
  }

  try {
    const parsed: unknown = JSON.parse(rawValue)

    if (!Array.isArray(parsed)) {
      return null
    }

    const persistedEntries = parsed.filter(isPersistedCard) as PersistedCard[]

    if (persistedEntries.length === 0) {
      return null
    }

    const persistedMap = new Map<number, boolean>(
      persistedEntries.map((entry) => [entry.id, entry.is_known]),
    )

    return seedDeck.map((card) => ({
      ...card,
      is_known: persistedMap.get(card.id) ?? card.is_known,
    }))
  } catch {
    return null
  }
}

/**
 * Serialises the current deck state for persistence.
 */
export function serialiseDeck(cards: Flashcard[]): PersistedCard[] {
  return cards.map(({ id, is_known }) => ({ id, is_known }))
}

