-- ============================================================
-- DATOS DE PRUEBA: Base de datos renta_eventos
-- Motor: MySQL 8.x
-- ============================================================

USE renta_eventos;

-- ============================================================
-- 1. CATEGORÍAS (8 nuevas + 2 existentes = 10 total)
-- ============================================================
INSERT INTO categorias (nombre, descripcion) VALUES
  ('Manteles', 'Manteles de tela en diversos colores y tamaños'),
  ('Paquetes', 'Paquetes todo incluido para eventos completos'),
  ('Decoración', 'Centros de mesa, arcos florales y adornos'),
  ('Iluminación', 'Luces LED, reflectores y velas decorativas'),
  ('Carpas', 'Carpas y toldos para eventos al aire libre'),
  ('Cristalería', 'Copas, vasos y vajillas para banquetes'),
  ('Inflables', 'Brincolines e inflables para fiestas infantiles'),
  ('Audio', 'Bocinas, micrófonos y equipo de sonido');

-- ============================================================
-- 2. PRODUCTOS (10 registros)
-- ============================================================
INSERT INTO productos (id_categoria, nombre, descripcion, precio_renta, cantidad_total, cantidad_disponible, imagen_url, activo) VALUES
  (1, 'Silla Tiffany Dorada', 'Elegante silla Tiffany con acabado dorado, ideal para bodas y eventos formales', 45.00, 150, 150, 'https://images.unsplash.com/photo-1503602642458-232111445657?w=400&q=80', TRUE),
  (1, 'Silla Plegable Blanca', 'Silla plegable resistente color blanco para todo tipo de eventos', 25.00, 200, 200, 'https://images.unsplash.com/photo-1551298370-9d3d08a94b1e?w=400&q=80', TRUE),
  (1, 'Silla Crossback Madera', 'Silla crossback estilo rústico de madera natural', 55.00, 80, 80, 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400&q=80', TRUE),
  (2, 'Mesa Redonda 150cm', 'Mesa redonda para 10 personas con superficie laminada', 130.00, 40, 40, 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=400&q=80', TRUE),
  (2, 'Mesa Rectangular 240cm', 'Mesa rectangular para 8 personas, estructura metálica reforzada', 150.00, 30, 30, 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=400&q=80', TRUE),
  (2, 'Mesa Coctelera Alta', 'Mesa coctelera alta para eventos y cócteles', 85.00, 25, 25, 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400&q=80', TRUE),
  (3, 'Mantel Redondo Blanco', 'Mantel redondo blanco de tela premium para mesas de 150cm', 25.00, 100, 100, NULL, TRUE),
  (5, 'Centro de Mesa Floral', 'Arreglo floral artificial para centro de mesa con base dorada', 120.00, 30, 30, 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=400&q=80', TRUE),
  (6, 'Serie de Luces LED 10m', 'Serie de luces LED cálidas de 10 metros para exteriores', 45.00, 35, 35, 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&q=80', TRUE),
  (7, 'Carpa 6x12m Blanca', 'Carpa tipo araña de 6x12 metros color blanco con estructura de acero', 2500.00, 8, 8, NULL, TRUE);

-- ============================================================
-- 3. CLIENTES (10 registros de prueba - requeridos por FK de pedidos)
--    Nota: en producción se crean vía registro/login de la app.
-- ============================================================
INSERT INTO clientes (nombre, telefono, email, direccion, rfc) VALUES
  ('María García López', '5512345001', 'maria.garcia@correo.com', 'Av. Insurgentes Sur 1024, Col. Del Valle, CDMX', 'GALM850612ABC'),
  ('Carlos Hernández Ruiz', '5512345002', 'carlos.hdez@correo.com', 'Calle Morelos 45, Col. Centro, Puebla', NULL),
  ('Ana Martínez Flores', '5512345003', 'ana.martinez@correo.com', 'Blvd. Adolfo López Mateos 310, León, Gto.', 'MAFA900215XYZ'),
  ('Roberto Sánchez Díaz', '5512345004', 'roberto.sanchez@correo.com', 'Av. Revolución 780, Col. Mixcoac, CDMX', NULL),
  ('Laura Ramírez Torres', '5512345005', 'laura.ramirez@correo.com', 'Calle 5 de Mayo 120, Col. Centro, Querétaro', 'RATL880430DEF'),
  ('Fernando López Castro', '5512345006', 'fernando.lopez@correo.com', 'Av. Universidad 500, Col. Narvarte, CDMX', NULL),
  ('Patricia Gómez Vargas', '5512345007', 'patricia.gomez@correo.com', 'Calle Hidalgo 88, Col. Centro, Toluca', 'GOVP920718GHI'),
  ('Miguel Ángel Rivera', '5512345008', 'miguel.rivera@correo.com', 'Blvd. Manuel Ávila Camacho 200, Naucalpan, Edo. Méx.', NULL),
  ('Sofía Delgado Mendoza', '5512345009', 'sofia.delgado@correo.com', 'Av. Juárez 340, Col. Centro, Guadalajara', 'DEMS950322JKL'),
  ('Alejandro Cruz Pérez', '5512345010', 'alejandro.cruz@correo.com', 'Calle Constitución 60, Col. Centro, Monterrey', NULL);

-- ============================================================
-- 4. PEDIDOS (10 registros)
-- Estados: borrador, confirmado, en_renta, devuelto, cancelado
-- ============================================================
INSERT INTO pedidos (id_cliente, fecha_pedido, fecha_renta, fecha_devolucion, estado, direccion_entrega, notas, costo_total) VALUES
  (1, '2026-02-10 09:00:00', '2026-03-15', '2026-03-16', 'confirmado', 'Salón Los Arcos, Av. Tlalpan 1500, CDMX', 'Boda 150 invitados, montar desde las 8am', 8575.00),
  (2, '2026-02-15 14:30:00', '2026-03-20', '2026-03-21', 'borrador', 'Jardín El Edén, Carr. Puebla km 12', 'XV años, confirmar cantidad de mesas', 0.00),
  (3, '2026-02-18 11:00:00', '2026-03-08', '2026-03-09', 'en_renta', 'Hotel Fiesta, Blvd. López Mateos 800, León', 'Evento corporativo, entrega en puerta principal', 5250.00),
  (4, '2026-02-20 16:45:00', '2026-04-05', '2026-04-06', 'borrador', 'Hacienda Santa Rosa, Mixcoac, CDMX', 'Bautizo, decoración floral incluida', 0.00),
  (5, '2026-02-22 10:15:00', '2026-03-01', '2026-03-02', 'devuelto', 'Salón Real, Calle 5 de Mayo 200, Querétaro', 'Graduación, todo devuelto en buen estado', 3375.00),
  (6, '2026-02-25 08:30:00', '2026-03-22', '2026-03-23', 'confirmado', 'Centro de Convenciones, Av. Universidad 900, CDMX', 'Congreso médico, requiere audio', 4680.00),
  (7, '2026-02-28 13:00:00', '2026-03-29', '2026-03-30', 'borrador', 'Jardín Las Palmas, Toluca', 'Fiesta infantil con inflables', 0.00),
  (8, '2026-03-01 09:45:00', '2026-04-12', '2026-04-13', 'confirmado', 'Country Club, Naucalpan, Edo. Méx.', 'Boda civil + recepción', 12050.00),
  (9, '2026-03-03 15:20:00', '2026-03-10', '2026-03-11', 'en_renta', 'Terraza Mirador, Av. Juárez 500, Guadalajara', 'Cena de empresa, 80 invitados', 6400.00),
  (10, '2026-03-05 11:30:00', '2026-04-19', '2026-04-20', 'borrador', 'Quinta Santa Lucía, Monterrey', 'Baby shower, pendiente confirmar decoración', 0.00);

-- ============================================================
-- 5. DETALLE DE PEDIDOS (10 registros)
-- ============================================================
INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario, subtotal) VALUES
  (1, 1, 100, 45.00, 4500.00),   -- Pedido 1: 100 Sillas Tiffany
  (1, 4, 10, 130.00, 1300.00),   -- Pedido 1: 10 Mesas Redondas
  (1, 7, 10, 25.00, 250.00),     -- Pedido 1: 10 Manteles
  (1, 10, 1, 2500.00, 2500.00),  -- Pedido 1: 1 Carpa
  (3, 2, 50, 25.00, 1250.00),    -- Pedido 3: 50 Sillas Plegables
  (3, 5, 5, 150.00, 750.00),     -- Pedido 3: 5 Mesas Rectangulares
  (3, 10, 1, 2500.00, 2500.00),  -- Pedido 3: 1 Carpa
  (5, 1, 50, 45.00, 2250.00),    -- Pedido 5: 50 Sillas Tiffany
  (5, 6, 5, 85.00, 425.00),      -- Pedido 5: 5 Mesas Cocteleras
  (5, 9, 5, 45.00, 225.00);      -- Pedido 5: 5 Series de Luces

-- ============================================================
-- 6. PAGOS (10 registros)
-- ============================================================
INSERT INTO pagos (id_pedido, monto, metodo_pago, referencia, fecha_pago) VALUES
  (1, 4000.00, 'transferencia', 'SPEI-20260210-001', '2026-02-10 10:30:00'),   -- Anticipo boda
  (1, 4575.00, 'transferencia', 'SPEI-20260314-002', '2026-03-14 09:00:00'),   -- Liquidación boda
  (3, 2625.00, 'tarjeta', 'TDC-VISA-8821', '2026-02-18 12:00:00'),            -- Anticipo corporativo
  (3, 2625.00, 'efectivo', NULL, '2026-03-08 08:00:00'),                        -- Liquidación corporativo
  (5, 3375.00, 'transferencia', 'SPEI-20260222-003', '2026-02-22 11:00:00'),   -- Pago total graduación
  (6, 2340.00, 'tarjeta', 'TDC-MC-4455', '2026-02-25 09:15:00'),              -- Anticipo congreso
  (6, 2340.00, 'transferencia', 'SPEI-20260321-004', '2026-03-21 14:00:00'),   -- Liquidación congreso
  (8, 6025.00, 'transferencia', 'SPEI-20260301-005', '2026-03-01 10:00:00'),   -- Anticipo boda civil
  (9, 3200.00, 'efectivo', NULL, '2026-03-03 16:00:00'),                        -- Anticipo cena empresa
  (9, 3200.00, 'tarjeta', 'TDC-AMEX-7712', '2026-03-10 08:30:00');             -- Liquidación cena empresa
