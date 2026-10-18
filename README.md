# Pratham Collab AI

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Prathamsimgh/pratham-collab-ai)

> A next-generation collaborative AI editor built with cutting-edge web technologies. Create, collaborate, and enhance your writing with AI assistance in real-time.

## 🚀 Overview

Pratham Collab AI is a powerful, real-time collaborative text editor that combines the best of modern web development with artificial intelligence. Built by **Pratham Singh (B.Tech, LPU '25)**, this project showcases advanced React development, real-time collaboration, and AI integration.

### ✨ Key Features

- **🤝 Real-time Collaboration**: Multiple users can edit documents simultaneously with live cursor tracking
- **🤖 AI-Powered Writing Assistant**: Integrated AI chat sidebar with context-aware suggestions
- **🎯 Smart Editing Toolbar**: Floating AI toolbar for quick text enhancements and edits
- **🔍 Intelligent Search**: Built-in web search agent powered by Tavily API
- **📱 Responsive Design**: Beautiful, mobile-friendly interface built with Tailwind CSS
- **⚡ Lightning Fast**: Optimized with Next.js 15 and Turbopack for blazing-fast development
- **🎨 Modern UI**: Clean, intuitive interface with smooth animations and interactions

## 🛠️ Technology Stack

### Frontend Framework
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Modern utility-first styling

### Editor & Collaboration
- **TipTap** - Extensible rich text editor
- **Yjs** - Shared data types for building collaborative applications
- **Y-WebSocket** - Real-time synchronization
- **Y-ProseMirror** - ProseMirror binding for Yjs

### AI Integration
- **OpenAI API** - Primary AI provider (recommended)
- **OpenRouter API** - Alternative AI provider
- **Tavily API** - Web search capabilities

### UI Components & Styling
- **Lucide React** - Beautiful icon library
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

### Development Tools
- **ESLint** - Code linting
- **Turbopack** - Ultra-fast bundler
- **VS Code Extensions** - Enhanced development experience

## 📁 Project Structure

```
pratham-collab-ai/
├── pratham-collab-ai/          # Main application directory
│   ├── src/app/                # Next.js app directory
│   ├── components/             # React components
│   │   ├── ChatSidebar.tsx     # AI chat interface
│   │   ├── Editor.tsx          # Main editor component
│   │   └── PreviewModal.tsx    # Document preview
│   ├── lib/                    # Utility functions
│   ├── public/                 # Static assets
│   ├── package.json            # Project dependencies
│   ├── next.config.ts          # Next.js configuration
│   ├── tailwind.config.js      # Tailwind CSS config
│   └── tsconfig.json           # TypeScript config
├── .vscode/                    # VS Code settings
├── .history-memo/              # Development history
├── package.json                # Root dependencies (Tailwind)
└── README.md                   # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- API keys for AI services (optional for demo mode)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Prathamsimgh/pratham-collab-ai.git
   cd pratham-collab-ai
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install app dependencies
   cd pratham-collab-ai
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` with your API keys:
   ```env
   OPENAI_API_KEY=your_openai_key_here
   # OR
   OPENROUTER_API_KEY=your_openrouter_key_here
   
   TAVILY_API_KEY=your_tavily_key_here
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_SITE_NAME="Pratham Collab Editor"
   NEXT_PUBLIC_COLLAB_WS_URL=wss://demos.yjs.dev
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Visit `http://localhost:3000` to see the editor in action!

### Available Scripts

Run these from the `pratham-collab-ai` directory:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server with Turbopack |
| `npm run build` | Create an optimized production build |
| `npm run start` | Run the production build locally |
| `npm run lint` | Run ESLint over the codebase |

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy with Vercel**
   - Visit [Vercel](https://vercel.com/new)
   - Import your GitHub repository
   - Set framework preset to "Next.js"
   - Configure environment variables:
     - `OPENAI_API_KEY` or `OPENROUTER_API_KEY`
     - `TAVILY_API_KEY` (optional)
     - `NEXT_PUBLIC_SITE_URL` (your Vercel domain)
     - `NEXT_PUBLIC_SITE_NAME`
     - `NEXT_PUBLIC_COLLAB_WS_URL`

3. **Deploy**
   Click "Deploy" and your app will be live!

### Other Platforms
The app can also be deployed to:
- Netlify
- Railway
- DigitalOcean App Platform
- Any platform supporting Node.js

## 🎮 Usage

### Basic Editing
1. Start typing in the editor
2. Use the toolbar for formatting (bold, italic, etc.)
3. Create tables, lists, and more with TipTap's rich features

### Real-time Collaboration
1. Share your URL with collaborators
2. Add `?room=your-room-name` to create/join specific rooms
3. See live cursors and edits from other users

### AI Features
1. **Chat Sidebar**: Ask questions, get writing suggestions
2. **AI Edit Toolbar**: Select text and use AI to improve, rewrite, or expand
3. **Web Search**: Use the Tavily integration to find relevant information

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|-----------|
| `OPENAI_API_KEY` | OpenAI API key for AI features | Optional* |
| `OPENROUTER_API_KEY` | OpenRouter API key (alternative) | Optional* |
| `TAVILY_API_KEY` | Tavily API key for web search | Optional |
| `NEXT_PUBLIC_SITE_URL` | Your site URL | Yes |
| `NEXT_PUBLIC_SITE_NAME` | Site branding name | Yes |
| `NEXT_PUBLIC_COLLAB_WS_URL` | WebSocket server for collaboration | Yes |

*At least one AI provider key is required for full functionality.

### Collaboration Server
By default, the app uses `wss://demos.yjs.dev` for collaboration. For production, consider:
- [y-websocket](https://github.com/yjs/y-websocket) - Self-hosted WebSocket server
- [Liveblocks](https://liveblocks.io/) - Managed collaboration service
- [PartyKit](https://www.partykit.io/) - Real-time collaboration platform

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Pratham Singh**
- B.Tech Student at LPU '25
- GitHub: [@Prathamsimgh](https://github.com/Prathamsimgh)
- LinkedIn: [Connect with Pratham](https://linkedin.com/in/prathamsingh)

## 🙏 Acknowledgments

- [TipTap](https://tiptap.dev/) - Excellent rich text editor
- [Yjs](https://yjs.dev/) - Amazing collaboration framework  
- [Next.js](https://nextjs.org/) - The React framework for production
- [Vercel](https://vercel.com/) - Seamless deployment platform
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [OpenAI](https://openai.com/) - Powerful AI capabilities

## 📊 Project Status

- ✅ Core editor functionality
- ✅ Real-time collaboration
- ✅ AI chat integration
- ✅ Web search capabilities
- ✅ Responsive design
- 🔄 Advanced AI features (in progress)
- 🔄 User authentication (planned)
- 🔄 Document persistence (planned)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/Prathamsimgh">Pratham Singh</a>
</p>

<p align="center">
  <a href="#top">⬆️ Back to Top</a>
</p>
