
-- Restrict member mutations to authenticated users only
DROP POLICY "Anyone can insert members" ON public.members;
DROP POLICY "Anyone can update members" ON public.members;
DROP POLICY "Anyone can delete members" ON public.members;

CREATE POLICY "Authenticated users can insert members" ON public.members FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update members" ON public.members FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete members" ON public.members FOR DELETE TO authenticated USING (true);

-- Restrict storage mutations to authenticated users
DROP POLICY "Anyone can upload member photos" ON storage.objects;
DROP POLICY "Anyone can update member photos" ON storage.objects;
DROP POLICY "Anyone can delete member photos" ON storage.objects;

CREATE POLICY "Authenticated can upload member photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'member-photos');
CREATE POLICY "Authenticated can update member photos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'member-photos');
CREATE POLICY "Authenticated can delete member photos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'member-photos');
