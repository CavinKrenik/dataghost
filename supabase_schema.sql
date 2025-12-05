-- Create profiles table
create table public.profiles (
  id uuid not null references auth.users(id) on delete cascade,
  plan text not null default 'none',
  status text not null default 'inactive',
  billing_provider text,
  billing_customer_id text,
  billing_subscription_id text,
  trial_ends_at timestamptz,
  last_login_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary key (id)
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create policies
create policy "Users can view own profile"
  on public.profiles for select
  using ( auth.uid() = id );

create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- Create trigger for new users
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();
