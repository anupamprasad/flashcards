import { useCallback, useEffect, useMemo, useState } from 'react'
import { DECK_STORAGE_KEY } from '../constants/storage.ts'
import { createSeedDeck, restoreDeckFromStorage, serialiseDeck } from '../utils/flashcards.ts'
import type { Flashcard } from '../types/flashcard.ts'

interface FlashcardDeck {
  /**
   * All flashcards in the current deck, including their knowledge state.
   */
  cards: Flashcard[]
  /**
   * The flashcard currently active in the study flow. `null` when the deck is empty.
   */
  currentCard: Flashcard | null
  /**
   * Zero-based index of the current card.
   */
  currentIndex: number
  /**
   * Total amount of cards within the deck.
   */
  totalCards: number
  /**
   * Advances to the next card, looping back to the start when reaching the end.
   */
  goToNextCard: () => void
  /**
   * Updates the `is_known` flag for the current card.
   */
  updateCurrentCardKnowledge: (isKnown: boolean) => void
}

const isBrowser = typeof window !== 'undefined'

/**
 * Encapsulates flashcard study deck state, including persistence mechanics
 * and navigation helpers. Consumers receive declarative actions instead of
 * mutating application state directly.
 */
export function useFlashcardDeck(): FlashcardDeck {
  const [cards, setCards] = useState<Flashcard[]>(() => {
    const seedDeck = createSeedDeck()

    if (!isBrowser) {
      return seedDeck
    }

    const storedDeck = restoreDeckFromStorage(
      window.localStorage.getItem(DECK_STORAGE_KEY),
      seedDeck,
    )

    return storedDeck ?? seedDeck
  })
  const [currentIndex, setCurrentIndex] = useState(0)

  const totalCards = cards.length
  const currentCard = useMemo(
    () => cards[currentIndex] ?? null,
    [cards, currentIndex],
  )

  useEffect(() => {
    if (!isBrowser) {
      return
    }

    try {
      window.localStorage.setItem(
        DECK_STORAGE_KEY,
        JSON.stringify(serialiseDeck(cards)),
      )
    } catch {
      // Intentionally ignore persistence failures (e.g. quota exceeded).
    }
  }, [cards])

  useEffect(() => {
    if (currentIndex < totalCards || totalCards === 0) {
      return
    }

    setCurrentIndex(0)
  }, [currentIndex, totalCards])

  const goToNextCard = useCallback(() => {
    if (totalCards === 0) {
      return
    }

    setCurrentIndex((previous) => (previous + 1) % totalCards)
  }, [totalCards])

  const updateCurrentCardKnowledge = useCallback(
    (isKnown: boolean) => {
      setCards((previousCards) => {
        if (previousCards.length === 0) {
          return previousCards
        }

        return previousCards.map((card, index) =>
          index === currentIndex ? { ...card, is_known: isKnown } : card,
        )
      })
    },
    [currentIndex],
  )

  return {
    cards,
    currentCard,
    currentIndex,
    totalCards,
    goToNextCard,
    updateCurrentCardKnowledge,
  }
}

