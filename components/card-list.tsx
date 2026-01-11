"use client"

import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { CreditCard } from "@/app/page"

interface CardListProps {
  cards: CreditCard[]
  onDelete: (cardId: string) => void
}

export default function CardList({ cards, onDelete }: CardListProps) {
  if (cards.length === 0) {
    return (
      <div className="border border-dashed border-border p-6 text-center text-muted-foreground text-sm">
        No cards added yet. Add your first card to get started.
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {cards.map((card) => (
        <div key={card.id} className="border border-border p-3 flex items-center justify-between group hover:border-foreground/20 transition-colors">
          <div>
            <p className="font-medium text-sm">{card.name}</p>
            <p className="text-xs text-muted-foreground">
              ****{card.last4} &middot; {card.expiry}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(card.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive h-7 w-7 p-0"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}
