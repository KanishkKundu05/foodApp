# Supabase Setup Guide for FoodApp

This guide will walk you through setting up Supabase for your food application, including database schema, authentication, and real-time features.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and npm installed
- Your food app project ready

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `food-app` (or your preferred name)
   - **Database Password**: Create a strong password
   - **Region**: Choose the closest region to your users
5. Click "Create new project"
6. Wait for the project to be created (this may take a few minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)
   - **Service role key** (starts with `eyJ...`) - Keep this secret!

## Step 3: Set Up Environment Variables

1. Create a `.env.local` file in your project root (if it doesn't exist)
2. Add the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# OpenAI Configuration (for SousAI)
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Supabase Service Role Key (for server-side operations)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

3. Replace the placeholder values with your actual Supabase credentials

## Step 4: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire contents of `supabase-schema.sql` from your project
3. Paste it into the SQL editor
4. Click "Run" to execute the schema

This will create:
- User profiles table
- Nutrition goals table
- Daily intake tracking table
- Recipes table
- Meal logs table
- Chat messages table
- User preferences table
- Row Level Security (RLS) policies
- Database functions for common operations

## Step 5: Configure Authentication

1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Configure the following settings:

### Email Templates
- Customize the email templates for sign-up confirmation and password reset
- Update the site URL to match your domain

### Auth Providers
- **Email**: Enabled by default
- **Google**: Optional - enable if you want Google sign-in
- **GitHub**: Optional - enable if you want GitHub sign-in

### Site URL
- Set your site URL (e.g., `http://localhost:3000` for development)
- Add any additional redirect URLs you need

## Step 6: Test the Setup

1. Start your development server:
```bash
npm run dev
```

2. Navigate to `http://localhost:3000/profile`
3. Try creating an account and signing in
4. Test the SousAI chat functionality
5. Verify that recipes are being saved to Supabase

## Step 7: Enable Row Level Security (RLS)

The schema already includes RLS policies, but you can verify they're working:

1. In your Supabase dashboard, go to **Authentication** → **Policies**
2. Verify that all tables have RLS enabled
3. Check that the policies are correctly configured

## Step 8: Set Up Real-time Features (Optional)

If you want real-time updates for chat messages or recipe changes:

1. In your Supabase dashboard, go to **Database** → **Replication**
2. Enable real-time for the tables you want to sync:
   - `chat_messages`
   - `recipes`
   - `daily_intake`

## Step 9: Production Deployment

When deploying to production:

1. Update your environment variables with production values
2. Set up a custom domain in Supabase (optional)
3. Configure production redirect URLs
4. Set up monitoring and logging

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**
   - Verify your environment variables are correct
   - Make sure you're using the anon key, not the service role key for client-side operations

2. **"Row Level Security policy violation"**
   - Check that the user is authenticated
   - Verify RLS policies are correctly configured
   - Ensure the user ID matches the policy conditions

3. **"Table doesn't exist" error**
   - Make sure you've run the schema SQL
   - Check that the table names match exactly

4. **Authentication not working**
   - Verify your site URL is correct in Supabase settings
   - Check that email confirmation is configured properly
   - Ensure redirect URLs are set correctly

### Debug Tips

1. **Check Supabase logs**:
   - Go to **Logs** in your Supabase dashboard
   - Look for errors in the API logs

2. **Test with Supabase CLI**:
   ```bash
   npm install -g supabase
   supabase login
   supabase link --project-ref your-project-ref
   supabase db push
   ```

3. **Use the Supabase dashboard**:
   - Check **Table Editor** to see if data is being inserted
   - Use **SQL Editor** to run test queries

## Security Best Practices

1. **Never expose your service role key** in client-side code
2. **Use RLS policies** to secure your data
3. **Validate user input** before inserting into the database
4. **Use prepared statements** to prevent SQL injection
5. **Regularly rotate your API keys**

## Performance Optimization

1. **Add indexes** for frequently queried columns
2. **Use pagination** for large datasets
3. **Optimize queries** to minimize data transfer
4. **Enable caching** where appropriate

## Next Steps

After setting up Supabase:

1. **Customize the UI** to match your brand
2. **Add more features** like meal planning, shopping lists, etc.
3. **Implement analytics** to track user engagement
4. **Set up monitoring** and error tracking
5. **Add tests** to ensure data integrity

## Support

If you encounter issues:

1. Check the [Supabase documentation](https://supabase.com/docs)
2. Visit the [Supabase community](https://github.com/supabase/supabase/discussions)
3. Review the [Next.js documentation](https://nextjs.org/docs)

## File Structure

After setup, your project should have these new files:

```
foodApp/
├── lib/
│   └── supabase.ts          # Supabase client configuration
├── hooks/
│   └── use-supabase.ts      # Custom hooks for Supabase operations
├── components/
│   ├── auth-form.tsx        # Authentication form
│   └── user-profile.tsx     # User profile management
├── app/
│   └── profile/
│       └── page.tsx         # Profile page
├── stores/
│   └── recipe-store.ts      # Updated with Supabase integration
├── supabase-schema.sql      # Database schema
├── env.example              # Environment variables template
└── SUPABASE_SETUP.md        # This guide
```

Your food app is now fully integrated with Supabase! 🎉 