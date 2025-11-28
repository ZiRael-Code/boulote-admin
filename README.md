# Boulote Admin Dashboard

Admin dashboard for managing the Boulote platform - connecting companies with top professionals.

## 🚀 Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the admin dashboard.

## 📦 Tech Stack

- **Next.js** 15.5.4 - React framework with App Router
- **React** 19.1.0 - UI library
- **TypeScript** 5.x - Type safety
- **Tailwind CSS** 4.x - Styling
- **Zustand** 5.0.8 - State management
- **React Query** 5.x - Server state management
- **Axios** 1.12.2 - HTTP client
- **React Hook Form** 7.x - Form handling
- **Zod** 4.x - Schema validation
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

## 📁 Folder Structure

```
app/
  ├── auth/           # Authentication pages
  │   └── login/      # Admin login
  ├── dashboard/      # Main dashboard
  ├── layout.tsx      # Root layout
  ├── page.tsx        # Home page (redirects)
  ├── providers.tsx   # React Query provider
  └── globals.css     # Global styles & design tokens

components/
  └── ui/             # Reusable UI components
      ├── button/     # Button component
      └── input/      # Input components

lib/
  ├── api/            # API configuration
  │   └── axios-config.ts
  ├── store/          # Zustand stores
  │   └── auth-store.ts
  ├── utils/          # Utility functions
  │   └── cn.ts       # Class name merger
  ├── validations/    # Zod schemas
  └── types/          # TypeScript types
```

## 🎨 Design System

The admin dashboard uses the same design system as the main Boulote platform:

- **Primary Blue**: `primary-500` (#0070C4)
- **Success Green**: `success-500` (#00AF50)
- **Text**: `secondary-500` (#1A1A1A)
- **Neutral**: `neutral-500` (#6B6B6B)
- **Border**: `border-500` (#E5E5E5)

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start dev server with Turbopack

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## 🔐 Authentication

The admin panel uses JWT-based authentication with Zustand for state management.

Default credentials (development):
- Email: `admin@gmail.com`
- Password: (to be configured)

## 🌐 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

## 📝 Development Guidelines

- Use TypeScript for all code
- Follow kebab-case for file names
- Use functional components
- Keep components under 80 lines
- Use absolute imports with `@/`
- Follow the existing design system

## 🚢 Deployment

The admin dashboard can be deployed separately from the main platform:

```bash
npm run build
npm run start
```

Or deploy to Vercel:

```bash
vercel deploy
```

## 📄 License

Proprietary - Boulote Platform
