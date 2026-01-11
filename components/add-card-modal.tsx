"use client"

import { useState, useEffect } from "react"
import Modal from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import type { CreditCard } from "@/app/page"

interface AddCardModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (card: Omit<CreditCard, "id" | "createdAt">) => void
}

export default function AddCardModal({ isOpen, onClose, onAdd }: AddCardModalProps) {
  const [name, setName] = useState("")
  const [last4, setLast4] = useState("")
  const [expiry, setExpiry] = useState("")

  useEffect(() => {
    if (isOpen) {
      setName("")
      setLast4("")
      setExpiry("")
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && last4 && expiry) {
      onAdd({ name, last4, expiry })
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Card">
      <form onSubmit={handleSubmit}>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Card Name</label>
            <input
              type="text"
              placeholder="e.g., Personal Visa"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Last 4 Digits</label>
              <input
                type="text"
                placeholder="1234"
                value={last4}
                onChange={(e) => setLast4(e.target.value.replace(/\D/g, "").slice(0, 4))}
                maxLength={4}
                className="w-full px-3 py-2 text-sm border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Expiry (MM/YY)</label>
              <input
                type="text"
                placeholder="12/25"
                value={expiry}
                onChange={(e) => {
                  let val = e.target.value.replace(/\D/g, "")
                  if (val.length >= 2) {
                    val = val.slice(0, 2) + "/" + val.slice(2, 4)
                  }
                  setExpiry(val)
                }}
                maxLength={5}
                className="w-full px-3 py-2 text-sm border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                required
              />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border flex gap-2">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            Add Card
          </Button>
        </div>
      </form>
    </Modal>
  )
}
