import { InterviewHistoryCard } from '@/components/features'
import styles from './styles.module.scss'
import { useRef, useEffect } from 'react'
import { LoadingIndicator } from '@/components/ui'
import { useNavigate } from 'react-router-dom'

interface Props {
  history: HistoryListData[]
  hasNextPage: boolean | undefined
  isFetchingNextPage: boolean
  fetchNextPage: () => void
}

export const InterviewHistoryList: React.FC<Props> = ({
  history,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}) => {
  const navigate = useNavigate()

  const observerTarget = useRef<HTMLDivElement>(null)

  const handleClick = (history: HistoryListData) => {
    navigate(`/mypage/interview/${history.id}`)
  }

  useEffect(() => {
    const target = observerTarget.current
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage) fetchNextPage()
      },
      { threshold: 0.1 }
    )

    if (target) observer.observe(target)

    return () => {
      if (target) observer.unobserve(target)
    }
  }, [fetchNextPage, hasNextPage])

  return (
    <div className={styles.historyList}>
      {history.map(item => (
        <InterviewHistoryCard
          key={item.id}
          history={item}
          onClick={() => handleClick(item)}
        />
      ))}

      {isFetchingNextPage && (
        <div className={styles.loading}>
          <LoadingIndicator size={40} />
        </div>
      )}

      {hasNextPage && (
        <div ref={observerTarget} className={styles.trigger}></div>
      )}

      {/* <Modal
        isOpen={notReady}
        style="failed"
        message={['피드백이 완성되지 않았습니다.', '조금만 기다려주세요!']}
        closable
        toggleModal={() => setNotReady(!notReady)}
      /> */}
    </div>
  )
}
