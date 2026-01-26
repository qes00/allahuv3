-- Trigger para crear perfil de usuario automáticamente al registrarse
-- Copia y pega esto en el SQL Editor de Supabase

-- 1. Crear la función que maneja el evento
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, first_name, last_name, phone)
  VALUES (new.id, '', '', '');
  RETURN new;
END;
$$;

-- 2. Crear el trigger que dispara la función
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
