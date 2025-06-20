import { useState } from 'react'
import { generateQuestion, getInterviewId } from '@/api/interviewAiAPI'
import { updateInterviewStatus } from '@/api/interviewAPI'
import { useAIInterviewStore } from '@/stores'
import { useNavigate } from 'react-router-dom'
import { useTimerStore } from '@/stores/timerStore'

export const useStartInterview = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const setQuestion = useAIInterviewStore(state => state.setQuestion)
  const setInterviewId = useAIInterviewStore(state => state.setInterviewId)

  const { startTimer } = useTimerStore()

  const startInterview = async (duration: number) => {
    setLoading(true)

    const delay = new Promise(resolve => setTimeout(resolve, 1500))

    const interviewId = await getInterviewId(duration)
    if (interviewId) setInterviewId(interviewId)

    console.log('id', interviewId)

    await updateInterviewStatus(interviewId)

    const response = await generateQuestion(interviewId)

    console.log('질문', response)

    const question = response?.question

    await delay

    if (question) {
      setQuestion(question)
      startTimer(duration)
      navigate('/interview-ai/question')
    }
  }

  return { startInterview, loading }
}
