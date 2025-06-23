# SousAI - Your AI Cooking Assistant

A Next.js application that helps you create, manage, and cook recipes with AI assistance.

## Features

- 🤖 AI-powered recipe creation
- 👩‍🍳 Interactive cooking assistance
- 📝 Recipe management and storage
- 🔒 User authentication with Supabase
- 💬 Real-time chat with cooking tips
- 📱 Responsive design for all devices

## Tech Stack

- Next.js 15.2.4
- React 18
- TypeScript
- Tailwind CSS
- Supabase
- OpenAI GPT-4
- Radix UI Components

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm/pnpm
- Supabase account
- OpenAI API key

### Environment Setup

1. Clone the repository:
```bash
git clone [your-repo-url]
cd food-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with the following variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

4. Initialize Supabase:
```bash
./setup-supabase.sh
```

5. Start the development server:
```bash
npm run dev
```

## Project Structure

- `/app` - Next.js app router pages and API routes
- `/components` - Reusable React components
- `/hooks` - Custom React hooks
- `/lib` - Utility functions and configurations
- `/stores` - State management (Zustand)
- `/styles` - Global styles and Tailwind configuration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
