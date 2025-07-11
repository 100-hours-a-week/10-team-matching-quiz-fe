interface QuizData {
  question: string
  options: string[]
  answerIdx: number
  userAnswer: number | null
  commentary: string
  difficulty?: '상' | '중' | '하' | undefined
}

interface UserAnswerData {
  quizIdx: number
  userSelection: number
  isCorrect: boolean
}

interface QuizCardData {
  questionIdx: number
  question: string
  userAnswer: string
  correctAnswer: string
  commentary: string
  isCorrect: boolean
}

interface QuizHistoryResponse {
  quizzes: QuizHistoryData[]
  hasNext: boolean
  nextCursor: string
}
