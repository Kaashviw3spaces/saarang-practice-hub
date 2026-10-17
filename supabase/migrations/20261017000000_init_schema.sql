-- ==============================================================================
-- Saarang Practice Hub — Core Database Schema & RLS Policies
-- Migration: 20261017000000_init_schema.sql
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('member', 'admin')) DEFAULT 'member',
  instrument TEXT,
  noise_tolerance TEXT CHECK (noise_tolerance IN ('low', 'medium', 'high')) DEFAULT 'medium',
  collaboration_preference TEXT CHECK (collaboration_preference IN ('solo', 'open', 'collaborative')) DEFAULT 'open',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 2. ROOMS
CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  status TEXT NOT NULL CHECK (status IN ('available', 'reserved', 'occupied', 'departure_pending', 'occupancy_uncertain')) DEFAULT 'available',
  acoustic_properties TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Rooms are viewable by all authenticated users"
  ON public.rooms FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can insert or update rooms"
  ON public.rooms FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 3. INSTRUMENTS
CREATE TABLE IF NOT EXISTS public.instruments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('acoustic', 'electric', 'electronic')),
  base_noise_level_db INTEGER NOT NULL DEFAULT 60,
  physical_sound_even_with_headphones BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.instruments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Instruments viewable by authenticated users"
  ON public.instruments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Instruments manageable by admins"
  ON public.instruments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 4. EQUIPMENT
CREATE TABLE IF NOT EXISTS public.equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('headphones', 'amplifier', 'speaker', 'microphone', 'interface', 'cable', 'other')),
  produces_audio_output BOOLEAN NOT NULL DEFAULT false,
  available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Equipment viewable by authenticated users"
  ON public.equipment FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Equipment manageable by admins"
  ON public.equipment FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 5. ROOM EQUIPMENT JUNCTION
CREATE TABLE IF NOT EXISTS public.room_equipment (
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  equipment_id UUID REFERENCES public.equipment(id) ON DELETE CASCADE,
  PRIMARY KEY (room_id, equipment_id)
);

ALTER TABLE public.room_equipment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Room equipment viewable by authenticated users"
  ON public.room_equipment FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Room equipment manageable by admins"
  ON public.room_equipment FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 6. BOOKINGS
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE RESTRICT,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  instrument TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('individual', 'collaborative', 'band_rehearsal')),
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled')) DEFAULT 'confirmed',
  compatibility_level TEXT CHECK (compatibility_level IN ('compatible', 'conditionally_compatible', 'incompatible', 'insufficient_info')),
  compatibility_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT valid_time_range CHECK (ends_at > starts_at)
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bookings viewable by all authenticated users"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own bookings"
  ON public.bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update or cancel their own bookings"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 7. OCCUPANCY EVENTS
CREATE TABLE IF NOT EXISTS public.occupancy_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('qr_check_in', 'qr_check_out', 'sensor_presence', 'sensor_vacant', 'admin_override')),
  confidence NUMERIC(3, 2) NOT NULL DEFAULT 1.00,
  source TEXT NOT NULL DEFAULT 'user_action',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.occupancy_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Occupancy events viewable by authenticated users"
  ON public.occupancy_events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Occupancy events creatable by authenticated users"
  ON public.occupancy_events FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 8. AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Club Member'),
    NEW.email,
    'member'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
