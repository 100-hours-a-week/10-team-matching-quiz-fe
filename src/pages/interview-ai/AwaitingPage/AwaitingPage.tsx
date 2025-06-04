import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal } from '@/components/ui'
import { InterviewGuideline } from '@/components/features'
import { useTimerStore } from '@/stores/timerStore'
import { useInterviewId, useStartInterview } from '@/hooks'
import { useAIInterviewStore, useAuthStore } from '@/stores'
// import { useRecordingStore } from '@/stores/recordingStore'
import styles from './styles.module.scss'

export const AwaitingPage: React.FC = () => {
  const navigate = useNavigate()
  const [toggleModal, setToggleModal] = useState(false)
  const [error, setError] = useState<string[]>([])

  // const { setMediaRecorder, clearChunks } = useRecordingStore()
  const { startInterview, loading } = useStartInterview()
  const { startTimer } = useTimerStore()

  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const myInterviewId = useAIInterviewStore(state => state.interviewId)
  const duration = useAIInterviewStore(state => state.duration)
  const setInterviewId = useAIInterviewStore(state => state.setInterviewId)
  const setCurrentPhase = useAIInterviewStore(state => state.setCurrentPhase)

  const requestInterviewId = isLoggedIn && !myInterviewId

  const { data: interviewId } = useInterviewId(requestInterviewId)

  const handleStartInterview = async () => {
    if (!interviewId) {
      setError([
        '면접 질문 생성에 실패했습니다.',
        '새로고침 후 다시 시도해주세요.',
      ])
      setToggleModal(true)
      return
    }

    await startInterview(interviewId, duration)

    // const permission = await navigator.permissions.query({
    //   name: 'microphone' as PermissionName,
    // })

    // if (permission.state === 'denied') {
    //   setError([
    //     '마이크 권한이 차단되어 있습니다.',
    //     '브라우저 설정에서 마이크 권한을 허용해주세요.',
    //   ])
    //   setToggleModal(true)
    //   return
    // }

    try {
      // const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      // const recorder = new MediaRecorder(stream)

      // clearChunks()

      // recorder.start(1000)

      // setMediaRecorder(recorder)

      // await startInterview(interviewId, duration)

      startTimer(duration)
      setCurrentPhase('PROGRESS')
      navigate('/interview-ai/question')
    } catch (error) {
      console.error('면접 질문 생성 실패', error)
      setError([
        '면접 질문 생성에 실패했습니다.',
        '새로고침 후 다시 시도해주세요.',
      ])
      setToggleModal(true)
    }
  }

  useEffect(() => {
    if (interviewId) {
      setInterviewId(interviewId)
    }
  }, [interviewId, setInterviewId])

  return (
    <div className={styles.awaitingPage}>
      <div className={styles.container}>
        <InterviewGuideline onClick={handleStartInterview} />
      </div>

      <Modal
        isOpen={loading && !error}
        style="loading"
        message={['면접 질문을 준비하고 있습니다.', '잠시만 기다려주세요.']}
      />

      <Modal
        isOpen={toggleModal}
        style="failed"
        message={error}
        closable
        toggleModal={() => setToggleModal(!toggleModal)}
      />
    </div>
  )
}
