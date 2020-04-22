/**
 * Hook to debounce setting a value. Inspired by: https://dev.to/gabe_ragland/debouncing-with-react-hooks-jci
 *
 * The idea is that `dbVal` is what this hook will return. The setting of `dbVal` is enclosed in a setTimeout so that
 * it will be delayed by the specified `delay` millis. The usage of `useEffect` causes the timeout to be cleared
 * every time the passed in `value` param changes, thus delaying the setting of `dbVal` until the `value` param
 * has been stable for the specified `delay`.
 */

import { useEffect, useState } from 'react'

export function useDebounceValue(value: any, delay: number) {
  const [dbVal, setDbVal] = useState(value)

  useEffect(() => {
    const dbTimeout = setTimeout(() => {
      setDbVal(value)
    }, delay)

    return () => {
      clearTimeout(dbTimeout)
    }
  }, [value])

  return dbVal
}
