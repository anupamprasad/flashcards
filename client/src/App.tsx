import { useEffect, useState } from 'react'
import { useClickSound } from './hooks/useClickSound.ts'
import { useFlashcardDeck } from './hooks/useFlashcardDeck.ts'
import { useStudyStats } from './hooks/useStudyStats.ts'
import type { Flashcard } from './types/flashcard.ts'
import './App.css'

type ActiveView = 'study' | 'quiz' | 'stats'
type QuizMode = 'multiple-choice' | 'fill-in'

function App() {
  const [activeView, setActiveView] = useState<ActiveView>('study')
  const [isFlipped, setIsFlipped] = useState(false)
  const [quizMode, setQuizMode] = useState<QuizMode>('multiple-choice')
  const [quizQuestionCard, setQuizQuestionCard] = useState<Flashcard | null>(null)
  const [quizOptions, setQuizOptions] = useState<Flashcard[]>([])
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null)
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [quizTextAnswer, setQuizTextAnswer] = useState('')

  const { cards, currentCard, currentIndex, totalCards, goToNextCard, updateCurrentCardKnowledge } =
    useFlashcardDeck()
  const { stats, recordStudyInteraction, recordQuizResult } = useStudyStats()

  const playClick = useClickSound()

  useEffect(() => {
    if (!currentCard) {
      return
    }

    recordStudyInteraction(currentCard.id)
  }, [currentCard, recordStudyInteraction])

  const totalStudied = stats.studiedCardIds.length
  const knownCount = cards.filter((card) => card.is_known).length
  const unknownCount = cards.length - knownCount
  const correctRate =
    stats.totalQuizAttempts === 0
      ? 0
      : Math.round((stats.correctQuizAnswers / stats.totalQuizAttempts) * 100)

  const prepareNewQuizQuestion = (mode: QuizMode) => {
    if (cards.length === 0) {
      setQuizQuestionCard(null)
      setQuizOptions([])
      setSelectedOptionId(null)
      setQuizFeedback(null)
      setQuizTextAnswer('')
      return
    }

    const randomIndex = Math.floor(Math.random() * cards.length)
    const questionCard = cards[randomIndex]

    recordStudyInteraction(questionCard.id)

    setQuizQuestionCard(questionCard)
    setSelectedOptionId(null)
    setQuizFeedback(null)
    setQuizTextAnswer('')

    if (mode === 'multiple-choice') {
      const otherCards = cards.filter((card) => card.id !== questionCard.id)
      const shuffledOthers = [...otherCards].sort(() => Math.random() - 0.5)
      const distractors = shuffledOthers.slice(0, Math.min(3, shuffledOthers.length))
      const optionCards = [...distractors, questionCard].sort(
        () => Math.random() - 0.5,
      )

      setQuizOptions(optionCards)
    } else {
      setQuizOptions([])
    }
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

  const handleSelectQuizOption = (optionId: number) => {
    if (!quizQuestionCard || quizFeedback) {
      return
    }

    const isCorrect = optionId === quizQuestionCard.id

    setSelectedOptionId(optionId)
    setQuizFeedback(isCorrect ? 'correct' : 'incorrect')
    recordQuizResult(quizQuestionCard.id, isCorrect)
    playClick()
  }

  const handleSubmitFillInAnswer = () => {
    if (!quizQuestionCard || quizFeedback) {
      return
    }

    const userAnswer = quizTextAnswer.trim().toLowerCase()
    const correctAnswer = quizQuestionCard.english_translation.trim().toLowerCase()
    const isCorrect = userAnswer === correctAnswer

    setQuizFeedback(isCorrect ? 'correct' : 'incorrect')
    recordQuizResult(quizQuestionCard.id, isCorrect)
    playClick()
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Language Converter</h1>
        {activeView === 'study' && currentCard && (
          <p className="deck-progress">
            Card {currentIndex + 1} of {totalCards}
          </p>
        )}
      </header>

      <nav className="app-nav" aria-label="Main navigation">
        <button
          type="button"
          className={`nav-button ${activeView === 'study' ? 'nav-button-active' : ''}`}
          onClick={() => {
            playClick()
            setActiveView('study')
          }}
        >
          Study
        </button>
        <button
          type="button"
          className={`nav-button ${activeView === 'quiz' ? 'nav-button-active' : ''}`}
          onClick={() => {
            playClick()
            setActiveView('quiz')
            setIsFlipped(false)
            prepareNewQuizQuestion(quizMode)
          }}
        >
          Quiz
        </button>
        <button
          type="button"
          className={`nav-button ${activeView === 'stats' ? 'nav-button-active' : ''}`}
          onClick={() => {
            playClick()
            setActiveView('stats')
            setIsFlipped(false)
          }}
        >
          Statistics
        </button>
      </nav>

      <main className="app-main">
        {activeView === 'study' && (
          <section className="study-view">
            {!currentCard ? (
              <p>No flashcards available.</p>
            ) : (
              <>
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
              </>
            )}
          </section>
        )}

        {activeView === 'quiz' && (
          <section className="placeholder-view quiz-view">
            <div className="quiz-header">
              <h2>Quiz Mode</h2>
              <div className="quiz-mode-toggle" aria-label="Quiz mode">
                <button
                  type="button"
                  className={`quiz-mode-button ${
                    quizMode === 'multiple-choice' ? 'quiz-mode-button-active' : ''
                  }`}
                  onClick={() => {
                    if (quizMode === 'multiple-choice') {
                      return
                    }

                    setQuizMode('multiple-choice')
                    prepareNewQuizQuestion('multiple-choice')
                  }}
                >
                  Multiple choice
                </button>
                <button
                  type="button"
                  className={`quiz-mode-button ${
                    quizMode === 'fill-in' ? 'quiz-mode-button-active' : ''
                  }`}
                  onClick={() => {
                    if (quizMode === 'fill-in') {
                      return
                    }

                    setQuizMode('fill-in')
                    prepareNewQuizQuestion('fill-in')
                  }}
                >
                  Fill in the blank
                </button>
              </div>
            </div>

            {!quizQuestionCard || cards.length === 0 ? (
              <p>No flashcards available for quiz.</p>
            ) : (
              <>
                <p className="quiz-question">
                  What is the English translation for{' '}
                  <span className="quiz-question-word">
                    {quizQuestionCard.spanish_word}
                  </span>
                  ?
                </p>

                {quizMode === 'multiple-choice' ? (
                  <div className="quiz-options">
                    {quizOptions.map((option) => {
                      const isSelected = option.id === selectedOptionId

                      let className = 'quiz-option'

                      if (isSelected && quizFeedback === 'correct') {
                        className += ' quiz-option-correct'
                      } else if (isSelected && quizFeedback === 'incorrect') {
                        className += ' quiz-option-incorrect'
                      }

                      return (
                        <button
                          key={option.id}
                          type="button"
                          className={className}
                          onClick={() => handleSelectQuizOption(option.id)}
                        >
                          {option.english_translation}
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <form
                    className="quiz-fill-form"
                    onSubmit={(event) => {
                      event.preventDefault()
                      handleSubmitFillInAnswer()
                    }}
                  >
                    <input
                      type="text"
                      className="quiz-input"
                      placeholder="Type the English translation"
                      value={quizTextAnswer}
                      onChange={(event) => setQuizTextAnswer(event.target.value)}
                    />
                    <button type="submit" className="quiz-submit-button">
                      Check answer
                    </button>
                  </form>
                )}

                {quizFeedback && (
                  <p
                    className={`quiz-feedback quiz-feedback-${quizFeedback}`}
                    aria-live="polite"
                  >
                    {quizFeedback === 'correct'
                      ? 'Correct!'
                      : 'Not quite, keep practicing.'}
                  </p>
                )}

                <div className="actions">
                  <button
                    type="button"
                    className="next-button"
                    onClick={() => {
                      playClick()
                      prepareNewQuizQuestion(quizMode)
                    }}
                  >
                    Next question
                  </button>
                </div>
              </>
            )}
          </section>
        )}

        {activeView === 'stats' && (
          <section className="placeholder-view stats-view">
            <h2>Statistics</h2>
            <div className="stats-grid">
              <div className="stats-card">
                <h3>Total studied</h3>
                <p className="stats-primary-value">{totalStudied}</p>
                <p className="stats-secondary-text">
                  Unique cards viewed in study or quiz
                </p>
              </div>
              <div className="stats-card">
                <h3>Known vs. unknown</h3>
                <p className="stats-primary-value">
                  {knownCount} <span className="stats-label">known</span>
                </p>
                <p className="stats-secondary-value">
                  {unknownCount} <span className="stats-label">unknown</span>
                </p>
              </div>
              <div className="stats-card">
                <h3>Quiz performance</h3>
                <p className="stats-primary-value">{correctRate}%</p>
                <p className="stats-secondary-text">
                  {stats.correctQuizAnswers} correct / {stats.totalQuizAttempts}{' '}
                  attempts
                </p>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
