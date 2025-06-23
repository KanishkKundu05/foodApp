#!/bin/bash

echo "🚀 Setting up Supabase for FoodApp"
echo "=================================="

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder-key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Supabase Service Role Key (for server-side operations)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
EOF
    echo "✅ Created .env.local file with placeholder values"
    echo "⚠️  Please update .env.local with your actual Supabase credentials"
else
    echo "✅ .env.local file already exists"
fi

# Check if supabase-schema.sql exists
if [ -f "supabase-schema.sql" ]; then
    echo "✅ Database schema file found"
else
    echo "❌ supabase-schema.sql not found"
    exit 1
fi

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "📦 Installing Supabase CLI..."
    npm install -g supabase
    echo "✅ Supabase CLI installed"
else
    echo "✅ Supabase CLI already installed"
fi

# Check if @supabase/supabase-js is installed
if ! npm list @supabase/supabase-js &> /dev/null; then
    echo "📦 Installing Supabase JavaScript client..."
    npm install @supabase/supabase-js
    echo "✅ Supabase JavaScript client installed"
else
    echo "✅ Supabase JavaScript client already installed"
fi

echo ""
echo "📋 Next steps:"
echo "1. Go to https://supabase.com and create a new project"
echo "2. Copy your project URL and anon key from Settings > API"
echo "3. Update .env.local with your actual credentials"
echo "4. Run the SQL schema in your Supabase SQL Editor"
echo "5. Start the development server with: npm run dev"
echo ""
echo "🔗 For detailed instructions, see SUPABASE_SETUP.md" 