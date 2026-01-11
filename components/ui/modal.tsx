"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { X } from "lucide-react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  showCloseButton?: boolean
  size?: "sm" | "md" | "lg"
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  size = "md",
}: ModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const backdropRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)

  const animate = useCallback((
    element: HTMLElement,
    from: Record<string, number>,
    to: Record<string, number>,
    duration: number,
    onComplete?: () => void
  ) => {
    const startTime = performance.now()

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)

      Object.keys(from).forEach((key) => {
        const fromVal = from[key]
        const toVal = to[key]
        const current = fromVal + (toVal - fromVal) * eased

        if (key === "opacity") {
          element.style.opacity = String(current)
        } else if (key === "scale") {
          element.style.transform = `scale(${current})`
        } else if (key === "translateY") {
          element.style.transform = `translateY(${current}px)`
        }
      })

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(step)
      } else {
        onComplete?.()
      }
    }

    animationRef.current = requestAnimationFrame(step)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      setIsAnimating(true)

      requestAnimationFrame(() => {
        if (backdropRef.current && modalRef.current) {
          backdropRef.current.style.opacity = "0"
          modalRef.current.style.opacity = "0"
          modalRef.current.style.transform = "scale(0.95)"

          animate(backdropRef.current, { opacity: 0 }, { opacity: 1 }, 200)
          animate(modalRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1 }, 200, () => {
            setIsAnimating(false)
          })
        }
      })
    } else if (isVisible) {
      setIsAnimating(true)

      if (backdropRef.current && modalRef.current) {
        animate(backdropRef.current, { opacity: 1 }, { opacity: 0 }, 150)
        animate(modalRef.current, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.95 }, 150, () => {
          setIsVisible(false)
          setIsAnimating(false)
        })
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isOpen, isVisible, animate])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isAnimating) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, isAnimating, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  if (!isVisible) return null

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={() => !isAnimating && onClose()}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`relative bg-background border border-border w-full ${sizeClasses[size]} mx-4 max-h-[90vh] overflow-auto`}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4 border-b border-border">
            {title && <h2 className="text-lg font-semibold">{title}</h2>}
            {showCloseButton && (
              <button
                onClick={() => !isAnimating && onClose()}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors ml-auto"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        {children}
      </div>
    </div>
  )
}
