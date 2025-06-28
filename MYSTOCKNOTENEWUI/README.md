# MyStockNote - Complete Trading & Investment Management Platform

A modern, comprehensive web application for traders and investors to track, analyze, and optimize their portfolio performance.

## 🚀 Features

### Core Functionality

- **📊 Dashboard**: Real-time portfolio overview with key metrics and performance indicators
- **📝 Journal**: Comprehensive trade logging with entry/exit points, stop losses, and notes
- **📈 Analytics**: Advanced performance analytics with charts, sector allocation, and risk metrics
- **📚 Learn**: Curated learning resources, books, blogs, and market insights
- **💰 Pricing**: Flexible pricing plans for different user needs
- **👤 Profile**: User account management and settings

### Navigation & UX

- **Dynamic Sidebar**: Context-aware navigation with quick access to all features
- **Responsive Header**: Clean navigation bar for public pages
- **Mobile-Friendly**: Optimized for all device sizes
- **Toast Notifications**: Real-time feedback for user actions

## 🛠 Technology Stack

- **Frontend**: React 18 with TypeScript
- **Routing**: React Router 6 (Single Page Application)
- **Styling**: TailwindCSS 3 with custom design system
- **UI Components**: Radix UI primitives with custom styling
- **Charts**: Recharts for data visualization
- **Build Tool**: Vite for fast development and optimized builds
- **Testing**: Vitest for unit tests

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Core UI component library (buttons, cards, etc.)
│   ├── dashboard/      # Dashboard-specific components
│   ├── AppNavigation.tsx  # Unified navigation component
│   ├── DynamicSidebar.tsx # Dynamic sidebar for app pages
│   ├── Header.tsx      # Header for landing pages
│   └── Footer.tsx      # Site-wide footer
├── pages/              # Route components
│   ├── Index.tsx       # Landing page
│   ├── Auth.tsx        # Authentication
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Analytics.tsx   # Performance analytics
│   ├── StockJournal.tsx # Trade logging
│   ├── BlogsBooks.tsx  # Learning resources
│   ├── Pricing.tsx     # Pricing plans
│   └── Profile.tsx     # User profile
├── lib/                # Utilities and data
│   ├── utils.ts        # Utility functions (cn, etc.)
│   ├── analyticsData.ts # Mock data for analytics
│   └── mockData.ts     # Mock data for journal
├── hooks/              # Custom React hooks
│   └── use-toast.ts    # Toast notification hook
├── types/              # TypeScript type definitions
│   └── stock.ts        # Stock and journal interfaces
└── App.tsx             # Main app component with routing
```

## 🎨 Design System

### Brand Colors

- **Primary**: Blue gradient (#3b82f6 to #6366f1)
- **Secondary**: Purple (#8b5cf6)
- **Success**: Green (#10b981)
- **Warning**: Orange (#f59e0b)
- **Error**: Red (#ef4444)

### Component Variants

- **Cards**: Gradient backgrounds with subtle shadows
- **Buttons**: Multiple variants (primary, secondary, outline, ghost)
- **Navigation**: Active states with color coding
- **Charts**: Consistent color palette across all visualizations

## 🗺 Navigation Flow

### Public Pages (Header Navigation)

```
Landing Page → Auth → Dashboard
     ↓
Learn, Pricing, Profile (accessible from header)
```

### App Pages (Sidebar Navigation)

```
Dashboard ← → Journal ← → Analytics
    ↓           ↓         ↓
  Profile ← → Learn → Pricing
```

### Key User Journeys

1. **New User**: Landing → Auth → Dashboard → Journal (add first trade)
2. **Active Trader**: Dashboard → Journal → Analytics (review performance)
3. **Learning**: Landing → Learn → Auth → Dashboard

## 🚦 Getting Started

### Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Key URLs

- `/` - Landing page with feature overview
- `/auth` - Login/signup with social options
- `/dashboard` - Main portfolio dashboard
- `/journal` - Trade logging and management
- `/analytics` - Performance analytics and insights
- `/learn` - Educational content and resources
- `/pricing` - Subscription plans
- `/profile` - User account settings

## 📊 Key Components

### Dashboard Features

- Portfolio value and daily P&L
- Performance metrics (win rate, profit factor, etc.)
- Recent trades feed
- Top/worst performing stocks
- Monthly performance charts

### Journal Features

- Trade entry with full details
- Status tracking (Active/Closed)
- Filtering and sorting options
- Performance calculations
- Export capabilities

### Analytics Features

- Portfolio allocation charts
- Performance vs. market comparison
- Risk metrics and analysis
- Sector-wise breakdown
- Monthly profit/loss trends

## 🔧 Customization

### Adding New Pages

1. Create component in `src/pages/`
2. Add route to `src/App.tsx`
3. Update navigation in relevant components
4. Add to footer links if needed

### Extending Data Models

1. Update types in `src/types/`
2. Extend mock data in `src/lib/`
3. Update components to use new fields
4. Add validation if needed

### Theme Customization

- Update CSS variables in `src/index.css`
- Modify TailwindCSS config in `tailwind.config.ts`
- Adjust component variants in UI components

## 🎯 Future Enhancements

### Planned Features

- [ ] Real-time market data integration
- [ ] Advanced portfolio optimization
- [ ] Social trading features
- [ ] Mobile app companion
- [ ] AI-powered insights
- [ ] Integration with brokers

### Technical Improvements

- [ ] PWA capabilities
- [ ] Offline functionality
- [ ] Real-time notifications
- [ ] Advanced caching strategies
- [ ] Performance monitoring
- [ ] Automated testing coverage

## 🤝 Contributing

This project follows modern React development best practices:

- **TypeScript** for type safety
- **Component composition** over large monolithic components
- **Custom hooks** for reusable logic
- **Consistent styling** with design system
- **Responsive design** for all components
- **Accessibility** considerations in UI components

## 📄 License

Copyright © 2025 MyStockNote. All rights reserved.

---

**MyStockNote** - Your intelligent trading companion for better investment decisions.
