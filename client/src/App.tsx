import { useMemo, useState } from 'react'
import { flashcards as flashcardSeed } from './data/flashcards.ts'
import type { Flashcard } from './types/flashcard.ts'
import { useClickSound } from './hooks/useClickSound.ts'
import './App.css'

function App() {
  const [cards, setCards] = useState<Flashcard[]>(flashcardSeed)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  const playClick = useClickSound()

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
    setCurrentIndex((previous) => (previous + 1) % totalCards)
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
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default App
