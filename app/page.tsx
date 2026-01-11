"use client"

import { useState, useEffect } from "react"
import Sidebar, { type View } from "@/components/sidebar"
import DashboardView from "@/components/views/dashboard-view"
import SubscriptionsView from "@/components/views/subscriptions-view"
import ServicesView from "@/components/views/services-view"
import CardsView from "@/components/views/cards-view"

export interface CreditCard {
  id: string
  name: string
  last4: string
  expiry: string
  createdAt: string
}

export interface Service {
  id: string
  name: string
  defaultPrice?: number
  billingUrl: string
  createdAt: string
}

export interface Subscription {
  id: string
  cardId: string
  serviceId: string
  service: string
  price: number
  credits: string
  renewalDate: string
  notes: string
  billingUrl: string
  createdAt: string
}

export default function Home() {
  const [activeView, setActiveView] = useState<View>("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [cards, setCards] = useState<CreditCard[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [mounted, setMounted] = useState(false)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedCards = localStorage.getItem("autopay_cards")
    const savedServices = localStorage.getItem("autopay_services")
    const savedSubs = localStorage.getItem("autopay_subscriptions")
    const savedCollapsed = localStorage.getItem("autopay_sidebar_collapsed")
    if (savedCards) setCards(JSON.parse(savedCards))
    if (savedServices) setServices(JSON.parse(savedServices))
    if (savedSubs) setSubscriptions(JSON.parse(savedSubs))
    if (savedCollapsed) setSidebarCollapsed(JSON.parse(savedCollapsed))
    setMounted(true)
  }, [])

  // Save cards to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("autopay_cards", JSON.stringify(cards))
    }
  }, [cards, mounted])

  // Save services to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("autopay_services", JSON.stringify(services))
    }
  }, [services, mounted])

  // Save subscriptions to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("autopay_subscriptions", JSON.stringify(subscriptions))
    }
  }, [subscriptions, mounted])

  // Save sidebar state to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("autopay_sidebar_collapsed", JSON.stringify(sidebarCollapsed))
    }
  }, [sidebarCollapsed, mounted])

  const addCard = (card: Omit<CreditCard, "id" | "createdAt">) => {
    const newCard: CreditCard = {
      ...card,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setCards([...cards, newCard])
  }

  const deleteCard = (cardId: string) => {
    setCards(cards.filter((c) => c.id !== cardId))
    setSubscriptions(subscriptions.filter((s) => s.cardId !== cardId))
  }

  const addService = (service: Omit<Service, "id" | "createdAt">) => {
    const newService: Service = {
      ...service,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setServices([...services, newService])
  }

  const deleteService = (serviceId: string) => {
    setServices(services.filter((s) => s.id !== serviceId))
  }

  const addSubscription = (sub: Omit<Subscription, "id" | "createdAt">) => {
    const newSub: Subscription = {
      ...sub,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setSubscriptions([...subscriptions, newSub])
  }

  const deleteSubscription = (subId: string) => {
    setSubscriptions(subscriptions.filter((s) => s.id !== subId))
  }

  if (!mounted) {
    return (
      <div className="flex h-screen bg-background">
        <div className="w-56 border-r border-border" />
        <div className="flex-1" />
      </div>
    )
  }

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <DashboardView
            subscriptions={subscriptions}
            cards={cards}
            services={services}
          />
        )
      case "subscriptions":
        return (
          <SubscriptionsView
            subscriptions={subscriptions}
            cards={cards}
            services={services}
            onAdd={addSubscription}
            onDelete={deleteSubscription}
          />
        )
      case "services":
        return (
          <ServicesView
            services={services}
            onAdd={addService}
            onDelete={deleteService}
          />
        )
      case "cards":
        return (
          <CardsView
            cards={cards}
            subscriptions={subscriptions}
            onAdd={addCard}
            onDelete={deleteCard}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        subscriptionCount={subscriptions.length}
        serviceCount={services.length}
        cardCount={cards.length}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main className="flex-1 overflow-auto">
        {renderView()}
      </main>
    </div>
  )
}
