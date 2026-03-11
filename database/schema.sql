-- OUStudyJapan Database Schema
-- Run with: psql -U postgres -d oustudyjapan -f schema.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  university VARCHAR(100) DEFAULT 'University of Oklahoma',
  avatar_url TEXT,
  points INTEGER DEFAULT 0,
  daily_budget_jpy INTEGER DEFAULT 3000,
  home_currency VARCHAR(3) DEFAULT 'USD',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Restaurants
CREATE TABLE IF NOT EXISTS restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  name_jp VARCHAR(200),
  category VARCHAR(100),
  price_jpy INTEGER,
  price_range VARCHAR(10),
  rating DECIMAL(3,1),
  review_count INTEGER DEFAULT 0,
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  address TEXT,
  address_jp TEXT,
  image_url TEXT,
  description TEXT,
  is_student_friendly BOOLEAN DEFAULT true,
  accepts_suica BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Quests / Tasks
CREATE TABLE IF NOT EXISTS quests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  title_jp VARCHAR(200),
  description TEXT,
  category VARCHAR(100),
  points INTEGER DEFAULT 100,
  image_url TEXT,
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  difficulty VARCHAR(20) DEFAULT 'easy',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User Quest Progress
CREATE TABLE IF NOT EXISTS user_quests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  quest_id UUID REFERENCES quests(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  UNIQUE(user_id, quest_id)
);

-- Translations Cache
CREATE TABLE IF NOT EXISTS translations_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_text TEXT NOT NULL,
  source_lang VARCHAR(10) DEFAULT 'JA',
  target_lang VARCHAR(10) DEFAULT 'EN',
  translated_text TEXT NOT NULL,
  romanization TEXT,
  script_type VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(source_text, target_lang)
);

-- Expenses Tracker
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount_jpy INTEGER NOT NULL,
  amount_usd DECIMAL(10,2),
  category VARCHAR(100),
  description TEXT,
  restaurant_id UUID REFERENCES restaurants(id),
  expense_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed Sample Data
INSERT INTO restaurants (name, name_jp, category, price_jpy, price_range, rating, latitude, longitude, image_url, description, is_student_friendly, accepts_suica) VALUES
  ('Gyukatsu Motomura', '牛カツもと村', 'Beef Cutlet', 1600, '¥¥', 4.9, 35.6617, 139.7040, 'https://images.unsplash.com/photo-1607301406259-dfb186e15582?auto=format&fit=crop&q=80&w=800', 'Famous beef cutlet restaurant with a unique cooking concept', true, false),
  ('Ichiran Ramen', '一蘭', 'Ramen', 980, '¥', 4.8, 35.6598, 139.6985, 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=800', 'Solo dining booth ramen — perfect for ordering without Japanese', true, true),
  ('Yoshinoya', '吉野家', 'Gyudon', 500, '¥', 4.3, 35.6591, 139.7019, 'https://images.unsplash.com/photo-1569398034126-476e3a4af72f?auto=format&fit=crop&q=80&w=800', 'Budget-friendly beef bowl chain, open 24/7', true, true),
  ('Mos Burger', 'モスバーガー', 'Burger', 750, '¥', 4.2, 35.6622, 139.7055, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800', 'Japanese burger chain with rice burgers and seasonal items', true, false),
  ('Saizeriya', 'サイゼリヤ', 'Italian', 600, '¥', 4.1, 35.6589, 139.7003, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800', 'Incredibly cheap Italian food — pasta under ¥300', true, false)
ON CONFLICT DO NOTHING;

INSERT INTO quests (title, title_jp, description, category, points, image_url, latitude, longitude, difficulty) VALUES
  ('Senso-ji Temple', '浅草寺', 'Visit Tokyo''s oldest temple in Asakusa and try your fortune slip (omikuji)', 'Culture', 500, 'https://images.unsplash.com/photo-1542931287-023b922fa89b?auto=format&fit=crop&q=80&w=800', 35.7147, 139.7966, 'easy'),
  ('Shibuya Crossing', '渋谷スクランブル交差点', 'Cross the world''s busiest pedestrian crossing during peak hour', 'Urban', 200, 'https://images.unsplash.com/photo-1542051812-f4539618b14a?auto=format&fit=crop&q=80&w=800', 35.6595, 139.7004, 'easy'),
  ('Order in Japanese', '日本語で注文する', 'Order your meal entirely in Japanese at a restaurant', 'Language', 350, 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?auto=format&fit=crop&q=80&w=800', 35.6762, 139.6503, 'medium'),
  ('Mount Takao Hike', '高尾山ハイキング', 'Complete the Takao-san hiking trail and reach the summit', 'Adventure', 800, 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&q=80&w=800', 35.6257, 139.2431, 'hard'),
  ('Convenience Store Gourmet', 'コンビニグルメ', 'Try 5 different convenience store hot foods in one day', 'Food', 250, 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&q=80&w=800', 35.6762, 139.6503, 'easy')
ON CONFLICT DO NOTHING;

-- ============================================
-- v5 MIGRATIONS — Run these in Supabase SQL Editor
-- ============================================

-- Add missing columns to users
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS tutorial_completed BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS theme VARCHAR(20) DEFAULT 'dark',
  ADD COLUMN IF NOT EXISTS major VARCHAR(100) DEFAULT 'Business',
  ADD COLUMN IF NOT EXISTS year VARCHAR(20) DEFAULT 'Junior';

-- Add halal and deal columns to restaurants
ALTER TABLE restaurants
  ADD COLUMN IF NOT EXISTS is_halal BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS halal_cert TEXT,
  ADD COLUMN IF NOT EXISTS deal_active BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS deal_text TEXT,
  ADD COLUMN IF NOT EXISTS menu_url TEXT,
  ADD COLUMN IF NOT EXISTS phone VARCHAR(30),
  ADD COLUMN IF NOT EXISTS hours VARCHAR(100),
  ADD COLUMN IF NOT EXISTS walk_time_minutes INTEGER DEFAULT 10;

-- Add more quest fields
ALTER TABLE quests
  ADD COLUMN IF NOT EXISTS is_program BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_nearby BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_top50 BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS walk_time_minutes INTEGER,
  ADD COLUMN IF NOT EXISTS tip TEXT,
  ADD COLUMN IF NOT EXISTS city VARCHAR(100) DEFAULT 'Ibaraki';

-- Row Level Security (add in Supabase for production)
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users own row" ON users USING (auth.uid() = id);
-- ALTER TABLE user_quests ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users own quests" ON user_quests USING (auth.uid()::text = user_id::text);
