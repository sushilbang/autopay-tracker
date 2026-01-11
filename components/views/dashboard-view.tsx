"use client"

import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import type { Subscription, CreditCard, Service } from "@/app/page"

interface DashboardViewProps {
  subscriptions: Subscription[]
  cards: CreditCard[]
  services: Service[]
}

export default function DashboardView({ subscriptions, cards, services }: DashboardViewProps) {
  const totalSpending = subscriptions.reduce((sum, sub) => sum + sub.price, 0)

  // Prepare data by service
  const serviceData = subscriptions.reduce((acc: Record<string, number>, sub) => {
    acc[sub.service] = (acc[sub.service] || 0) + sub.price
    return acc
  }, {})

  const chartData = Object.entries(serviceData).map(([service, price]) => ({
    name: service,
    value: price,
  }))

  // Get upcoming renewals (next 30 days)
  const today = new Date()
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
  const upcomingRenewals = subscriptions
    .filter((sub) => {
      const renewalDate = new Date(sub.renewalDate)
      return renewalDate >= today && renewalDate <= thirtyDaysFromNow
    })
    .sort((a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime())

  // Grayscale colors
  const colors = ["#0a0a0a", "#333333", "#555555", "#777777", "#999999", "#bbbbbb"]

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <div className="border border-border p-4">
          <p className="text-xs font-medium text-muted-foreground mb-1">Total Monthly</p>
          <p className="text-2xl font-semibold tabular-nums">${totalSpending.toFixed(2)}</p>
        </div>

        <div className="border border-border p-4">
          <p className="text-xs font-medium text-muted-foreground mb-1">Subscriptions</p>
          <p className="text-2xl font-semibold tabular-nums">{subscriptions.length}</p>
        </div>

        <div className="border border-border p-4">
          <p className="text-xs font-medium text-muted-foreground mb-1">Services</p>
          <p className="text-2xl font-semibold tabular-nums">{services.length}</p>
        </div>

        <div className="border border-border p-4">
          <p className="text-xs font-medium text-muted-foreground mb-1">Cards</p>
          <p className="text-2xl font-semibold tabular-nums">{cards.length}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Spending Chart */}
        {chartData.length > 0 && (
          <div className="border border-border p-4">
            <p className="text-sm font-medium mb-1">Spending by Service</p>
            <p className="text-xs text-muted-foreground mb-4">Monthly breakdown</p>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: $${value.toFixed(2)}`}
                  outerRadius={80}
                  fill="#000"
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `$${Number(value).toFixed(2)}`}
                  contentStyle={{
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: "0",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Upcoming Renewals */}
        <div className="border border-border p-4">
          <p className="text-sm font-medium mb-1">Upcoming Renewals</p>
          <p className="text-xs text-muted-foreground mb-4">Next 30 days</p>
          {upcomingRenewals.length === 0 ? (
            <p className="text-sm text-muted-foreground">No upcoming renewals</p>
          ) : (
            <div className="space-y-3">
              {upcomingRenewals.slice(0, 5).map((sub) => {
                const renewalDate = new Date(sub.renewalDate)
                const daysLeft = Math.ceil((renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

                return (
                  <div key={sub.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium">{sub.service}</p>
                      <p className="text-xs text-muted-foreground">
                        {renewalDate.toLocaleDateString()} ({daysLeft}d)
                      </p>
                    </div>
                    <p className="text-sm font-semibold tabular-nums">${sub.price.toFixed(2)}</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Empty State */}
      {subscriptions.length === 0 && (
        <div className="border border-dashed border-border p-8 text-center mt-6">
          <p className="text-muted-foreground">No subscriptions yet. Add your first subscription to see stats.</p>
        </div>
      )}
    </div>
  )
}
