"use client"

import { LayoutDashboard, CreditCard, Layers, Receipt, ChevronLeft, ChevronRight } from "lucide-react"

export type View = "dashboard" | "subscriptions" | "services" | "cards"

interface SidebarProps {
  activeView: View
  onViewChange: (view: View) => void
  subscriptionCount: number
  serviceCount: number
  cardCount: number
  collapsed: boolean
  onToggleCollapse: () => void
}

export default function Sidebar({
  activeView,
  onViewChange,
  subscriptionCount,
  serviceCount,
  cardCount,
  collapsed,
  onToggleCollapse,
}: SidebarProps) {
  const navItems = [
    { id: "dashboard" as View, label: "Dashboard", icon: LayoutDashboard, count: null },
    { id: "subscriptions" as View, label: "Subscriptions", icon: Receipt, count: subscriptionCount },
    { id: "services" as View, label: "Services", icon: Layers, count: serviceCount },
    { id: "cards" as View, label: "Cards", icon: CreditCard, count: cardCount },
  ]

  return (
    <aside
      className={`border-r border-border h-screen sticky top-0 flex flex-col bg-background transition-all duration-200 ease-out ${
        collapsed ? "w-14" : "w-56"
      }`}
    >
      {/* Header */}
      <div className={`p-4 border-b border-border flex items-center ${collapsed ? "justify-center" : "justify-end"}`}>
        <button
          onClick={onToggleCollapse}
          className="p-1 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeView === item.id

            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center ${collapsed ? "justify-center" : "justify-between"} px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <span className={`flex items-center ${collapsed ? "" : "gap-2"}`}>
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </span>
                  {!collapsed && item.count !== null && item.count > 0 && (
                    <span className={`text-xs tabular-nums ${isActive ? "text-background/70" : "text-muted-foreground"}`}>
                      {item.count}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

    </aside>
  )
}
