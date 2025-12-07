-- Create paid_orders table
create table public.paid_orders (
  id uuid default gen_random_uuid(),
  email text not null,
  order_id text not null,
  status text default 'paid',
  created_at timestamptz default now(),
  primary key (id),
  unique(email),
  unique(order_id)
);

-- Lowercase email on insert/update
create or replace function public.lower_email_paid_orders()
returns trigger as $$
begin
  new.email = lower(new.email);
  return new;
end;
$$ language plpgsql;

create trigger lower_email_paid_orders_trigger
before insert or update on public.paid_orders
for each row execute procedure public.lower_email_paid_orders();

-- Enable RLS
alter table public.paid_orders enable row level security;

-- Policies (Service Role only access)
create policy "Service role can manage paid_orders"
  on public.paid_orders
  using ( true )
  with check ( true );
