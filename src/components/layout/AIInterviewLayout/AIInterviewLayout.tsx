import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { Logo } from '@/components/ui'
import { Timer } from '@/components/features'
import { useAIInterviewStore, useRecordingStore } from '@/stores'
import { useFinishInterview } from '@/hooks'
import styles from './styles.module.scss'

export const AIInterviewLayout: React.FC = () => {
  const { interviewId } = useAIInterviewStore()
  const { mediaRecorder, addAudioChunk } = useRecordingStore()
  const { finishInterview } = useFinishInterview()

  const handleEndInterview = async () => {
    if (!interviewId) return
    await finishInterview(interviewId)
  }

  useEffect(() => {
    if (mediaRecorder) {
      mediaRecorder.ondataavailable = event => {
        if (event.data && event.data.size > 0) {
          addAudioChunk(event.data)
        }
      }

      mediaRecorder.onerror = event => {
        console.error('MediaRecorder 오류:', event)
      }
    }
  }, [mediaRecorder, addAudioChunk])

  return (
    <div className={styles.interviewLayout}>
      <div className={styles.pageHeader}>
        <div className={styles.logoWrapper}>
          <Logo white />
        </div>
        <div className={styles.timerWrapper}>
          <Timer onTimeUp={handleEndInterview} />
        </div>
      </div>
      <div className={styles.pageContent}>
        <Outlet />
      </div>
    </div>
  )
}
