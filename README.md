# VibeBlogger 🚀

**Capture your thoughts instantly and transform them into polished blogs with AI assistance.**

VibeBlogger is a modern microblogging platform that helps you capture fleeting thoughts and ideas, then intelligently transform them into structured, engaging blog posts using AI. Perfect for content creators, writers, and anyone who wants to turn their stream of consciousness into compelling content.

## ✨ Features

- **🎯 Quick Thought Capture**: Create micro-posts instantly, just like tweets
- **🤖 AI-Powered Blog Generation**: Transform your thoughts into polished blog posts
- **📝 Rich Text Editor**: Full-featured editor with markdown support
- **🎨 Beautiful UI**: Modern, responsive design with smooth animations
- **🔐 Secure Authentication**: Google OAuth integration
- **📊 Session Management**: Organize your thoughts by topics or themes
- **⚡ Real-time Updates**: Live collaboration and instant sync
- **📱 Mobile Responsive**: Works perfectly on all devices

## 🚀 Live Demo

[**Try VibeBlogger Now**](https://vibeblogger.com) - Experience the future of content creation!

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: tRPC, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **AI Integration**: OpenAI, Anthropic, Google AI
- **Deployment**: Vercel
- **Analytics**: Vercel Analytics, Google Analytics

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- OpenAI API key (or Anthropic/Google AI)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/vibe-blogger.git
   cd vibe-blogger
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/vibeblogger"
   
   # Authentication
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   
   # OAuth
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # AI Services
   OPENAI_API_KEY="your-openai-key"
   ANTHROPIC_API_KEY="your-anthropic-key"
   GOOGLE_AI_API_KEY="your-google-ai-key"
   
   # Analytics
   NEXT_PUBLIC_GA_ID="your-google-analytics-id"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 How It Works

1. **Create a Session**: Start a new session for any topic or theme
2. **Microblog Your Thoughts**: Add short posts as ideas come to you
3. **AI Magic**: Let AI transform your collection into a coherent blog post
4. **Edit & Publish**: Fine-tune the generated content and publish

## 🎯 Use Cases

- **Content Creators**: Turn daily thoughts into blog posts
- **Writers**: Capture inspiration and develop it into full articles
- **Students**: Organize research notes into structured essays
- **Professionals**: Convert meeting notes into comprehensive reports
- **Journalists**: Develop story ideas from quick observations

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

- **Netlify**: Use the Next.js build command
- **Railway**: Connect your GitHub repo
- **DigitalOcean**: Use App Platform

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with the amazing [T3 Stack](https://create.t3.gg/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons from [Lucide](https://lucide.dev/)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)

## 📞 Support

- 📧 Email: support@vibeblogger.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/vibe-blogger/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/vibe-blogger/discussions)

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/vibe-blogger&type=Date)](https://star-history.com/#yourusername/vibe-blogger&Date)

---

**Made with ❤️ for the content creation community**

*Ready to transform your thoughts into stories? [Get started now!](https://vibeblogger.com)*