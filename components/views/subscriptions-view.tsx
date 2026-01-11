"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import AddSubscriptionModal from "@/components/add-subscription-modal"
import SubscriptionModal from "@/components/subscription-modal"
import type { Subscription, CreditCard as CreditCardType, Service } from "@/app/page"

interface SubscriptionsViewProps {
  subscriptions: Subscription[]
  cards: CreditCardType[]
  services: Service[]
  onAdd: (sub: Omit<Subscription, "id" | "createdAt">) => void
  onDelete: (id: string) => void
}

export default function SubscriptionsView({
  subscriptions,
  cards,
  services,
  onAdd,
  onDelete,
}: SubscriptionsViewProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)

  // Sort by renewal date
  const sorted = [...subscriptions].sort(
    (a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime()
  )

  const today = new Date()

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Subscriptions</h1>
        <Button
          onClick={() => setShowAddModal(true)}
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={cards.length === 0}
        >
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      {cards.length === 0 && (
        <div className="border border-dashed border-border p-6 text-center text-muted-foreground text-sm mb-4">
          Add a card first to create subscriptions
        </div>
      )}

      {/* Subscriptions List - Minimal */}
      {sorted.length === 0 ? (
        <div className="border border-dashed border-border p-8 text-center text-muted-foreground text-sm">
          No subscriptions yet
        </div>
      ) : (
        <div className="border border-border divide-y divide-border">
          {sorted.map((sub) => {
            const renewalDate = new Date(sub.renewalDate)
            const daysUntilRenewal = Math.ceil((renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
            const isExpiringSoon = daysUntilRenewal <= 7 && daysUntilRenewal > 0

            return (
              <button
                key={sub.id}
                onClick={() => setSelectedSubscription(sub)}
                className="w-full px-4 py-2.5 text-left hover:bg-secondary transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-medium text-sm truncate">{sub.service}</span>
                  {isExpiringSoon && (
                    <span className="text-xs px-1.5 py-0.5 bg-destructive/10 text-destructive flex-shrink-0">
                      {daysUntilRenewal}d
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium tabular-nums text-muted-foreground ml-4 flex-shrink-0">
                  ${sub.price.toFixed(2)}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* Add Modal */}
      <AddSubscriptionModal
        isOpen={showAddModal}
        cards={cards}
        services={services}
        onClose={() => setShowAddModal(false)}
        onAdd={onAdd}
      />

      {/* Detail Modal */}
      <SubscriptionModal
        isOpen={!!selectedSubscription}
        subscription={selectedSubscription}
        cards={cards}
        services={services}
        onClose={() => setSelectedSubscription(null)}
        onDelete={onDelete}
      />
    </div>
  )
}
