-- Crear la tabla profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT,
  avatar TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'creator', 'printer', 'admin')),
  profile_configured BOOLEAN DEFAULT false,
  interests TEXT[] DEFAULT '{}',
  preferences JSONB DEFAULT '{}',
  stats JSONB DEFAULT '{
    "balance": 0,
    "totalOrders": 0,
    "totalSales": 0,
    "rating": 0,
    "modelsUploaded": 0,
    "totalDownloads": 0,
    "totalEarnings": 0,
    "totalViews": 0,
    "totalReviews": 0,
    "totalLikes": 0
  }',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios solo puedan ver y editar su propio perfil
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Función para crear automáticamente un perfil cuando se registra un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, profile_configured, interests, preferences, stats)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    true,
    CASE 
      WHEN COALESCE(NEW.raw_user_meta_data->>'role', 'user') = 'creator' THEN 
        ARRAY['Tecnología', 'Diseño', 'Innovación', 'Arte', 'Modelado 3D', 'Diseño Industrial']
      WHEN COALESCE(NEW.raw_user_meta_data->>'role', 'user') = 'printer' THEN 
        ARRAY['Tecnología', 'Diseño', 'Innovación', 'Manufactura', 'Materiales', 'Ingeniería']
      ELSE 
        ARRAY['Tecnología', 'Diseño', 'Innovación', 'Hogar', 'Gadgets', 'Personalización']
    END,
    jsonb_build_object(
      'notifications', true,
      'newsletter', CASE WHEN COALESCE(NEW.raw_user_meta_data->>'role', 'user') != 'printer' THEN true ELSE false END,
      'publicProfile', CASE WHEN COALESCE(NEW.raw_user_meta_data->>'role', 'user') != 'user' THEN true ELSE false END
    ),
    jsonb_build_object(
      'balance', 0,
      'totalOrders', 0,
      'totalSales', 0,
      'rating', 0,
      'modelsUploaded', 0,
      'totalDownloads', 0,
      'totalEarnings', 0,
      'totalViews', 0,
      'totalReviews', 0,
      'totalLikes', 0
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para ejecutar la función cuando se crea un nuevo usuario
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
