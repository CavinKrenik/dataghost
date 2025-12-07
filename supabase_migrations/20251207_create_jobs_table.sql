create table if not exists public.jobs (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  status text default 'pending',
  user_email text not null,
  worker_data jsonb,
  worker_response jsonb
);

-- Enable RLS
alter table public.jobs enable row level security;

-- Create policies (Service Role only by default)
create policy "Service role can manage all jobs"
  on public.jobs
  using ( true )
  with check ( true );
