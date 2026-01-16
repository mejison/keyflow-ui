# KeyFlow UI ⌨️

![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?style=flat-square&logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**KeyFlow** is a modern, responsive typing test application designed to help users improve their typing speed and accuracy. Built with Vue 3, TypeScript, and Vite, it offers real-time WPM (Words Per Minute) tracking, multiple language support, and competitive leaderboards.

## 🌟 Features

- **⚡ Real-time Typing Test** - Practice typing with instant WPM and accuracy tracking
- **🌍 Multi-language Support** - Practice in English with various word sets (1k, 5k, 10k words)
- **📊 Statistics & Analytics** - Track your WPM, accuracy, and typing patterns
- **🏆 Leaderboards** - Compete with other typists globally
- **👤 User Authentication** - Sign up, login, and save your progress
- **🔐 OAuth Integration** - Google and GitHub authentication support
- **🎨 Theme Customization** - Dark/Light theme with smooth transitions
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **♿ Accessibility** - WCAG compliant with keyboard navigation
- **🔔 Toast Notifications** - User-friendly feedback system
- **📈 Progress Tracking** - View your improvement over time
- **⚙️ Customizable Settings** - Adjust test duration and difficulty

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x or **yarn** >= 1.22.x

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/keyflow-ui.git
cd keyflow-ui

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
keyflow-ui/
├── public/              # Static assets
│   ├── _redirects       # Netlify redirects
│   ├── manifest.json    # PWA manifest
│   └── robots.txt       # SEO robots file
├── src/
│   ├── assets/          # Word sets and static resources
│   │   ├── english.json
│   │   ├── english_1k.json
│   │   ├── english_5k.json
│   │   └── english_10k.json
│   ├── components/      # Vue components
│   │   ├── TypingArea.vue
│   │   ├── StatsBar.vue
│   │   ├── Header.vue
│   │   └── ...
│   ├── composables/     # Vue composables
│   │   ├── useLanguage.ts
│   │   ├── useMeta.ts
│   │   └── useToast.ts
│   ├── config/          # Configuration files
│   │   ├── oauth.ts
│   │   └── typing.ts
│   ├── layouts/         # Layout components
│   ├── pages/           # Page components
│   ├── router/          # Vue Router configuration
│   ├── services/        # API services
│   ├── stores/          # Pinia stores
│   │   ├── auth.ts
│   │   ├── typing.ts
│   │   ├── theme.ts
│   │   └── settings.ts
│   ├── styles/          # Global styles
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   ├── App.vue          # Root component
│   └── main.ts          # Application entry point
├── .env.example         # Environment variables template
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
└── vitest.config.ts     # Vitest test configuration
```

## 🛠 Tech Stack

### Core
- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Next-generation frontend tooling
- **Vue Router** - Official router for Vue.js
- **Pinia** - State management library

### Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **PostCSS** - CSS transformations
- **Sass** - CSS preprocessor

### API & Backend Integration
- **Axios** - HTTP client for API requests
- **RESTful API** - Backend communication

### Testing
- **Vitest** - Unit testing framework
- **Vue Test Utils** - Vue component testing
- **Testing Library** - User-centric testing utilities
- **Happy DOM / JSDOM** - DOM testing environments

### Monitoring & Analytics
- **Sentry** - Error tracking and monitoring
- **Google Analytics 4** - User analytics

### Developer Experience
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking
- **Hot Module Replacement** - Fast development

## 📜 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build

# Testing
npm run test             # Run unit tests
npm run test:ui          # Run tests with UI
npm run test:coverage    # Generate test coverage report

# Code Quality
npm run type-check       # Check TypeScript types
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Backend API URL
VITE_API_BASE_URL=http://localhost:3000/api

# Google Analytics 4
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Sentry DSN for error monitoring
VITE_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx

# Environment
VITE_ENV=development
```

### OAuth Setup

To enable OAuth authentication (Google, GitHub), follow the [OAuth Setup Guide](./OAUTH_SETUP.md).

### API Integration

The frontend communicates with the backend API. See [API Integration Guide](./API_INTEGRATION.md) for details.

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

Tests are located in `__tests__` directories next to the files they test.

## 📦 Deployment

For detailed deployment instructions, see [Deployment Guide](./DEPLOYMENT.md).

### Quick Deploy

#### Vercel
```bash
npm install -g vercel
vercel --prod
```

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

## 🎨 Features in Detail

### Typing Test
- Real-time WPM calculation
- Accuracy tracking
- Error highlighting
- Smooth character-by-character validation
- Customizable test duration (15s, 30s, 60s, 120s)

### User Management
- Email/password authentication
- OAuth (Google, GitHub)
- Profile management
- Password reset functionality
- Session management with auto-refresh

### Leaderboards
- Global rankings
- Daily, weekly, and all-time leaderboards
- Filter by language and word set
- Real-time updates

### Settings
- Theme selection (Light/Dark)
- Language preferences
- Word set selection (1k, 5k, 10k words)
- Account settings

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 Documentation

- [API Integration Guide](./API_INTEGRATION.md)
- [OAuth Setup Guide](./OAUTH_SETUP.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Testing Guide](./TESTING.md)

## 🐛 Bug Reports

If you discover a bug, please create an issue on GitHub with:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Screenshots (if applicable)
- Browser and OS information

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Vue.js team for the amazing framework
- Vite team for the blazing-fast build tool
- Tailwind CSS for the utility-first CSS framework
- All contributors who help improve KeyFlow

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Made with ❤️ by the KeyFlow team
