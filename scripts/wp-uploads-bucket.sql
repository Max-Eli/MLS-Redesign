-- Creates a public Supabase Storage bucket for migrated WordPress uploads.
-- Run this once in Supabase SQL Editor before running scripts/upload-wp-uploads.mjs

insert into storage.buckets (id, name, public)
values ('wp-uploads', 'wp-uploads', true)
on conflict (id) do nothing;

drop policy if exists "Public read wp-uploads" on storage.objects;
create policy "Public read wp-uploads"
  on storage.objects for select
  using (bucket_id = 'wp-uploads');
