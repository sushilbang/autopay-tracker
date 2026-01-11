"use client"

import { useState } from "react"
import { Calendar, CreditCard, ExternalLink, Trash2 } from "lucide-react"
import Modal from "@/components/ui/modal"
import ConfirmModal from "@/components/confirm-modal"
import { Button } from "@/components/ui/button"
import type { Subscription, CreditCard as CreditCardType, Service } from "@/app/page"

interface SubscriptionModalProps {
  isOpen: boolean
  subscription: Subscription | null
  cards: CreditCardType[]
  services: Service[]
  onClose: () => void
  onDelete: (id: string) => void
}

export default function SubscriptionModal({
  isOpen,
  subscription,
  cards,
  services,
  onClose,
  onDelete,
}: SubscriptionModalProps) {
  const [showConfirm, setShowConfirm] = useState(false)

  if (!subscription) return null

  const card = cards.find((c) => c.id === subscription.cardId)
  const service = services.find((s) => s.id === subscription.serviceId)

  const getBillingUrl = () => {
    if (subscription.billingUrl) return subscription.billingUrl
    if (service?.billingUrl) return service.billingUrl
    return null
  }

  const billingUrl = getBillingUrl()
  const renewalDate = new Date(subscription.renewalDate)
  const today = new Date()
  const daysUntilRenewal = Math.ceil((renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  const handleDelete = () => {
    onDelete(subscription.id)
    onClose()
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={subscription.service}>
        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Price */}
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">Price</span>
            <span className="text-2xl font-semibold tabular-nums">${subscription.price.toFixed(2)}</span>
          </div>

          {/* Renewal Date */}
          <div className="flex items-center justify-between py-3 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Renewal Date</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{renewalDate.toLocaleDateString()}</p>
              <p className={`text-xs ${daysUntilRenewal <= 7 && daysUntilRenewal > 0 ? "text-destructive" : "text-muted-foreground"}`}>
                {daysUntilRenewal > 0 ? `${daysUntilRenewal} days left` : daysUntilRenewal === 0 ? "Today" : "Expired"}
              </p>
            </div>
          </div>

          {/* Card */}
          <div className="flex items-center justify-between py-3 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CreditCard className="w-4 h-4" />
              <span>Payment Card</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{card?.name || "Unknown"}</p>
              <p className="text-xs text-muted-foreground">****{card?.last4}</p>
            </div>
          </div>

          {/* Credits */}
          {subscription.credits && (
            <div className="flex items-center justify-between py-3 border-t border-border">
              <span className="text-sm text-muted-foreground">Credits/Plan</span>
              <span className="text-sm font-medium">{subscription.credits}</span>
            </div>
          )}

          {/* Billing URL */}
          {billingUrl && (
            <div className="py-3 border-t border-border">
              <a
                href={billingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between text-sm hover:text-foreground text-muted-foreground transition-colors group"
              >
                <span>Billing Page</span>
                <span className="flex items-center gap-1 group-hover:underline">
                  Open <ExternalLink className="w-3 h-3" />
                </span>
              </a>
            </div>
          )}

          {/* Notes */}
          {subscription.notes && (
            <div className="py-3 border-t border-border">
              <p className="text-sm text-muted-foreground mb-1">Notes</p>
              <p className="text-sm">{subscription.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Close
          </Button>
          <Button
            variant="ghost"
            onClick={() => setShowConfirm(true)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Subscription"
        message={`Are you sure you want to delete "${subscription.service}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
      />
    </>
  )
}
