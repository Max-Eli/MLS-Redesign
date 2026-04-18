-- Blog posts migrated from the old WordPress install.
-- Run this once in Supabase SQL Editor before running scripts/import-blog-posts.mjs

create table if not exists blog_posts (
  id              bigserial primary key,
  wp_id           bigint unique,
  slug            text unique not null,
  title           text not null,
  content         text not null,
  excerpt         text,
  featured_image  text,
  category        text,
  tags            text[] default '{}',
  reading_minutes integer,
  published_at    timestamptz not null,
  modified_at     timestamptz,
  active          boolean not null default true,
  created_at      timestamptz not null default now()
);

create index if not exists blog_posts_published_idx
  on blog_posts (published_at desc)
  where active = true;

create index if not exists blog_posts_slug_idx on blog_posts (slug);

-- Public read policy (enable RLS if you use it)
alter table blog_posts enable row level security;

drop policy if exists "Public read published posts" on blog_posts;
create policy "Public read published posts"
  on blog_posts for select
  using (active = true);
