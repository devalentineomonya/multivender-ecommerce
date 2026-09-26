-- Create the table
create table if not exists instruments (
  id bigint primary key generated always as identity,
  name text not null
);

-- Insert sample data into the table
insert into instruments (name)
values
  ('violin'),
  ('viola'),
  ('cello')
on conflict do nothing;

-- Grant the privileges the anon role needs for read access
grant select on public.instruments to anon;

-- Enable row level security for the table
alter table instruments enable row level security;

-- Create a policy to allow the anon role to read from the instruments table
drop policy if exists "public can read instruments" on public.instruments;
create policy "public can read instruments"
on public.instruments
for select to anon
using (true);
