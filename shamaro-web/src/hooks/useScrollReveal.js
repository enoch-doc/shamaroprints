import { useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'

export function useScrollReveal(options = {}) {
  const { ref, inView } = useInView({
    threshold:   options.threshold   ?? 0.12,
    triggerOnce: options.triggerOnce ?? true,
    rootMargin:  options.rootMargin  ?? '0px 0px -60px 0px',
  })
  return { ref, inView }
}