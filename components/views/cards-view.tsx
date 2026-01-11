"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import AddCardModal from "@/components/add-card-modal"
import ConfirmModal from "@/components/confirm-modal"
import type { CreditCard, Subscription } from "@/app/page"

interface CardsViewProps {
  cards: CreditCard[]
  subscriptions: Subscription[]
  onAdd: (card: Omit<CreditCard, "id" | "createdAt">) => void
  onDelete: (id: string) => void
}

export default function CardsView({ cards, subscriptions, onAdd, onDelete }: CardsViewProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [deleteCard, setDeleteCard] = useState<CreditCard | null>(null)

  const getSubscriptionCount = (cardId: string) => {
    return subscriptions.filter((s) => s.cardId === cardId).length
  }

  const getCardSpending = (cardId: string) => {
    return subscriptions
      .filter((s) => s.cardId === cardId)
      .reduce((sum, s) => sum + s.price, 0)
  }

  const deleteCardSubCount = deleteCard ? getSubscriptionCount(deleteCard.id) : 0

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Cards</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Payment cards for subscriptions
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} variant="outline" size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      {/* Cards List */}
      {cards.length === 0 ? (
        <div className="border border-dashed border-border p-8 text-center text-muted-foreground text-sm">
          No cards added yet
        </div>
      ) : (
        <div className="border border-border divide-y divide-border">
          {cards.map((card) => {
            const subCount = getSubscriptionCount(card.id)
            const spending = getCardSpending(card.id)

            return (
              <div
                key={card.id}
                className="px-4 py-2.5 flex items-center justify-between group hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-medium text-sm">{card.name}</span>
                  <span className="text-sm text-muted-foreground">****{card.last4}</span>
                </div>
                <div className="flex items-center gap-4 ml-4 flex-shrink-0">
                  <span className="text-xs text-muted-foreground">{card.expiry}</span>
                  {subCount > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {subCount} sub{subCount !== 1 ? "s" : ""}
                    </span>
                  )}
                  {spending > 0 && (
                    <span className="text-sm font-medium tabular-nums">
                      ${spending.toFixed(2)}
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteCard(card)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive h-7 w-7 p-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <AddCardModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={onAdd}
      />

      <ConfirmModal
        isOpen={!!deleteCard}
        onClose={() => setDeleteCard(null)}
        onConfirm={() => deleteCard && onDelete(deleteCard.id)}
        title="Delete Card"
        message={
          deleteCardSubCount > 0
            ? `Are you sure you want to delete "${deleteCard?.name}"? This will also delete ${deleteCardSubCount} subscription${deleteCardSubCount !== 1 ? "s" : ""} linked to this card.`
            : `Are you sure you want to delete "${deleteCard?.name}"?`
        }
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  )
}
