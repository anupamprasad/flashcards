import { useEffect, useMemo, useState } from 'react'
import { flashcards as flashcardSeed } from './data/flashcards.ts'
import type { Flashcard } from './types/flashcard.ts'
import { useClickSound } from './hooks/useClickSound.ts'
import './App.css'

const STORAGE_KEY = 'spanish-flashcards:deck'

type PersistedCard = Pick<Flashcard, 'id' | 'is_known'>

function createSeedCards(): Flashcard[] {
  return flashcardSeed.map((card) => ({ ...card }))
}

function loadInitialCards(): Flashcard[] {
  if (typeof window === 'undefined') {
    return createSeedCards()
  }

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY)

    if (!storedValue) {
      return createSeedCards()
    }

    const parsed: unknown = JSON.parse(storedValue)

    if (!Array.isArray(parsed)) {
      return createSeedCards()
    }

    const storedMap = new Map<number, boolean>()

    parsed.forEach((entry) => {
      if (isPersistedCard(entry)) {
        storedMap.set(entry.id, entry.is_known)
      }
    })

    if (storedMap.size === 0) {
      return createSeedCards()
    }

    return flashcardSeed.map((card) => ({
      ...card,
      is_known: storedMap.has(card.id)
        ? storedMap.get(card.id) ?? card.is_known
        : card.is_known,
    }))
  } catch {
    return createSeedCards()
  }
}

function isPersistedCard(value: unknown): value is PersistedCard {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const { id, is_known } = value as Partial<Record<keyof PersistedCard, unknown>>

  return typeof id === 'number' && typeof is_known === 'boolean'
}

function App() {
  const [cards, setCards] = useState<Flashcard[]>(() => loadInitialCards())
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  const playClick = useClickSound()

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const payload: PersistedCard[] = cards.map(({ id, is_known }) => ({
      id,
      is_known,
    }))

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch {
      // Ignore persistence failures (e.g., storage quota exceeded)
    }
  }, [cards])

  const totalCards = cards.length
  const currentCard = useMemo(
    () => cards[currentIndex],
    [cards, currentIndex],
  )

  const handleFlip = () => {
    playClick()
    setIsFlipped((previous) => !previous)
  }

  const handleNextCard = () => {
    playClick()
    setIsFlipped(false)
  }

  const handleAssessment = (isKnown: boolean) => {
    playClick()
    setCards((previousCards) =>
      previousCards.map((card, index) =>
        index === currentIndex ? { ...card, is_known: isKnown } : card,
      ),
    )
    setIsFlipped(false)
  }

  return (
    <div className="study-view">
      <header>
        <h1>Spanish Flashcards</h1>
        <p className="deck-progress">
          Card {currentIndex + 1} of {totalCards}
        </p>
      </header>

      <div className="card-container">
        <button
          type="button"
          className={`flashcard ${isFlipped ? 'flipped' : ''}`}
          onClick={handleFlip}
          aria-pressed={isFlipped}
        >
          <span className="flashcard-label">
            {isFlipped ? 'English' : 'Spanish'}
          </span>
          <span className="flashcard-word">
            {isFlipped
              ? currentCard.english_translation
              : currentCard.spanish_word}
          </span>
        </button>
      </div>

      {isFlipped && (
        <div className="assessment-buttons">
          <button
            type="button"
            className="assessment-button correct"
            onClick={() => handleAssessment(true)}
          >
            I Got It Right
          </button>
          <button
            type="button"
            className="assessment-button incorrect"
            onClick={() => handleAssessment(false)}
          >
            I Got It Wrong
          </button>
        </div>
      )}

      <div className="actions">
        <button
          type="button"
          className="next-button"
          onClick={handleNextCard}
          disabled
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default App
