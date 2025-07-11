import { useEffect, useState, useRef } from 'react'
import { Button, Modal } from '@/components/ui'
import { InterviewGuideline, InterviewMicTest } from '@/components/features'
import {
  useStartInterview,
  useMediaRecorder,
  useFinishInterview,
} from '@/hooks'
import { useAIInterviewStore, useAuthStore } from '@/stores'
import { findOldInterview } from '@/api/interviewAiAPI'
import styles from './styles.module.scss'

export const AwaitingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'intro' | 'micTest'>('intro')
  const [errorModal, setErrorModal] = useState(false)
  const [resetModal, setResetModal] = useState(false)
  const [error, setError] = useState<string[]>([])
  const resetDoneRef = useRef(false)

  const userId = useAuthStore(state => state.userId)
  const interviewId = useAIInterviewStore(state => state.interviewId)
  const setInterviewId = useAIInterviewStore(state => state.setInterviewId)
  const duration = useAIInterviewStore(state => state.duration)

  const { startInterview, loading: isStarting } = useStartInterview()
  const { resetInterview } = useFinishInterview()
  const { startRecording, stopRecording, recordingError } = useMediaRecorder()

  const handleStartInterview = async () => {
    // 녹음 시작 요청
    try {
      await startRecording()
    } catch (error) {
      console.error(error)
      setError(recordingError)
      setErrorModal(true)
      return
    }

    // 면접 시작 요청
    try {
      await startInterview(duration)
    } catch (error) {
      console.error(error)
      stopRecording()
      setError(['잘못된 접근입니다.', '초기화 후 다시 실행해주세요.'])
      setResetModal(true)
    }
  }

  const init = async () => {
    if (userId) {
      const oldInterviewId = await findOldInterview(userId)
      setInterviewId(oldInterviewId)
      setResetModal(false)
      window.location.reload()
    }
  }

  useEffect(() => {
    if (interviewId && !isStarting && !resetDoneRef.current) {
      resetDoneRef.current = true
      resetInterview(interviewId)
    }
  }, [interviewId, isStarting])

  return (
    <div className={styles.awaitingPage}>
      <div className={styles.container}>
        {currentStep === 'intro' && (
          <InterviewGuideline onNext={() => setCurrentStep('micTest')} />
        )}

        {currentStep === 'micTest' && (
          <InterviewMicTest
            onPrev={() => setCurrentStep('intro')}
            startInterview={handleStartInterview}
          />
        )}
      </div>

      <Modal
        isOpen={isStarting && !error.length}
        style="loading"
        message={['면접 질문을 준비하고 있습니다.', '잠시만 기다려주세요.']}
      />

      <Modal
        isOpen={errorModal}
        style="failed"
        message={error}
        closable
        toggleModal={() => setErrorModal(!errorModal)}
      />

      <Modal
        isOpen={resetModal}
        style="failed"
        message={error}
        closable
        toggleModal={() => setResetModal(!resetModal)}
      >
        <Button text="초기화" onClick={init} />
      </Modal>
    </div>
  )
}
