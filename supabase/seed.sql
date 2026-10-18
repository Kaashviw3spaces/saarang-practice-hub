-- Seed practice session spaces
INSERT INTO public.rooms (name, description, capacity, status, acoustic_properties)
VALUES
  ('Session A', 'Rehearsal space with drums, drum pads and amplifiers.', 6, 'available', 'Fully isolated — suitable for loud instruments and full-band rehearsals.'),
  ('Session B', ' Practice space ideal for solo practice, duets, and acoustic or electronic sessions.', 3, 'available', 'Semi-isolated — suitable for moderately loud practice sessions together.'),
  ('Jam Session', 'Open jam space for collaborative sessions and small band rehearsals.', 8, 'available', 'Acoustic panels — good for ensemble practice.'),
  ('Recording Session', 'Recording space for vocals and acoustic instruments.', 2, 'available', 'Broadcast-grade isolation — near silent.'),
  ('Electronics Corner', 'Dedicated space for keyboard players, synth players, etc.', 2, 'available', 'Open layout — suitable for headphone-only practice.')
ON CONFLICT DO NOTHING;

-- Seed instruments
INSERT INTO public.instruments (name, category, base_noise_level_db, physical_sound_even_with_headphones)
VALUES
  ('Acoustic Drums', 'acoustic', 105, true),
  ('Electric Guitar', 'electric', 75, false),
  ('Bass Guitar', 'electric', 75, false),
  ('Upright Piano', 'acoustic', 80, true),
  ('Synthesizer / Keyboard', 'electronic', 45, false),
  ('Vocals (Amplified)', 'acoustic', 85, true),
  ('Acoustic Guitar', 'acoustic', 70, true)
ON CONFLICT DO NOTHING;
