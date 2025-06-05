import React, { useEffect } from 'react'
import { useTimerStore } from '@/stores/timerStore'
import { Timer as TimerIcon } from 'lucide-react'
import styles from './styles.module.scss'

interface TimerProps {
  onTimeUp?: () => void
}

export const Timer: React.FC<TimerProps> = ({ onTimeUp }) => {
  const { isActive, time } = useTimerStore()

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (isActive) {
      timer = setInterval(() => {
        useTimerStore.setState(state => {
          const { minutes, seconds } = state.time

          if (seconds > 0) {
            return { time: { minutes, seconds: seconds - 1 } }
          }
          if (minutes > 0) {
            return { time: { minutes: minutes - 1, seconds: 59 } }
          }

          clearInterval(timer!)

          if (onTimeUp) {
            onTimeUp()
          }

          return { isActive: false, time: { minutes: 0, seconds: 0 } }
        })
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isActive, onTimeUp])

  return (
    <div className={styles.container}>
      <TimerIcon />
      <div className={styles.timer}>
        00:
        {String(time.minutes).padStart(2, '0')}:
        {String(time.seconds).padStart(2, '0')}
      </div>
    </div>
  )
}
