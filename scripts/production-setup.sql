-- Configuración de producción para Supabase

-- 1. Habilitar Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE models ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 2. Políticas de seguridad para profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 3. Políticas para models
CREATE POLICY "Anyone can view published models" ON models
  FOR SELECT USING (status = 'published');

CREATE POLICY "Creators can manage own models" ON models
  FOR ALL USING (auth.uid() = creator_id);

-- 4. Políticas para orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- 5. Índices para performance
CREATE INDEX idx_models_category ON models(category);
CREATE INDEX idx_models_creator ON models(creator_id);
CREATE INDEX idx_models_created_at ON models(created_at DESC);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);

-- 6. Funciones para triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 7. Triggers para timestamps
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_models_updated_at 
  BEFORE UPDATE ON models 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
