# 🚀 Quick Start Guide - FoodApp with Supabase

## ⚡ **Immediate Steps to Get Running**

### 1. **Create Supabase Project** (5 minutes)
1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `food-app`
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to you
5. Click "Create new project"
6. Wait for setup to complete

### 2. **Get Your Credentials** (2 minutes)
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

### 3. **Set Up Environment Variables** (1 minute)
1. Create `.env.local` file in your project root:
```bash
cp env.example .env.local
```

2. Edit `.env.local` and replace the placeholder values:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. **Set Up Database Schema** (2 minutes)
1. In Supabase dashboard, go to **SQL Editor**
2. Copy the entire contents of `supabase-schema.sql`
3. Paste into the SQL editor
4. Click "Run"

### 5. **Test Your App** (1 minute)
```bash
npm run dev
```
Visit `http://localhost:3000` - your app should now work!

## 🎯 **What You Can Do Now**

### **Without Supabase (Fallback Mode)**
- ✅ View the app interface
- ✅ Use local recipe storage
- ✅ See the UI components
- ✅ Navigate between pages

### **With Supabase (Full Features)**
- ✅ User authentication (sign up/sign in)
- ✅ Persistent recipe storage
- ✅ Nutrition tracking
- ✅ AI chat with SousAI
- ✅ User profiles and preferences
- ✅ Cross-device sync

## 🔧 **Troubleshooting**

### **App won't start?**
- Check that `.env.local` exists and has valid values
- Make sure you copied the correct Supabase URL and key

### **"Supabase not configured" errors?**
- Verify your environment variables are set correctly
- Restart your development server after adding `.env.local`

### **Database errors?**
- Make sure you ran the SQL schema in Supabase
- Check that your Supabase project is active

### **Authentication not working?**
- Go to Supabase → Authentication → Settings
- Set Site URL to `http://localhost:3000`
- Add `http://localhost:3000/profile` to redirect URLs

## 📱 **Test the Features**

1. **Visit Profile Page**: `http://localhost:3000/profile`
2. **Create Account**: Sign up with email/password
3. **Set Nutrition Goals**: Configure your macro targets
4. **Try SousAI**: Go to `/mealprep` and chat with the AI
5. **Save Recipes**: Generated recipes will be saved to your account
6. **Track Nutrition**: Add meals and see your daily progress

## 🎉 **You're Done!**

Your food app now has:
- ✅ **User Authentication**
- ✅ **Recipe Management**
- ✅ **Nutrition Tracking**
- ✅ **AI-Powered Chat**
- ✅ **Persistent Data Storage**
- ✅ **Cross-Device Sync**

## 📚 **Next Steps**

- Customize the UI to match your brand
- Add more features like meal planning
- Deploy to production
- Set up monitoring and analytics

## 🆘 **Need Help?**

- Check the full setup guide: `SUPABASE_SETUP.md`
- Review Supabase docs: [supabase.com/docs](https://supabase.com/docs)
- Check the console for error messages

---

**Happy coding! 🍕** 