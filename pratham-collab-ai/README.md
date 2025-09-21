# 🚀 Pratham Collab AI - Enhanced Collaborative Editor

A beautiful, modern collaborative AI editor built with Next.js, TipTap, and Yjs. Features real-time collaboration, AI-powered editing, intelligent suggestions, and a stunning glass-morphism UI design.

## ✨ What's New (Latest Updates)

### 🎨 **Enhanced UI & Design**

- **Modern Glass-morphism Interface**: Beautiful translucent design with backdrop blur effects
- **Improved Visual Hierarchy**: Better spacing, typography, and layout organization
- **Smooth Animations**: Elegant transitions and micro-interactions throughout the app
- **Enhanced Color Palette**: Professional brand colors with accent variations
- **Better Loading States**: Animated spinners and skeleton loading for better UX

### 📱 **Mobile Optimization**

- **Responsive Design**: Fully optimized for mobile devices and tablets
- **Touch-Friendly**: Improved touch targets and gesture support
- **Performance Optimized**: Reduced animations on mobile for better performance
- **Accessibility**: High contrast mode and reduced motion support

### 🛠️ **Deployment & Performance**

- **Fixed Vercel Configuration**: Corrected build settings for seamless deployment
- **Production Environment**: Optimized environment variables and build configuration
- **Enhanced Error Handling**: Better error boundaries and user feedback
- **Improved Typography**: Professional font stack with better readability

### 🎯 **User Experience**

- **Enhanced Preview Modal**: Beautiful AI suggestion preview with side-by-side comparison
- **Better Error Messages**: Clear, actionable error states with recovery options
- **Loading Indicators**: Contextual loading states throughout the application
- **Improved Navigation**: Better header design and mobile-friendly navigation

## 🎮 Demo & Features

- **Real-time Collaboration**: Edit together with instant synchronization
- **AI-Powered Editing**: Smart suggestions and content generation
- **Web Search Agent**: Integrated Tavily search for research assistance
- **Beautiful UI**: Modern glass-morphism design with smooth animations
- **Mobile Responsive**: Works perfectly on all devices

## 🚀 Deploy on Vercel

1. **Push to GitHub**: Upload this repository to GitHub, GitLab, or Bitbucket
2. **Create Vercel Project**: Go to Vercel and create a new project, import your repo
3. **Configure Environment Variables** (Project Settings → Environment Variables):
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   NEXT_PUBLIC_SITE_NAME=Pratham Collab AI Editor
   TAVILY_API_KEY=your_tavily_api_key_here (optional)
   NEXT_PUBLIC_COLLAB_WS_URL=wss://demos.yjs.dev
   ```
4. **Deploy**: Click deploy and wait for the build to complete
5. **Test**: Visit your deployed URL and test the features

## 💻 Local Development

```bash
# Install dependencies
npm install

# Copy environment template and add your API keys
cp .env.local.example .env.local

# Start development server
npm run dev
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4 with custom design system
- **Editor**: TipTap with Yjs for real-time collaboration
- **AI Integration**: OpenAI/OpenRouter for intelligent suggestions
- **Search**: Tavily API for web search agent
- **Deployment**: Optimized for Vercel with production builds

## 📁 Project Structure

```
pratham-collab-ai/
├── src/app/                 # Next.js app directory
│   ├── api/                 # API routes for AI and chat
│   ├── globals.css          # Global styles and animations
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Main application page
├── components/              # React components
├── lib/                     # Utility functions and AI logic
├── public/                  # Static assets
└── .env.production          # Production environment variables
```

## 🎨 Design Features

- **Glass-morphism UI**: Modern translucent design with backdrop blur
- **Gradient Accents**: Beautiful color gradients throughout the interface
- **Smooth Animations**: CSS animations and transitions for better UX
- **Professional Typography**: Inter font with optimized readability
- **Responsive Layout**: Mobile-first design that works on all devices
- **Accessibility**: WCAG compliant with proper contrast and focus states

## 🔧 Configuration

### Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key for AI features
- `OPENROUTER_API_KEY`: Alternative AI provider (optional)
- `TAVILY_API_KEY`: For web search agent functionality
- `NEXT_PUBLIC_SITE_URL`: Your deployed site URL
- `NEXT_PUBLIC_COLLAB_WS_URL`: WebSocket server for collaboration

### Build Configuration

- Optimized for Vercel deployment
- Production-ready Next.js configuration
- Image optimization and security headers
- Bundle splitting for better performance

## 📱 Mobile Support

- **Responsive Grid**: Adapts to different screen sizes
- **Touch Optimized**: Better touch targets and gestures
- **Performance**: Reduced animations on mobile devices
- **Accessibility**: Screen reader support and keyboard navigation

## 🐛 Troubleshooting

- **Build Errors**: Check environment variables are set correctly
- **Styling Issues**: Clear `.next` folder and restart dev server
- **API Errors**: Verify API keys are valid and have sufficient credits
- **Collaboration Issues**: Check WebSocket connection and room IDs

## 📄 License

Built by Pratham Singh (B.Tech, LPU '25)

---

**Made with ❤️ for creative collaboration**
