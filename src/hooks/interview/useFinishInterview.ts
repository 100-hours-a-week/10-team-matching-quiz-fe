import { useState } from 'react'
import { updateInterviewStatus } from '@/api/interviewAPI'
import { useNavigate } from 'react-router-dom'
import { useAIInterviewStore, useTimerStore, useRecordingStore } from '@/stores'
import { useAudioUpload } from '@/hooks/presigned'

export const useFinishInterview = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)

  const {
    mediaRecorder,
    audioChunks,
    setMediaRecorder,
    clearChunks,
    setRecordedBlob,
  } = useRecordingStore()
  const { setCurrentPhase, reset } = useAIInterviewStore()
  const { resetTimer } = useTimerStore()
  const { uploadAudio } = useAudioUpload()

  const finishInterview = async (interviewId: string) => {
    if (!interviewId) return

    setLoading(true)

    try {
      await updateInterviewStatus(interviewId)

      const delay = new Promise(resolve => setTimeout(resolve, 1500))
      await delay

      if (mediaRecorder?.state === 'recording') {
        mediaRecorder.onstop = async () => {
          try {
            const blob = new Blob(audioChunks, { type: 'audio/webm' })

            if (blob.size > 0) {
              setRecordedBlob(blob)
              await uploadAudio(blob, `interview-${interviewId}.webm`)
            } else {
              console.warn('⚠️ 녹음된 오디오 데이터가 없습니다.')
            }

            clearChunks()
          } catch (error) {
            console.error('오디오 업로드 중 오류 발생:', error)
          } finally {
            setLoading(false)
            reset()
            resetTimer({ minutes: 0, seconds: 0 })
            setCurrentPhase('COMPLETE')
            navigate('/interview-ai/end')
          }
        }

        mediaRecorder.stop()
        mediaRecorder.stream.getTracks().forEach(track => track.stop())
      }

      setMediaRecorder(null)
    } catch (error) {
      console.error('오디오 전송에 실패했습니다:', error)
      setCurrentPhase('COMPLETE')
      resetTimer({ minutes: 0, seconds: 0 })
      navigate('/interview-ai/end')
      setLoading(false)
    }
  }

  return { finishInterview, loading }
}
