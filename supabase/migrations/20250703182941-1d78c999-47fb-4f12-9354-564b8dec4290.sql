
-- Create a table for beta waitlist users
CREATE TABLE public.beta_waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  company TEXT,
  role TEXT,
  interest_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending'
);

-- Add Row Level Security (RLS)
ALTER TABLE public.beta_waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (for registration)
CREATE POLICY "Anyone can register for beta waitlist" 
  ON public.beta_waitlist 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy for admins to view all waitlist entries
CREATE POLICY "Admins can view beta waitlist" 
  ON public.beta_waitlist 
  FOR SELECT 
  USING ((auth.jwt() ->> 'role'::text) = ANY (ARRAY['admin'::text, 'superadmin'::text]));

-- Create policy for admins to update waitlist status
CREATE POLICY "Admins can update beta waitlist" 
  ON public.beta_waitlist 
  FOR UPDATE 
  USING ((auth.jwt() ->> 'role'::text) = ANY (ARRAY['admin'::text, 'superadmin'::text]));
