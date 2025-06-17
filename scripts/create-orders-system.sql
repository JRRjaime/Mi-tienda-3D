-- Sistema completo de pedidos y estados

-- 1. Tabla de pedidos principal
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  printer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  model_id UUID NOT NULL,
  model_name TEXT NOT NULL,
  model_image TEXT,
  quantity INTEGER DEFAULT 1,
  total_price DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending',
    'accepted',
    'rejected', 
    'printing',
    'completed',
    'shipped',
    'delivered',
    'cancelled'
  )),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN (
    'pending',
    'paid',
    'failed',
    'refunded'
  )),
  print_specifications JSONB DEFAULT '{}',
  shipping_address JSONB,
  notes TEXT,
  estimated_completion TIMESTAMP,
  actual_completion TIMESTAMP,
  tracking_number TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Tabla de especificaciones de impresión
CREATE TABLE IF NOT EXISTS print_specifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  material TEXT NOT NULL DEFAULT 'PLA',
  color TEXT NOT NULL DEFAULT 'White',
  infill_percentage INTEGER DEFAULT 20,
  layer_height DECIMAL(4,2) DEFAULT 0.2,
  supports BOOLEAN DEFAULT false,
  print_speed INTEGER DEFAULT 50,
  nozzle_temperature INTEGER DEFAULT 200,
  bed_temperature INTEGER DEFAULT 60,
  estimated_print_time INTEGER, -- en minutos
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Tabla de historial de estados
CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Tabla de impresoras disponibles
CREATE TABLE IF NOT EXISTS printers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  model TEXT,
  build_volume JSONB, -- {x: 220, y: 220, z: 250}
  supported_materials TEXT[] DEFAULT ARRAY['PLA'],
  hourly_rate DECIMAL(8,2) DEFAULT 5.00,
  is_active BOOLEAN DEFAULT true,
  location TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. Índices para performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_printer_id ON orders(printer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_printers_owner_id ON printers(owner_id);
CREATE INDEX IF NOT EXISTS idx_printers_active ON printers(is_active);

-- 6. Políticas de seguridad (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE print_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE printers ENABLE ROW LEVEL SECURITY;

-- Políticas para orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = printer_id);

CREATE POLICY "Users can create orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Printers can update assigned orders" ON orders
  FOR UPDATE USING (auth.uid() = printer_id OR auth.uid() = user_id);

-- Políticas para printers
CREATE POLICY "Anyone can view active printers" ON printers
  FOR SELECT USING (is_active = true);

CREATE POLICY "Owners can manage their printers" ON printers
  FOR ALL USING (auth.uid() = owner_id);

-- Políticas para print_specifications
CREATE POLICY "Order participants can view specs" ON print_specifications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = print_specifications.order_id 
      AND (orders.user_id = auth.uid() OR orders.printer_id = auth.uid())
    )
  );

-- 7. Funciones para triggers
CREATE OR REPLACE FUNCTION update_order_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION log_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO order_status_history (order_id, status, changed_by, notes)
        VALUES (NEW.id, NEW.status, auth.uid(), 'Status changed from ' || OLD.status || ' to ' || NEW.status);
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. Triggers
CREATE TRIGGER update_orders_timestamp 
  BEFORE UPDATE ON orders 
  FOR EACH ROW EXECUTE FUNCTION update_order_timestamp();

CREATE TRIGGER log_order_status_changes
  AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION log_status_change();

-- 9. Datos de ejemplo para testing (opcional)
INSERT INTO printers (owner_id, name, model, build_volume, supported_materials, hourly_rate, location) VALUES
  ((SELECT id FROM auth.users LIMIT 1), 'Ender 3 Pro', 'Creality Ender 3 Pro', '{"x": 220, "y": 220, "z": 250}', ARRAY['PLA', 'PETG', 'ABS'], 8.50, 'Madrid, España'),
  ((SELECT id FROM auth.users LIMIT 1), 'Prusa i3 MK3S+', 'Prusa i3 MK3S+', '{"x": 250, "y": 210, "z": 210}', ARRAY['PLA', 'PETG', 'ABS', 'TPU'], 12.00, 'Barcelona, España');
