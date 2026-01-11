"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Check } from "lucide-react"
import Modal from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import type { CreditCard, Subscription, Service } from "@/app/page"

interface AddSubscriptionModalProps {
  isOpen: boolean
  cards: CreditCard[]
  services: Service[]
  onClose: () => void
  onAdd: (sub: Omit<Subscription, "id" | "createdAt">) => void
}

export default function AddSubscriptionModal({
  isOpen,
  cards,
  services,
  onClose,
  onAdd,
}: AddSubscriptionModalProps) {
  const [cardId, setCardId] = useState(cards[0]?.id || "")
  const [serviceId, setServiceId] = useState("")
  const [service, setService] = useState("")
  const [price, setPrice] = useState("")
  const [credits, setCredits] = useState("")
  const [renewalDate, setRenewalDate] = useState("")
  const [notes, setNotes] = useState("")
  const [billingUrl, setBillingUrl] = useState("")

  const [showCardDropdown, setShowCardDropdown] = useState(false)
  const [showServiceDropdown, setShowServiceDropdown] = useState(false)

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setCardId(cards[0]?.id || "")
      setServiceId("")
      setService("")
      setPrice("")
      setCredits("")
      setRenewalDate("")
      setNotes("")
      setBillingUrl("")
    }
  }, [isOpen, cards])

  // When service is selected from dropdown, populate fields
  useEffect(() => {
    if (serviceId) {
      const selectedService = services.find(s => s.id === serviceId)
      if (selectedService) {
        setService(selectedService.name)
        if (selectedService.defaultPrice !== undefined) {
          setPrice(selectedService.defaultPrice.toString())
        }
        if (selectedService.billingUrl) {
          setBillingUrl(selectedService.billingUrl)
        }
      }
    }
  }, [serviceId, services])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (cardId && service && price && renewalDate) {
      onAdd({
        cardId,
        serviceId,
        service,
        price: Number.parseFloat(price),
        credits,
        renewalDate,
        notes,
        billingUrl,
      })
      onClose()
    }
  }

  const selectedCard = cards.find(c => c.id === cardId)

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Subscription">
      <form onSubmit={handleSubmit}>
        <div className="p-4 space-y-4">
          {/* Card Dropdown */}
          <div className="relative">
            <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Card</label>
            <button
              type="button"
              onClick={() => {
                setShowCardDropdown(!showCardDropdown)
                setShowServiceDropdown(false)
              }}
              className="w-full px-3 py-2 text-sm border border-border bg-background text-foreground text-left flex items-center justify-between focus:outline-none focus:border-foreground transition-colors"
            >
              <span>
                {selectedCard ? `${selectedCard.name} (****${selectedCard.last4})` : "Select a card"}
              </span>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showCardDropdown ? "rotate-180" : ""}`} />
            </button>
            {showCardDropdown && (
              <div className="absolute z-20 w-full mt-1 border border-border bg-background shadow-lg max-h-48 overflow-auto">
                {cards.map((card) => (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => {
                      setCardId(card.id)
                      setShowCardDropdown(false)
                    }}
                    className="w-full px-3 py-2 text-sm text-left hover:bg-secondary flex items-center justify-between transition-colors"
                  >
                    <span>{card.name} (****{card.last4})</span>
                    {cardId === card.id && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Service Dropdown */}
          <div className="relative">
            <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Service</label>
            {services.length > 0 ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setShowServiceDropdown(!showServiceDropdown)
                    setShowCardDropdown(false)
                  }}
                  className="w-full px-3 py-2 text-sm border border-border bg-background text-foreground text-left flex items-center justify-between focus:outline-none focus:border-foreground transition-colors"
                >
                  <span className={service ? "text-foreground" : "text-muted-foreground"}>
                    {service || "Select a service or type custom"}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showServiceDropdown ? "rotate-180" : ""}`} />
                </button>
                {showServiceDropdown && (
                  <div className="absolute z-20 w-full mt-1 border border-border bg-background shadow-lg max-h-48 overflow-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setServiceId("")
                        setService("")
                        setPrice("")
                        setBillingUrl("")
                        setShowServiceDropdown(false)
                      }}
                      className="w-full px-3 py-2 text-sm text-left text-muted-foreground hover:bg-secondary transition-colors border-b border-border"
                    >
                      Custom service...
                    </button>
                    {services.map((svc) => (
                      <button
                        key={svc.id}
                        type="button"
                        onClick={() => {
                          setServiceId(svc.id)
                          setShowServiceDropdown(false)
                        }}
                        className="w-full px-3 py-2 text-sm text-left hover:bg-secondary flex items-center justify-between transition-colors"
                      >
                        <span>{svc.name}</span>
                        {serviceId === svc.id && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : null}
            {(services.length === 0 || !serviceId) && (
              <input
                type="text"
                placeholder="e.g., OpenAI, Netflix"
                value={service}
                onChange={(e) => setService(e.target.value)}
                className={`w-full px-3 py-2 text-sm border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground transition-colors ${services.length > 0 ? "mt-2" : ""}`}
                required={!serviceId}
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="9.99"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Credits/Model</label>
              <input
                type="text"
                placeholder="1000 credits"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Renewal Date</label>
            <input
              type="date"
              value={renewalDate}
              onChange={(e) => setRenewalDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border bg-background text-foreground focus:outline-none focus:border-foreground transition-colors"
              required
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

          <div>
            <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Notes</label>
            <textarea
              placeholder="Add any notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground transition-colors resize-none h-16"
            />
          </div>
        </div>

        <div className="p-4 border-t border-border flex gap-2">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            Add Subscription
          </Button>
        </div>
      </form>
    </Modal>
  )
}
