"use client"

import { useState } from "react"
import { Plus, Trash2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import AddServiceModal from "@/components/add-service-modal"
import ConfirmModal from "@/components/confirm-modal"
import type { Service } from "@/app/page"

interface ServicesViewProps {
  services: Service[]
  onAdd: (service: Omit<Service, "id" | "createdAt">) => void
  onDelete: (id: string) => void
}

export default function ServicesView({ services, onAdd, onDelete }: ServicesViewProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [deleteService, setDeleteService] = useState<Service | null>(null)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Services</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Templates for quick subscription creation
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} variant="outline" size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      {/* Services List */}
      {services.length === 0 ? (
        <div className="border border-dashed border-border p-8 text-center text-muted-foreground text-sm">
          No services added yet
        </div>
      ) : (
        <div className="border border-border divide-y divide-border">
          {services.map((service) => (
            <div
              key={service.id}
              className="px-4 py-2.5 flex items-center justify-between group hover:bg-secondary transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-medium text-sm truncate">{service.name}</span>
              </div>
              <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                {service.defaultPrice !== undefined && (
                  <span className="text-sm text-muted-foreground tabular-nums">
                    ${service.defaultPrice.toFixed(2)}
                  </span>
                )}
                {service.billingUrl && (
                  <a
                    href={service.billingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteService(service)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive h-7 w-7 p-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddServiceModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={onAdd}
      />

      <ConfirmModal
        isOpen={!!deleteService}
        onClose={() => setDeleteService(null)}
        onConfirm={() => deleteService && onDelete(deleteService.id)}
        title="Delete Service"
        message={`Are you sure you want to delete "${deleteService?.name}"?`}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  )
}
