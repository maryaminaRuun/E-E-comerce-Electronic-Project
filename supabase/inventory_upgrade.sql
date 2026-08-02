alter table public.products add column if not exists stock integer not null default 0 check (stock >= 0);

create or replace function public.create_order(customer_name text, customer_email text, customer_phone text, shipping_address text, cart_items jsonb)
returns uuid language plpgsql security definer set search_path=public as $$
declare new_order_id uuid; computed_total numeric := 0; item jsonb; requested integer; product_record public.products%rowtype;
begin
  if jsonb_array_length(cart_items)=0 then raise exception 'Cart is empty'; end if;
  for item in select * from jsonb_array_elements(cart_items) loop
    requested := (item->>'quantity')::integer;
    select * into product_record from public.products where id=(item->>'product_id')::uuid and active=true for update;
    if not found then raise exception 'Product is unavailable: %', item->>'name'; end if;
    if product_record.stock < requested then raise exception 'Only % units available for %', product_record.stock, product_record.name; end if;
    computed_total := computed_total + product_record.price * requested;
  end loop;
  insert into public.orders(user_id,customer_name,email,phone,address,total) values(auth.uid(),customer_name,customer_email,customer_phone,shipping_address,computed_total) returning id into new_order_id;
  for item in select * from jsonb_array_elements(cart_items) loop
    requested := (item->>'quantity')::integer;
    update public.products set stock=stock-requested,updated_at=now() where id=(item->>'product_id')::uuid;
    insert into public.order_items(order_id,product_id,product_name,price,quantity) select new_order_id,item->>'product_id',p.name,p.price,requested from public.products p where p.id=(item->>'product_id')::uuid;
  end loop;
  return new_order_id;
end $$;
grant execute on function public.create_order(text,text,text,text,jsonb) to anon,authenticated;
notify pgrst, 'reload schema';
