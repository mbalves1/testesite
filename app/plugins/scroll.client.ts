import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

// Registra o ScrollTrigger e liga o Lenis (scroll suave) ao ticker do GSAP,
// para que as animações e o scroll andem no mesmo frame.
export default defineNuxtPlugin(() => {
  gsap.registerPlugin(ScrollTrigger)

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const lenis = reducedMotion
    ? null
    : new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 })

  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)
  }

  return {
    provide: { lenis }
  }
})
