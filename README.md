# Memento

Aplikasi web gallery modern untuk menyimpan dan menampilkan momen-momen Anda (memento).  
Dibangun dengan **React (Vite)**, **Tailwind CSS**, dan **Supabase**.

## Fitur

- **Auth** (Login / Signup) via Supabase Auth
- **Upload gambar** (hanya user yang sudah login) ke Supabase Storage
- Search bar & filter di navbar
- Lightbox untuk melihat detail gambar

## Setup

### 1. Install dependencies

```bash
cd memento
npm install
```

### 2. Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com)
2. Di **Project Settings → API**, salin:
   - Project URL → `VITE_SUPABASE_URL`
   - `anon` `public` key → `VITE_SUPABASE_ANON_KEY`
3. Buat file `.env` di root project:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Database Schema (SQL Editor di Supabase)

Jalankan SQL berikut:

```sql
-- Table images
CREATE TABLE public.images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  storage_path TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access"
  ON public.images FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert"
  ON public.images FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners can delete"
  ON public.images FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX images_title_idx ON public.images USING gin (to_tsvector('english', title));
CREATE INDEX images_created_at_idx ON public.images (created_at DESC);
```

### 4. Storage Bucket

1. Buka **Storage** di Supabase Dashboard
2. Buat bucket baru bernama **`memento-images`**
3. Set **Public bucket** = ON (agar gambar bisa diakses via public URL)
4. Tambahkan policy:

```sql

CREATE POLICY "Public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'memento-images');

CREATE POLICY "Authenticated upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'memento-images'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Owners can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'memento-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### 5. Auth Settings (opsional)

Di **Authentication → Providers → Email**:
- Bisa matikan "Confirm email" untuk development agar langsung bisa login setelah signup.

### 6. Jalankan aplikasi

```bash
npm run dev
```

Buka http://localhost:5173