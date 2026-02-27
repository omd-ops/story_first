GRANT ALL ON TABLE public.users TO anon, authenticated;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own profile." 
ON public.users FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid()::text = id);

CREATE POLICY "Users can update their own profile." 
ON public.users FOR UPDATE 
TO authenticated 
USING (auth.uid()::text = id) 
WITH CHECK (auth.uid()::text = id);

CREATE POLICY "Users can read their own profile." 
ON public.users FOR SELECT 
TO authenticated 
USING (auth.uid()::text = id);
