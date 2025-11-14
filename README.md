# Spanish Flashcards App

A modern, interactive web application for learning Spanish vocabulary through flashcards.

## 🌐 Live Application

**Production URL**: https://flashcards-d8plhalqq-anupams-projects-4f988786.vercel.app

## Features

- ✅ **Interactive Flashcards** - Flip cards to reveal translations
- ✅ **Self-Assessment** - Mark cards as "Right" or "Wrong"
- ✅ **Progress Tracking** - Local storage persistence of learning progress
- ✅ **Audio Feedback** - Click sounds for better user experience
- ✅ **Responsive Design** - Works seamlessly on desktop and mobile devices
- ✅ **50 Spanish Words** - Pre-loaded vocabulary deck

## Tech Stack

- **React 19.2.0** - UI framework
- **TypeScript 5.9.3** - Type safety
- **Vite 7.2.2** - Build tool
- **Playwright** - E2E testing
- **Vercel** - Deployment platform

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Install client dependencies
cd client
npm install
```

### Development

```bash
# Run development server
cd client
npm run dev
```

### Build

```bash
# Build for production
cd client
npm run build

# Preview production build
npm run preview
```

### Testing

```bash
# Run E2E tests
npm run test:e2e

# View test report
npm run test:e2e:report
```

## Project Structure

```
flashcards/
├── client/              # React application
│   ├── src/
│   │   ├── App.tsx     # Main component
│   │   ├── hooks/      # Custom React hooks
│   │   ├── utils/      # Utility functions
│   │   ├── types/      # TypeScript types
│   │   └── data/       # Flashcard data
│   └── tests/          # E2E tests
├── docs/               # Documentation
│   ├── specification.md
│   ├── TODO.md
│   └── SESSION_SUMMARY.md
└── vercel.json        # Deployment configuration
```

## Documentation

- [Project Specification](docs/specification.md)
- [TODO List](docs/TODO.md)
- [Session Summary](docs/SESSION_SUMMARY.md)

## Deployment

The application is automatically deployed to Vercel. Each push to the `master` branch triggers a new deployment.

**Production**: https://flashcards-d8plhalqq-anupams-projects-4f988786.vercel.app

## Contributing

This is a personal learning project. For questions or suggestions, please open an issue on GitHub.

## License

This project is for educational purposes.

---

**Repository**: [github.com/anupamprasad/flashcards](https://github.com/anupamprasad/flashcards)

