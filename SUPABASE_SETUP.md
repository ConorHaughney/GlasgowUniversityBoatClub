# Supabase Setup Guide

This guide will help you set up Supabase for the GUBC website.

## Step 1: Create Supabase Project

1. Go to https://supabase.com and create an account
2. Create a new project
3. Save your project credentials:
   - Project URL
   - Anon Key
   - Service Role Key
   - Database password

## Step 2: Create Database Tables

Use the Supabase SQL editor to run the following SQL commands to create your database schema:

### 1. Club Information Table
```sql
CREATE TABLE club_info (
  id BIGINT PRIMARY KEY DEFAULT 1,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  contact_email TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Committee Members Table
```sql
CREATE TABLE committee_members (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  bio TEXT,
  photo_url TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Merchandise Table
```sql
CREATE TABLE merchandise (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Orders Table
```sql
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  merchandise_id BIGINT NOT NULL REFERENCES merchandise(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  quantity INT NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  order_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 5. Events Table
```sql
CREATE TABLE events (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 6. Race Results Table
```sql
CREATE TABLE race_results (
  id BIGSERIAL PRIMARY KEY,
  event_id BIGINT REFERENCES events(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  featured_image_url TEXT,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 7. Photos Table
```sql
CREATE TABLE photos (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  storage_path TEXT NOT NULL,
  category TEXT,
  date_taken TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 8. Blogs Table
```sql
CREATE TABLE blogs (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  author TEXT,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 9. Donations Table
```sql
CREATE TABLE donations (
  id BIGSERIAL PRIMARY KEY,
  donor_name TEXT NOT NULL,
  donor_email TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 10. Email Subscribers Table
```sql
CREATE TABLE email_subscribers (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at TIMESTAMP WITH TIME ZONE
);
```

## Step 3: Create Storage Bucket

1. In Supabase dashboard, go to Storage
2. Create a new bucket named `photos`
3. Set it to "Public" access
4. Click on the bucket settings and update the CORS policy to allow your domain

## Step 4: Configure Row Level Security (RLS)

Enable RLS on all tables to protect sensitive data.

### For Public Read Tables (committee_members, events, race_results, blogs, photos):
```sql
-- Enable RLS
ALTER TABLE committee_members ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Public can read" ON committee_members FOR SELECT USING (TRUE);

-- Only admin can insert/update/delete
CREATE POLICY "Admin can insert" ON committee_members FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admin can update" ON committee_members FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin can delete" ON committee_members FOR DELETE USING (auth.uid() IS NOT NULL);
```

Repeat similar policies for: events, race_results, blogs, photos

### For Private Tables (orders, donations, email_subscribers):
```sql
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Only admin can read/write
CREATE POLICY "Admin can read" ON orders FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin can insert" ON orders FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Anyone can insert their own order" ON orders FOR INSERT WITH CHECK (TRUE);
```

## Step 5: Environment Configuration

1. Copy `.env.example` to `.env`
2. Fill in the following values from your Supabase project:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_HOST=db.your-project.supabase.co
SUPABASE_DB=postgres
SUPABASE_USER=postgres
SUPABASE_PASSWORD=your_database_password
```

## Step 6: Enable Authentication

1. In Supabase dashboard, go to Authentication
2. Enable Email authentication
3. Go to Email templates and ensure they're configured
4. Configure auth redirects to:
   - `http://localhost:3001` (local development)
   - `https://admin.glasgowuniversityboatclub.co.uk` (production)

## Troubleshooting

- **Connection refused**: Check your database credentials and that Supabase is running
- **Permission denied**: Verify RLS policies are correctly configured
- **CORS errors**: Check that your domain is added to the Supabase CORS settings
- **Storage access denied**: Ensure the photos bucket is set to public access

For more help, visit: https://supabase.com/docs
