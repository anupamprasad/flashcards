import { useState } from 'react'
import { useClickSound } from './hooks/useClickSound.ts'
import { useFlashcardDeck } from './hooks/useFlashcardDeck.ts'
import './App.css'

function App() {
  const [isFlipped, setIsFlipped] = useState(false)
  const { currentCard, currentIndex, totalCards, goToNextCard, updateCurrentCardKnowledge } =
    useFlashcardDeck()

  const playClick = useClickSound()

  if (!currentCard) {
    return (
      <div className="study-view">
        <header>
          <h1>Spanish Flashcards</h1>
        </header>
        <p>No flashcards available.</p>
      </div>
    )
  }

  const handleFlip = () => {
    playClick()
    setIsFlipped((previous) => !previous)
  }

  const handleNextCard = () => {
    playClick()
    goToNextCard()
    setIsFlipped(false)
  }

  const handleAssessment = (isKnown: boolean) => {
    playClick()
    updateCurrentCardKnowledge(isKnown)
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
