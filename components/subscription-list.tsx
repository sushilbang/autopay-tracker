"use client"

import { Trash2, Calendar, CreditCard, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Subscription, CreditCard as CreditCardType, Service } from "@/app/page"

interface SubscriptionListProps {
  subscriptions: Subscription[]
  cards: CreditCardType[]
  services: Service[]
  onDelete: (subId: string) => void
}

export default function SubscriptionList({ subscriptions, cards, services, onDelete }: SubscriptionListProps) {
  if (subscriptions.length === 0) {
    return (
      <div className="border border-dashed border-border p-6 text-center text-muted-foreground text-sm">
        No subscriptions added yet. Add a card to create your first subscription.
      </div>
    )
  }

  const getCardName = (cardId: string) => {
    return cards.find((c) => c.id === cardId)?.name || "Unknown Card"
  }

  const getCardLast4 = (cardId: string) => {
    return cards.find((c) => c.id === cardId)?.last4 || ""
  }

  const getBillingUrl = (sub: Subscription) => {
    // First check subscription's own billing URL
    if (sub.billingUrl) return sub.billingUrl
    // Fall back to service's billing URL
    if (sub.serviceId) {
      const service = services.find(s => s.id === sub.serviceId)
      if (service?.billingUrl) return service.billingUrl
    }
    return null
  }

  // Sort by renewal date
  const sorted = [...subscriptions].sort(
    (a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime(),
  )

  return (
    <div className="space-y-2">
      {sorted.map((sub) => {
        const renewalDate = new Date(sub.renewalDate)
        const today = new Date()
        const daysUntilRenewal = Math.ceil((renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        const isExpiringSoon = daysUntilRenewal <= 7 && daysUntilRenewal > 0
        const billingUrl = getBillingUrl(sub)

        return (
          <div
            key={sub.id}
            className={`border p-4 group hover:border-foreground/20 transition-colors ${isExpiringSoon ? "border-l-2 border-l-destructive" : "border-border"}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{sub.service}</p>
                  {billingUrl && (
                    <a
                      href={billingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      title="Open billing page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>{getCardName(sub.cardId)} (****{getCardLast4(sub.cardId)})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{renewalDate.toLocaleDateString()}</span>
                    {daysUntilRenewal > 0 && (
                      <span className={isExpiringSoon ? "text-destructive font-medium" : ""}>
                        ({daysUntilRenewal}d)
                      </span>
                    )}
                  </div>
                </div>
                {sub.credits && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {sub.credits}
                  </p>
                )}
                {sub.notes && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {sub.notes}
                  </p>
                )}
              </div>
              <div className="flex items-start gap-3 ml-4">
                <p className="text-lg font-semibold tabular-nums">${sub.price.toFixed(2)}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(sub.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive h-7 w-7 p-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
