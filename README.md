# Theme Swap Showcase - Vite React + JavaScript

A modern admin dashboard built with Vite, React, and JavaScript, featuring a theme swapping system and comprehensive trading contest management.

## Project Overview

This project demonstrates a full-featured admin dashboard for managing trading contests, users, and platform settings. It includes:

- **Theme Management**: Dynamic theme switching with multiple color schemes
- **Contest Management**: Create and manage trading contests
- **User Management**: Admin controls for user accounts
- **Analytics Dashboard**: Platform performance metrics
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Technologies Used

This project is built with:

- **Vite** - Fast build tool and dev server
- **React 18** - Modern React with hooks
- **JavaScript (ES6+)** - Modern JavaScript features
- **shadcn/ui** - Beautiful, accessible UI components
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Hook Form** - Form handling and validation
- **Lucide React** - Beautiful icons

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Modern web browser

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd theme-swap-showcase-81-main

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── AdminDashboard.jsx
│   ├── AdminHeader.jsx
│   ├── AdminSidebar.jsx
│   ├── ContestForm.jsx
│   └── StockSelector.jsx
├── contexts/            # React contexts
│   └── ThemeContext.jsx
├── data/                # Static data and mock data
│   ├── stocks.js
│   └── themes.js
├── hooks/               # Custom React hooks
│   ├── useStockPrices.js
│   ├── useToast.js
│   └── use-mobile.jsx
├── lib/                 # Utility functions
│   └── utils.js
├── pages/               # Page components
│   ├── Analytics.jsx
│   ├── Contests.jsx
│   ├── Games.jsx
│   ├── Index.jsx
│   ├── Security.jsx
│   ├── Settings.jsx
│   ├── Trading.jsx
│   ├── Users.jsx
│   └── Wallet.jsx
├── types/               # JSDoc type definitions
│   ├── contest.js
│   ├── stock.js
│   └── theme.js
├── App.jsx              # Main application component
└── main.jsx             # Application entry point
```

## Features

### Theme System
- Multiple pre-built themes (Light, Dark, Colorful)
- Dynamic theme switching
- Persistent theme selection
- CSS custom properties for easy customization

### Admin Dashboard
- **Contests**: Create and manage trading contests
- **Users**: User management and permissions
- **Analytics**: Platform performance metrics
- **Settings**: Platform configuration
- **Security**: Security monitoring and settings
- **Trading**: Live trading dashboard
- **Wallet**: Transaction management

### UI Components
- Responsive design with Tailwind CSS
- Accessible components from shadcn/ui
- Dark/light mode support
- Mobile-optimized interface

## Development

### Code Style
- ESLint configuration for JavaScript
- Consistent formatting with Prettier
- JSDoc comments for type documentation

### Adding New Features
1. Create new components in the appropriate directory
2. Add routing in `App.jsx`
3. Update navigation in `AdminSidebar.jsx`
4. Follow existing patterns for state management

## Deployment

This project can be deployed to any static hosting service:

- **Vercel**: Connect your GitHub repository
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use GitHub Actions for automatic deployment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
