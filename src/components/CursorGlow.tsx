import { useEffect, useRef } from 'react'

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const trails: HTMLDivElement[] = []
    for (let i = 0; i < 6; i++) {
      const trail = document.createElement('div')
      trail.style.cssText = `
        position: fixed;
        width: ${22 - i * 3}px;
        height: ${22 - i * 3}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(191, 0, 255, ${0.35 - i * 0.05}) 0%, transparent 70%);
        pointer-events: none;
        z-index: 9996;
        transform: translate(-50%, -50%);
        transition: left ${0.04 + i * 0.025}s ease, top ${0.04 + i * 0.025}s ease;
        will-change: left, top;
      `
      document.body.appendChild(trail)
      trails.push(trail)
    }

    const move = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.left = e.clientX + 'px'
        glowRef.current.style.top = e.clientY + 'px'
      }
      trails.forEach((t) => {
        t.style.left = e.clientX + 'px'
        t.style.top = e.clientY + 'px'
      })
    }

    window.addEventListener('mousemove', move)
    return () => {
      window.removeEventListener('mousemove', move)
      trails.forEach((t) => t.remove())
    }
  }, [])

  return <div ref={glowRef} className="cursor-glow" />
}
