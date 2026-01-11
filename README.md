# AutoPay Tracker

A web application for monitoring and managing API credit subscriptions and spending. Track multiple payment cards, manage recurring subscriptions, and monitor monthly spending patterns.

## Features

- **Dashboard** - View total monthly spending, active subscriptions count, spending breakdown by service (pie chart), and upcoming renewals
- **Subscriptions** - Add, view, and manage recurring subscriptions with renewal date tracking and alerts for expiring subscriptions
- **Services** - Create service templates with default pricing and billing URLs for quick subscription setup
- **Cards** - Register payment cards and track associated subscriptions and spending per card

## Tech Stack

- **Framework**: Next.js 16 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI / shadcn/ui
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation
- **Storage**: localStorage (client-side persistence)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── page.tsx           # Main page with state management
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── views/             # Page view components
│   │   ├── dashboard-view.tsx
│   │   ├── subscriptions-view.tsx
│   │   ├── services-view.tsx
│   │   └── cards-view.tsx
│   └── ...                # Forms, modals, lists
├── hooks/                  # Custom React hooks
└── lib/                    # Utility functions
```

## Data Storage

All data is stored in the browser's localStorage:

- `autopay_cards` - Payment card information
- `autopay_services` - Service templates
- `autopay_subscriptions` - Active subscriptions

## License

MIT
