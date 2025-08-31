# Bikedoot - Vite + React + Tailwind CSS

A modern React application built with Vite and styled with Tailwind CSS v3.

## 🚀 Features

- ⚡ **Vite** - Lightning fast build tool
- ⚛️ **React 19** - Latest React with modern features
- 🎨 **Tailwind CSS v3** - Utility-first CSS framework
- 📦 **pnpm** - Fast, disk space efficient package manager
- 🔧 **ESLint** - Code linting and formatting
- 🎯 **Hot Module Replacement (HMR)** - Instant updates during development

## 📦 Installation

```bash
# Install dependencies
pnpm install
```

## 🛠️ Development

```bash
# Start development server
pnpm dev

# The app will be available at http://localhost:5173
```

## 🏗️ Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 🧹 Linting

```bash
# Run ESLint
pnpm lint
```

## 📁 Project Structure

```
bikedoot/
├── public/          # Static assets
├── src/
│   ├── assets/      # Images and other assets
│   ├── App.jsx      # Main application component
│   ├── index.css    # Global styles with Tailwind directives
│   └── main.jsx     # Application entry point
├── tailwind.config.js  # Tailwind CSS configuration
├── postcss.config.js   # PostCSS configuration
├── vite.config.js      # Vite configuration
└── package.json        # Dependencies and scripts
```

## 🎨 Tailwind CSS

This project uses Tailwind CSS v3 with the following configuration:

- **Content paths**: All React components and HTML files
- **Custom animations**: Slow spin animation for the React logo
- **PostCSS**: Configured with autoprefixer

### Custom Classes Used

- `animate-spin-slow`: Custom 3-second spin animation
- Responsive design with mobile-first approach
- Gradient backgrounds and modern UI components

## 🔧 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

## 🌟 Getting Started

1. Clone the repository
2. Install dependencies with `pnpm install`
3. Start development server with `pnpm dev`
4. Open http://localhost:5173 in your browser
5. Start coding! 🎉

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
