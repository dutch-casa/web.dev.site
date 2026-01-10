import { useCallback, useRef, useState, useLayoutEffect } from "react"

export type Setter<T> = (value: T | ((prev: T) => T)) => void

export function useControllableState<T>(params: {
  prop?: T
  defaultProp?: T
  onChange?: (state: T) => void
}): readonly [value: T, setValue: Setter<T>] {
  const { prop, defaultProp, onChange } = params
  const isControlled = prop !== undefined
  const defaultValue = defaultProp ?? (null as T)
  const [uncontrolledProp, setUncontrolledProp] = useState<T>(defaultValue)
  const value = isControlled ? prop : uncontrolledProp
  const onChangeRef = useRef(onChange)

  useLayoutEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const setValue = useCallback((nextValue: T | ((prev: T) => T)) => {
    if (isControlled) {
      const setter = nextValue as (prev: T) => T
      const newValue = typeof nextValue === "function" ? setter(prop!) : nextValue
      if (newValue !== prop && onChangeRef.current) {
        onChangeRef.current(newValue)
      }
    } else {
      setUncontrolledProp(nextValue)
    }
  }, [isControlled, prop])

  return [value, setValue] as const
}

export function useControllableBoolean(params: {
  prop?: boolean
  defaultProp?: boolean
  onChange?: (state: boolean) => void
}) {
  return useControllableState(params)
}

export function useControllableNumber(params: {
  prop?: number
  defaultProp?: number
  onChange?: (state: number) => void
}) {
  return useControllableState(params)
}

export function useControllableString(params: {
  prop?: string
  defaultProp?: string
  onChange?: (state: string) => void
}) {
  return useControllableState(params)
}
