import { useCallback, useEffect, useState } from "react"

const DEFAULT_TIME = 60

const useCountdown = () => {
  // const [id] = useState<string>(generateID())
  const [isCountdownActive, setIsCountdownActive] = useState<boolean>(false)

  const [progress, setProgress] = useState<number>(100)
  const [time, setTime] = useState<number>(DEFAULT_TIME)
  const [duration, setDuration] = useState<number>(DEFAULT_TIME)

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const startCountdown = useCallback((duration?: number) => {
    if (duration != null) {
      setTime(duration)
      setDuration(duration)
    } else {
      setTime(DEFAULT_TIME)
      setDuration(DEFAULT_TIME)
    }

    setProgress(100)
    setIsCountdownActive(true)
  }, [])
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const stopCountdown = useCallback(() => {
    setTime(DEFAULT_TIME)
    setDuration(DEFAULT_TIME)

    setProgress(100)
    setIsCountdownActive(false)
  }, [])
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (isCountdownActive) {
      window.setTimeout(() => {
        const newTime = time - 1
        const newProgress = (newTime / duration) * 100

        if (newProgress > 0) {
          setTime(newTime)
          setProgress(newProgress)
        } else {
          setTime(0)
          setProgress(0)
          setIsCountdownActive(false)
        }
      }, 1000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCountdownActive, progress])

  useEffect(() => {
    startCountdown()
  }, [])

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return { progress, time, duration, isCountdownActive } as const
}

export default useCountdown
