import { useCallback, useRef } from 'react'

const CLICK_DURATION = 0.14
const START_GAIN = 0.001
const PEAK_GAIN = 0.22
const START_FREQUENCY = 720
const END_FREQUENCY = 540

export function useClickSound() {
  const audioContextRef = useRef<AudioContext | null>(null)

  const getContext = useCallback(() => {
    if (typeof window === 'undefined') {
      return null
    }

    const AudioContextClass =
      window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext

    if (!AudioContextClass) {
      return null
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextClass()
    }

    return audioContextRef.current
  }, [])

  return useCallback(() => {
    const context = getContext()

    if (!context) {
      return
    }

    if (context.state === 'suspended') {
      void context.resume()
    }

    const now = context.currentTime
    const oscillator = context.createOscillator()
    const gain = context.createGain()

    oscillator.type = 'triangle'
    oscillator.frequency.setValueAtTime(START_FREQUENCY, now)
    oscillator.frequency.exponentialRampToValueAtTime(
      END_FREQUENCY,
      now + CLICK_DURATION,
    )

    gain.gain.setValueAtTime(START_GAIN, now)
    gain.gain.exponentialRampToValueAtTime(PEAK_GAIN, now + 0.015)
    gain.gain.exponentialRampToValueAtTime(START_GAIN, now + CLICK_DURATION)

    oscillator.connect(gain)
    gain.connect(context.destination)

    oscillator.start(now)
    oscillator.stop(now + CLICK_DURATION)
  }, [getContext])
}

