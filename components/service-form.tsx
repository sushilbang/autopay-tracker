"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { Service } from "@/app/page"

interface ServiceFormProps {
  onAdd: (service: Omit<Service, "id" | "createdAt">) => void
  onCancel: () => void
}

export default function ServiceForm({ onAdd, onCancel }: ServiceFormProps) {
  const [name, setName] = useState("")
  const [defaultPrice, setDefaultPrice] = useState("")
  const [billingUrl, setBillingUrl] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name) {
      onAdd({
        name,
        defaultPrice: defaultPrice ? Number.parseFloat(defaultPrice) : undefined,
        billingUrl,
      })
      setName("")
      setDefaultPrice("")
      setBillingUrl("")
    }
  }

  return (
    <div className="mb-4 p-4 border border-border bg-background">
      <h3 className="text-sm font-medium mb-4">Add New Service</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div className="flex gap-2 pt-2">
          <Button type="submit" className="flex-1">
            Add Service
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
