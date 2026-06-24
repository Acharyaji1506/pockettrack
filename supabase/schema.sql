-- PocketTrack database schema
-- Run this once in your Supabase project: Dashboard -> SQL Editor -> New query -> paste -> Run

create extension if not exists "uuid-ossp";

create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  username text unique not null,
  password_hash text not null,
  daily_budget numeric default 0,
  reminder_time text default '20:00',
  created_at timestamptz default now()
);

create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  name text not null,
  is_default boolean default false,
  created_at timestamptz default now()
);

create table if not exists expenses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  category_id uuid references categories(id) on delete set null,
  amount numeric not null check (amount > 0),
  note text,
  spent_on date not null default current_date,
  created_at timestamptz default now()
);

create index if not exists idx_expenses_user_date on expenses(user_id, spent_on);
create index if not exists idx_categories_user on categories(user_id);

-- Default categories every new account gets (inserted from app code on signup)
-- Food, Travel, Rent, Recharge, Subscriptions, Shopping, Stationery, Entertainment, Other
