
-- Create members table
CREATE TABLE public.members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  photo_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view members" ON public.members FOR SELECT USING (true);
CREATE POLICY "Anyone can insert members" ON public.members FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update members" ON public.members FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete members" ON public.members FOR DELETE USING (true);

-- Storage bucket for member photos
INSERT INTO storage.buckets (id, name, public) VALUES ('member-photos', 'member-photos', true);

CREATE POLICY "Anyone can view member photos" ON storage.objects FOR SELECT USING (bucket_id = 'member-photos');
CREATE POLICY "Anyone can upload member photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'member-photos');
CREATE POLICY "Anyone can update member photos" ON storage.objects FOR UPDATE USING (bucket_id = 'member-photos');
CREATE POLICY "Anyone can delete member photos" ON storage.objects FOR DELETE USING (bucket_id = 'member-photos');
