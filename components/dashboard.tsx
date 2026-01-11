"use client"

import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import type { Subscription, CreditCard } from "@/app/page"

interface DashboardProps {
  subscriptions: Subscription[]
  cards: CreditCard[]
}

export default function Dashboard({ subscriptions, cards }: DashboardProps) {
  const totalSpending = subscriptions.reduce((sum, sub) => sum + sub.price, 0)
  const monthlySpending = subscriptions.reduce((sum, sub) => sum + sub.price, 0)

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

  // Grayscale colors for minimalist look
  const colors = ["#000000", "#333333", "#555555", "#777777", "#999999", "#bbbbbb"]

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-8">
      {/* Total Spending */}
      <div className="border border-border p-4">
        <p className="text-xs font-medium text-muted-foreground mb-1">Total Spending</p>
        <p className="text-2xl font-semibold tabular-nums">${totalSpending.toFixed(2)}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {subscriptions.length} subscription{subscriptions.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Monthly Spending */}
      <div className="border border-border p-4">
        <p className="text-xs font-medium text-muted-foreground mb-1">Monthly Recurring</p>
        <p className="text-2xl font-semibold tabular-nums">${monthlySpending.toFixed(2)}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {cards.length} card{cards.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Upcoming Renewals */}
      <div className="border border-border p-4">
        <p className="text-xs font-medium text-muted-foreground mb-1">Upcoming (30 days)</p>
        <p className="text-2xl font-semibold tabular-nums">{upcomingRenewals.length}</p>
        <p className="text-xs text-muted-foreground mt-1">
          renewal{upcomingRenewals.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Spending by Service */}
      {chartData.length > 0 && (
        <div className="border border-border p-4 md:col-span-2">
          <p className="text-xs font-medium text-muted-foreground mb-1">Spending by Service</p>
          <p className="text-xs text-muted-foreground mb-4">Monthly breakdown</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: $${value.toFixed(2)}`}
                outerRadius={70}
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

      {/* Upcoming Renewals List */}
      {upcomingRenewals.length > 0 && (
        <div className="border border-border p-4">
          <p className="text-xs font-medium text-muted-foreground mb-1">Next Renewals</p>
          <p className="text-xs text-muted-foreground mb-4">Due in 30 days</p>
          <div className="space-y-3">
            {upcomingRenewals.slice(0, 4).map((sub) => (
              <div key={sub.id} className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium">{sub.service}</p>
                  <p className="text-xs text-muted-foreground">{new Date(sub.renewalDate).toLocaleDateString()}</p>
                </div>
                <p className="text-sm font-semibold tabular-nums">${sub.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
