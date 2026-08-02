-- Run once in Supabase SQL Editor.
create extension if not exists pgcrypto;
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'customer' check (role in ('customer','admin')),
  created_at timestamptz not null default now()
);
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(), name text not null,
  description text not null default '', category text not null,
  price numeric(12,2) not null check(price>=0), image_url text,
  badge text, reviews integer not null default 0, active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id),
  customer_name text not null, email text not null, phone text, address text not null,
  total numeric(12,2) not null check(total>=0), status text not null default 'pending'
    check(status in ('pending','confirmed','shipped','delivered','cancelled')),
  created_at timestamptz not null default now()
);
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id), product_name text not null,
  price numeric(12,2) not null, quantity integer not null check(quantity>0)
);

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.profiles where id=auth.uid() and role='admin');
$$;
drop policy if exists "public read active products" on public.products;
create policy "public read active products" on public.products for select using(active or public.is_admin());
drop policy if exists "admins manage products" on public.products;
create policy "admins manage products" on public.products for all to authenticated using(public.is_admin()) with check(public.is_admin());
drop policy if exists "users read own profile" on public.profiles;
create policy "users read own profile" on public.profiles for select to authenticated using(id=auth.uid() or public.is_admin());
drop policy if exists "admins read orders" on public.orders;
create policy "admins read orders" on public.orders for select to authenticated using(public.is_admin());
drop policy if exists "customers create orders" on public.orders;
create policy "customers create orders" on public.orders for insert to anon,authenticated with check(user_id is null or user_id=auth.uid());
drop policy if exists "admins manage orders" on public.orders;
create policy "admins manage orders" on public.orders for update to authenticated using(public.is_admin()) with check(public.is_admin());
drop policy if exists "admins read order items" on public.order_items;
create policy "admins read order items" on public.order_items for select to authenticated using(public.is_admin());
drop policy if exists "customers create order items" on public.order_items;
create policy "customers create order items" on public.order_items for insert to anon,authenticated with check(exists(select 1 from public.orders o where o.id=order_id and (o.user_id=auth.uid() or o.user_id is null)));

create or replace function public.create_order(customer_name text, customer_email text, customer_phone text, shipping_address text, cart_items jsonb)
returns uuid language plpgsql security definer set search_path=public as $$
declare new_order_id uuid; computed_total numeric;
begin
  select coalesce(sum((item->>'price')::numeric*(item->>'quantity')::integer),0) into computed_total from jsonb_array_elements(cart_items) item;
  if computed_total <= 0 then raise exception 'Cart is empty'; end if;
  insert into orders(user_id,customer_name,email,phone,address,total) values(auth.uid(),customer_name,customer_email,customer_phone,shipping_address,computed_total) returning id into new_order_id;
  insert into order_items(order_id,product_id,product_name,price,quantity)
  select new_order_id,(item->>'product_id')::uuid,item->>'name',(item->>'price')::numeric,(item->>'quantity')::integer from jsonb_array_elements(cart_items) item;
  return new_order_id;
end $$;
grant execute on function public.create_order(text,text,text,text,jsonb) to anon,authenticated;

-- After creating your first user in Authentication > Users, replace the UUID below and run:
-- insert into public.profiles(id,full_name,role) values ('USER_UUID','Store Administrator','admin');
