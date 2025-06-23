-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types if they don't exist
DO $$ BEGIN
    CREATE TYPE food_mode AS ENUM ('cook', 'meal-prep', 'order');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE time_preset AS ENUM ('5', '15', '30');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.meal_logs CASCADE;
DROP TABLE IF EXISTS public.recipe_steps CASCADE;
DROP TABLE IF EXISTS public.recipe_ingredients CASCADE;
DROP TABLE IF EXISTS public.recipes CASCADE;
DROP TABLE IF EXISTS public.daily_intake CASCADE;
DROP TABLE IF EXISTS public.nutrition_goals CASCADE;
DROP TABLE IF EXISTS public.chat_messages CASCADE;
DROP TABLE IF EXISTS public.user_preferences CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User nutrition goals
CREATE TABLE public.nutrition_goals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    protein_target INTEGER NOT NULL DEFAULT 150,
    carbs_target INTEGER NOT NULL DEFAULT 200,
    fats_target INTEGER NOT NULL DEFAULT 60,
    calories_target INTEGER GENERATED ALWAYS AS (protein_target * 4 + carbs_target * 4 + fats_target * 9) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Daily nutrition intake tracking
CREATE TABLE public.daily_intake (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    protein_consumed INTEGER NOT NULL DEFAULT 0,
    carbs_consumed INTEGER NOT NULL DEFAULT 0,
    fats_consumed INTEGER NOT NULL DEFAULT 0,
    calories_consumed INTEGER GENERATED ALWAYS AS (protein_consumed * 4 + carbs_consumed * 4 + fats_consumed * 9) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Recipes table
CREATE TABLE public.recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id),
    title TEXT NOT NULL,
    description TEXT,
    instructions TEXT[],
    ingredients JSONB,
    notes JSONB, -- For storing chef's notes, emoji, etc.
    prep_time INT,
    cook_time INT,
    servings INT,
    image_url TEXT,
    is_ai_generated BOOLEAN DEFAULT false,
    generation_chat_log JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Recipe ingredients (normalized for better querying)
CREATE TABLE public.recipe_ingredients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    quantity TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recipe steps (normalized for better querying)
CREATE TABLE public.recipe_steps (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE NOT NULL,
    step_number INTEGER NOT NULL,
    instruction TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meal logs (when users consume recipes)
CREATE TABLE public.meal_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE,
    meal_name TEXT NOT NULL,
    servings DECIMAL(3,2) DEFAULT 1.0,
    protein_consumed INTEGER NOT NULL,
    carbs_consumed INTEGER NOT NULL,
    fats_consumed INTEGER NOT NULL,
    calories_consumed INTEGER GENERATED ALWAYS AS (protein_consumed * 4 + carbs_consumed * 4 + fats_consumed * 9) STORED,
    consumed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat messages for SousAI conversations
CREATE TABLE public.chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    session_id UUID DEFAULT uuid_generate_v4() NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    recipe_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences and settings
CREATE TABLE public.user_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    default_food_mode food_mode DEFAULT 'cook',
    default_time_preset time_preset DEFAULT '15',
    theme TEXT DEFAULT 'system',
    notifications_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_recipes_user_id ON public.recipes(user_id);
CREATE INDEX idx_recipes_created_at ON public.recipes(created_at DESC);
CREATE INDEX idx_daily_intake_user_date ON public.daily_intake(user_id, date);
CREATE INDEX idx_meal_logs_user_consumed ON public.meal_logs(user_id, consumed_at DESC);
CREATE INDEX idx_chat_messages_user_session ON public.chat_messages(user_id, session_id);
CREATE INDEX idx_recipe_ingredients_recipe_id ON public.recipe_ingredients(recipe_id);
CREATE INDEX idx_recipe_steps_recipe_id ON public.recipe_steps(recipe_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_nutrition_goals_updated_at BEFORE UPDATE ON public.nutrition_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_daily_intake_updated_at BEFORE UPDATE ON public.daily_intake FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON public.recipes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_intake ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own nutrition goals" ON public.nutrition_goals FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own daily intake" ON public.daily_intake FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own recipes" ON public.recipes FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can insert own recipes" ON public.recipes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own recipes" ON public.recipes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own recipes" ON public.recipes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own recipe ingredients" ON public.recipe_ingredients FOR ALL USING (
    EXISTS (SELECT 1 FROM public.recipes WHERE id = recipe_id AND (user_id = auth.uid() OR user_id IS NULL))
);

CREATE POLICY "Users can view own recipe steps" ON public.recipe_steps FOR ALL USING (
    EXISTS (SELECT 1 FROM public.recipes WHERE id = recipe_id AND (user_id = auth.uid() OR user_id IS NULL))
);

CREATE POLICY "Users can view own meal logs" ON public.meal_logs FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own chat messages" ON public.chat_messages FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own preferences" ON public.user_preferences FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for recipes
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public recipes are viewable by everyone" ON public.recipes
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can insert their own recipes" ON public.recipes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recipes" ON public.recipes
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recipes" ON public.recipes
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Functions for common operations
CREATE OR REPLACE FUNCTION get_user_daily_intake(user_uuid UUID, target_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE (
    protein_consumed INTEGER,
    carbs_consumed INTEGER,
    fats_consumed INTEGER,
    calories_consumed INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(di.protein_consumed, 0) as protein_consumed,
        COALESCE(di.carbs_consumed, 0) as carbs_consumed,
        COALESCE(di.fats_consumed, 0) as fats_consumed,
        COALESCE(di.calories_consumed, 0) as calories_consumed
    FROM public.daily_intake di
    WHERE di.user_id = user_uuid AND di.date = target_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_user_nutrition_goals(user_uuid UUID)
RETURNS TABLE (
    protein_target INTEGER,
    carbs_target INTEGER,
    fats_target INTEGER,
    calories_target INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(ng.protein_target, 150) as protein_target,
        COALESCE(ng.carbs_target, 200) as carbs_target,
        COALESCE(ng.fats_target, 60) as fats_target,
        COALESCE(ng.calories_target, 150 * 4 + 200 * 4 + 60 * 9) as calories_target
    FROM public.nutrition_goals ng
    WHERE ng.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add meal to daily intake
CREATE OR REPLACE FUNCTION add_meal_to_daily_intake(
    user_uuid UUID,
    meal_protein INTEGER,
    meal_carbs INTEGER,
    meal_fats INTEGER,
    meal_date DATE DEFAULT CURRENT_DATE
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.daily_intake (user_id, date, protein_consumed, carbs_consumed, fats_consumed)
    VALUES (user_uuid, meal_date, meal_protein, meal_carbs, meal_fats)
    ON CONFLICT (user_id, date)
    DO UPDATE SET
        protein_consumed = daily_intake.protein_consumed + EXCLUDED.protein_consumed,
        carbs_consumed = daily_intake.carbs_consumed + EXCLUDED.carbs_consumed,
        fats_consumed = daily_intake.fats_consumed + EXCLUDED.fats_consumed,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 