"use client"

import { useState, useEffect } from "react"
import Modal from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import type { Service } from "@/app/page"

interface AddServiceModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (service: Omit<Service, "id" | "createdAt">) => void
}

export default function AddServiceModal({ isOpen, onClose, onAdd }: AddServiceModalProps) {
  const [name, setName] = useState("")
  const [defaultPrice, setDefaultPrice] = useState("")
  const [billingUrl, setBillingUrl] = useState("")

  useEffect(() => {
    if (isOpen) {
      setName("")
      setDefaultPrice("")
      setBillingUrl("")
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name) {
      onAdd({
        name,
        defaultPrice: defaultPrice ? Number.parseFloat(defaultPrice) : undefined,
        billingUrl,
      })
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Service">
      <form onSubmit={handleSubmit}>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Service Name</label>
            <input
              type="text"
              placeholder="e.g., OpenAI, Netflix, AWS"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Default Price ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="9.99"
              value={defaultPrice}
              onChange={(e) => setDefaultPrice(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Billing Page URL</label>
            <input
              type="url"
              placeholder="https://example.com/billing"
              value={billingUrl}
              onChange={(e) => setBillingUrl(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground transition-colors"
            />
          </div>
        </div>

        <div className="p-4 border-t border-border flex gap-2">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            Add Service
          </Button>
        </div>
      </form>
    </Modal>
  )
}
