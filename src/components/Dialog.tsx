import { useEffect, useRef, type ReactNode } from 'react'
import { Icon } from './Icon'

export function Dialog({
  title,
  children,
  onClose,
  className = '',
  onKeyDown,
}: {
  title: string
  children: ReactNode
  onClose: () => void
  className?: string
  onKeyDown?: (event: React.KeyboardEvent<HTMLDialogElement>) => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    dialog?.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      dialog?.close()
      document.body.style.overflow = overflow
      if (previous?.isConnected) previous.focus()
    }
  }, [])
  return (
    <dialog
      ref={ref}
      className={`dialog ${className}`}
      aria-label={title}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.preventDefault()
          onClose()
          return
        }
        if (e.key === 'Tab') {
          const nodes = [
            ...e.currentTarget.querySelectorAll<HTMLElement>(
              'a[href], button:not(:disabled), input:not(:disabled), select, video[controls], [tabindex="0"]',
            ),
          ].filter((n) => n.getClientRects().length)
          const first = nodes[0],
            last = nodes[nodes.length - 1]
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault()
            last?.focus()
          }
          if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault()
            first?.focus()
          }
        }
        onKeyDown?.(e)
      }}
    >
      <div className="dialog-inner">
        <button
          className="icon-button dialog-close"
          onClick={onClose}
          aria-label="Fechar janela"
          autoFocus
        >
          <Icon name="close" />
        </button>
        {children}
      </div>
    </dialog>
  )
}
