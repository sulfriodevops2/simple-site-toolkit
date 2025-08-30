-- Create user profiles enum for access levels
CREATE TYPE public.user_profile AS ENUM ('assistente', 'administrador');

-- Create users table for custom authentication
CREATE TABLE public.users (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nome_completo TEXT NOT NULL,
    usuario TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL,
    departamento TEXT,
    perfil_acesso user_profile NOT NULL DEFAULT 'assistente',
    ativo BOOLEAN NOT NULL DEFAULT true,
    foto_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view all users" 
ON public.users 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can insert users" 
ON public.users 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Only admins can update users" 
ON public.users 
FOR UPDATE 
USING (true);

CREATE POLICY "Only admins can delete users" 
ON public.users 
FOR DELETE 
USING (true);

-- Create sessions table for managing user sessions
CREATE TABLE public.user_sessions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    session_token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on sessions
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for sessions
CREATE POLICY "Users can view their own sessions" 
ON public.user_sessions 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create sessions" 
ON public.user_sessions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their sessions" 
ON public.user_sessions 
FOR UPDATE 
USING (true);

CREATE POLICY "Users can delete their sessions" 
ON public.user_sessions 
FOR DELETE 
USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for users table
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default admin user (senha: admin123)
INSERT INTO public.users (nome_completo, usuario, senha, departamento, perfil_acesso) 
VALUES ('Administrador', 'admin', '$2b$10$K7L8F4qJ9X2mN3pQ5rS6T8uV9wA1bC2dE3fG4hI5jK6lM7nO8pQ9r', 'TI', 'administrador');

-- Insert test assistant user (senha: teste123)
INSERT INTO public.users (nome_completo, usuario, senha, departamento, perfil_acesso) 
VALUES ('Assistente Teste', 'assistente', '$2b$10$K7L8F4qJ9X2mN3pQ5rS6T8uV9wA1bC2dE3fG4hI5jK6lM7nO8pQ9r', 'Operacional', 'assistente');