"use client"

import { Trash2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Service } from "@/app/page"

interface ServiceListProps {
  services: Service[]
  onDelete: (serviceId: string) => void
}

export default function ServiceList({ services, onDelete }: ServiceListProps) {
  if (services.length === 0) {
    return (
      <div className="border border-dashed border-border p-6 text-center text-muted-foreground text-sm">
        No services added yet. Add your first service to get started.
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {services.map((service) => (
        <div key={service.id} className="border border-border p-3 flex items-center justify-between group hover:border-foreground/20 transition-colors">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-sm truncate">{service.name}</p>
              {service.category && (
                <span className="text-xs px-1.5 py-0.5 bg-secondary text-secondary-foreground">
                  {service.category}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1">
              {service.defaultPrice !== undefined && (
                <p className="text-xs text-muted-foreground">
                  ${service.defaultPrice.toFixed(2)}/mo
                </p>
              )}
              {service.billingUrl && (
                <a
                  href={service.billingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Billing
                </a>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(service.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}
