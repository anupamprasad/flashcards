import { useCallback, useEffect, useState } from 'react'
import { STATS_STORAGE_KEY } from '../constants/storage.ts'

const isBrowser = typeof window !== 'undefined'

export interface StudyStats {
  studiedCardIds: number[]
  totalQuizAttempts: number
  correctQuizAnswers: number
  incorrectQuizAnswers: number
}

interface StudyStatsApi {
  stats: StudyStats
  recordStudyInteraction: (cardId: number) => void
  recordQuizResult: (cardId: number, isCorrect: boolean) => void
}

const defaultStats: StudyStats = {
  studiedCardIds: [],
  totalQuizAttempts: 0,
  correctQuizAnswers: 0,
  incorrectQuizAnswers: 0,
}

export function useStudyStats(): StudyStatsApi {
  const [stats, setStats] = useState<StudyStats>(() => {
    if (!isBrowser) {
      return defaultStats
    }

    const rawValue = window.localStorage.getItem(STATS_STORAGE_KEY)

    if (!rawValue) {
      return defaultStats
    }

    try {
      const parsed: unknown = JSON.parse(rawValue)
      const candidate = parsed as Partial<StudyStats>

      const studiedCardIds = Array.isArray(candidate.studiedCardIds)
        ? candidate.studiedCardIds.filter((id) => typeof id === 'number')
        : []

      const totalQuizAttempts =
        typeof candidate.totalQuizAttempts === 'number'
          ? candidate.totalQuizAttempts
          : 0

      const correctQuizAnswers =
        typeof candidate.correctQuizAnswers === 'number'
          ? candidate.correctQuizAnswers
          : 0

      const incorrectQuizAnswers =
        typeof candidate.incorrectQuizAnswers === 'number'
          ? candidate.incorrectQuizAnswers
          : 0

      return {
        studiedCardIds,
        totalQuizAttempts,
        correctQuizAnswers,
        incorrectQuizAnswers,
      }
    } catch {
      return defaultStats
    }
  })

  useEffect(() => {
    if (!isBrowser) {
      return
    }

    try {
      window.localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats))
    } catch {
      // Ignore persistence failures
    }
  }, [stats])

  const recordStudyInteraction = useCallback((cardId: number) => {
    setStats((previous) => {
      if (previous.studiedCardIds.includes(cardId)) {
        return previous
      }

      return {
        ...previous,
        studiedCardIds: [...previous.studiedCardIds, cardId],
      }
    })
  }, [])

  const recordQuizResult = useCallback((cardId: number, isCorrect: boolean) => {
    setStats((previous) => {
      const studiedCardIds = previous.studiedCardIds.includes(cardId)
        ? previous.studiedCardIds
        : [...previous.studiedCardIds, cardId]

      return {
        studiedCardIds,
        totalQuizAttempts: previous.totalQuizAttempts + 1,
        correctQuizAnswers: previous.correctQuizAnswers + (isCorrect ? 1 : 0),
        incorrectQuizAnswers:
          previous.incorrectQuizAnswers + (isCorrect ? 0 : 1),
      }
    })
  }, [])

  return {
    stats,
    recordStudyInteraction,
    recordQuizResult,
  }
}
