-- ============================================================
-- ESQUEMA DE BASE DE DATOS: Aplicación de Renta de Sillas y Mesas
-- Motor: MySQL 8.x
-- Fecha de diseño: 2026-03-06
-- ============================================================

CREATE DATABASE IF NOT EXISTS renta_eventos
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE renta_eventos;

-- ============================================================
-- 1. TABLA: clientes
-- Descripción: Registra los datos de los clientes que solicitan rentas.
-- ============================================================
CREATE TABLE clientes (
  id_cliente      INT             AUTO_INCREMENT,
  nombre          VARCHAR(100)    NOT NULL,
  telefono        VARCHAR(20)     NOT NULL,
  email           VARCHAR(150)    NULL,
  direccion       VARCHAR(255)    NULL,
  rfc             VARCHAR(13)     NULL,
  created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT pk_clientes PRIMARY KEY (id_cliente),
  CONSTRAINT uq_clientes_email UNIQUE (email)
) ENGINE=InnoDB;

-- ============================================================
-- 2. TABLA: categorias
-- Descripción: Clasificación de los productos (Sillas, Mesas, etc.).
-- ============================================================
CREATE TABLE categorias (
  id_categoria    INT             AUTO_INCREMENT,
  nombre          VARCHAR(50)     NOT NULL,
  descripcion     VARCHAR(255)    NULL,

  CONSTRAINT pk_categorias PRIMARY KEY (id_categoria),
  CONSTRAINT uq_categorias_nombre UNIQUE (nombre)
) ENGINE=InnoDB;

-- ============================================================
-- 3. TABLA: productos
-- Descripción: Artículos disponibles para renta con precio y stock.
-- ============================================================
CREATE TABLE productos (
  id_producto         INT             AUTO_INCREMENT,
  id_categoria        INT             NOT NULL,
  nombre              VARCHAR(100)    NOT NULL,
  descripcion         TEXT            NULL,
  precio_renta        DECIMAL(10,2)   NOT NULL,
  cantidad_total      INT             NOT NULL,
  cantidad_disponible INT             NOT NULL,
  imagen_url          VARCHAR(255)    NULL,
  activo              BOOLEAN         NOT NULL DEFAULT TRUE,
  created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT pk_productos PRIMARY KEY (id_producto),
  CONSTRAINT fk_productos_categoria
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT chk_productos_precio CHECK (precio_renta >= 0),
  CONSTRAINT chk_productos_cant_total CHECK (cantidad_total >= 0),
  CONSTRAINT chk_productos_cant_disp CHECK (cantidad_disponible >= 0),
  CONSTRAINT chk_productos_disp_lte_total CHECK (cantidad_disponible <= cantidad_total)
) ENGINE=InnoDB;

-- ============================================================
-- 4. TABLA: pedidos
-- Descripción: Orden de renta creada por un cliente.
-- Estados: borrador → confirmado → en_renta → devuelto | cancelado
-- ============================================================
CREATE TABLE pedidos (
  id_pedido           INT             AUTO_INCREMENT,
  id_cliente          INT             NOT NULL,
  fecha_pedido        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_renta         DATE            NOT NULL,
  fecha_devolucion    DATE            NOT NULL,
  estado              ENUM('borrador','confirmado','en_renta','devuelto','cancelado')
                                      NOT NULL DEFAULT 'borrador',
  direccion_entrega   VARCHAR(255)    NULL,
  notas               TEXT            NULL,
  costo_total         DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
  created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT pk_pedidos PRIMARY KEY (id_pedido),
  CONSTRAINT fk_pedidos_cliente
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT chk_pedidos_fechas CHECK (fecha_devolucion >= fecha_renta),
  CONSTRAINT chk_pedidos_costo CHECK (costo_total >= 0)
) ENGINE=InnoDB;

-- Índice para consultas frecuentes por cliente y estado
CREATE INDEX idx_pedidos_cliente ON pedidos(id_cliente);
CREATE INDEX idx_pedidos_estado  ON pedidos(estado);
CREATE INDEX idx_pedidos_fechas  ON pedidos(fecha_renta, fecha_devolucion);

-- ============================================================
-- 5. TABLA: detalle_pedido
-- Descripción: Líneas individuales de cada pedido (relación N:M
--              entre pedidos y productos).
-- ============================================================
CREATE TABLE detalle_pedido (
  id_detalle      INT             AUTO_INCREMENT,
  id_pedido       INT             NOT NULL,
  id_producto     INT             NOT NULL,
  cantidad        INT             NOT NULL,
  precio_unitario DECIMAL(10,2)   NOT NULL,
  subtotal        DECIMAL(12,2)   NOT NULL,

  CONSTRAINT pk_detalle_pedido PRIMARY KEY (id_detalle),
  CONSTRAINT fk_detalle_pedido
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_detalle_producto
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT chk_detalle_cantidad CHECK (cantidad > 0),
  CONSTRAINT chk_detalle_precio CHECK (precio_unitario >= 0),
  CONSTRAINT chk_detalle_subtotal CHECK (subtotal >= 0)
) ENGINE=InnoDB;

CREATE INDEX idx_detalle_pedido   ON detalle_pedido(id_pedido);
CREATE INDEX idx_detalle_producto ON detalle_pedido(id_producto);

-- ============================================================
-- 6. TABLA: pagos
-- Descripción: Registros de pagos asociados a un pedido.
-- ============================================================
CREATE TABLE pagos (
  id_pago         INT             AUTO_INCREMENT,
  id_pedido       INT             NOT NULL,
  monto           DECIMAL(12,2)   NOT NULL,
  metodo_pago     ENUM('efectivo','transferencia','tarjeta','otro')
                                  NOT NULL,
  referencia      VARCHAR(100)    NULL,
  fecha_pago      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT pk_pagos PRIMARY KEY (id_pago),
  CONSTRAINT fk_pagos_pedido
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT chk_pagos_monto CHECK (monto > 0)
) ENGINE=InnoDB;

CREATE INDEX idx_pagos_pedido ON pagos(id_pedido);

-- ============================================================
-- DATOS INICIALES: Categorías base
-- ============================================================
INSERT INTO categorias (nombre, descripcion) VALUES
  ('Sillas', 'Sillas de diferentes estilos para eventos'),
  ('Mesas',  'Mesas redondas, rectangulares y cuadradas para eventos');

-- ============================================================
-- PROCEDIMIENTO: Calcular costo total del pedido
-- Recalcula el campo costo_total sumando los subtotales del detalle.
-- ============================================================
DELIMITER $$

CREATE PROCEDURE sp_recalcular_costo_total(IN p_id_pedido INT)
BEGIN
  UPDATE pedidos
  SET costo_total = (
    SELECT COALESCE(SUM(subtotal), 0)
    FROM detalle_pedido
    WHERE id_pedido = p_id_pedido
  )
  WHERE id_pedido = p_id_pedido;
END$$

-- ============================================================
-- PROCEDIMIENTO: Confirmar pedido
-- Cambia el estado a 'confirmado' y descuenta la disponibilidad.
-- ============================================================
CREATE PROCEDURE sp_confirmar_pedido(IN p_id_pedido INT)
BEGIN
  DECLARE v_estado VARCHAR(20);

  SELECT estado INTO v_estado FROM pedidos WHERE id_pedido = p_id_pedido;

  IF v_estado != 'borrador' THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Solo se pueden confirmar pedidos en estado borrador.';
  END IF;

  -- Verificar disponibilidad de todos los productos del pedido
  IF EXISTS (
    SELECT 1
    FROM detalle_pedido dp
    INNER JOIN productos p ON dp.id_producto = p.id_producto
    WHERE dp.id_pedido = p_id_pedido
      AND dp.cantidad > p.cantidad_disponible
  ) THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Stock insuficiente para uno o más productos del pedido.';
  END IF;

  -- Descontar disponibilidad
  UPDATE productos p
  INNER JOIN detalle_pedido dp ON p.id_producto = dp.id_producto
  SET p.cantidad_disponible = p.cantidad_disponible - dp.cantidad
  WHERE dp.id_pedido = p_id_pedido;

  -- Cambiar estado
  UPDATE pedidos
  SET estado = 'confirmado'
  WHERE id_pedido = p_id_pedido;
END$$

-- ============================================================
-- PROCEDIMIENTO: Devolver pedido
-- Cambia estado a 'devuelto' y restituye la disponibilidad.
-- ============================================================
CREATE PROCEDURE sp_devolver_pedido(IN p_id_pedido INT)
BEGIN
  DECLARE v_estado VARCHAR(20);

  SELECT estado INTO v_estado FROM pedidos WHERE id_pedido = p_id_pedido;

  IF v_estado NOT IN ('confirmado', 'en_renta') THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Solo se pueden devolver pedidos confirmados o en renta.';
  END IF;

  -- Restituir disponibilidad
  UPDATE productos p
  INNER JOIN detalle_pedido dp ON p.id_producto = dp.id_producto
  SET p.cantidad_disponible = p.cantidad_disponible + dp.cantidad
  WHERE dp.id_pedido = p_id_pedido;

  -- Cambiar estado
  UPDATE pedidos
  SET estado = 'devuelto'
  WHERE id_pedido = p_id_pedido;
END$$

DELIMITER ;

-- ============================================================
-- VISTA: Resumen de pedidos con totales y datos de cliente
-- ============================================================
CREATE VIEW vw_resumen_pedidos AS
SELECT
  p.id_pedido,
  c.nombre          AS cliente,
  c.telefono,
  p.fecha_renta,
  p.fecha_devolucion,
  DATEDIFF(p.fecha_devolucion, p.fecha_renta) AS dias_renta,
  p.estado,
  p.costo_total,
  COALESCE(pg.total_pagado, 0) AS total_pagado,
  p.costo_total - COALESCE(pg.total_pagado, 0) AS saldo_pendiente
FROM pedidos p
INNER JOIN clientes c ON p.id_cliente = c.id_cliente
LEFT JOIN (
  SELECT id_pedido, SUM(monto) AS total_pagado
  FROM pagos
  GROUP BY id_pedido
) pg ON p.id_pedido = pg.id_pedido;

-- ============================================================
-- VISTA: Disponibilidad actual de productos
-- ============================================================
CREATE VIEW vw_disponibilidad_productos AS
SELECT
  p.id_producto,
  cat.nombre          AS categoria,
  p.nombre,
  p.precio_renta,
  p.cantidad_total,
  p.cantidad_disponible,
  (p.cantidad_total - p.cantidad_disponible) AS cantidad_en_renta,
  p.activo
FROM productos p
INNER JOIN categorias cat ON p.id_categoria = cat.id_categoria;
