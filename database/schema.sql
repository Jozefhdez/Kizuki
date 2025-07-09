-- Esquema de la base de datos Kizuki
-- Base de datos: Supabase PostgreSQL

-- Tabla de carpetas/folders
CREATE TABLE IF NOT EXISTS folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,                         -- Nombre visible de la carpeta (ej. "personal")
  path TEXT NOT NULL,                         -- Ruta completa (ej. "docs/personal")
  parent_path TEXT DEFAULT '',                -- Carpeta padre ('' si es root)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, path)
);

-- Tabla de páginas
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,                         -- Para la URL o nombre del archivo
  file_path TEXT GENERATED ALWAYS AS (
    'pages/' || user_id || '/' || slug || '.md'
  ) STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, folder_id, slug)
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para folders
CREATE POLICY "Users can insert their own folders" ON folders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own folders" ON folders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own folders" ON folders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own folders" ON folders
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas de seguridad para pages
CREATE POLICY "Users can insert their own pages" ON pages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own pages" ON pages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own pages" ON pages
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pages" ON pages
  FOR DELETE USING (auth.uid() = user_id);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_folders_user_id ON folders(user_id);
CREATE INDEX IF NOT EXISTS idx_folders_parent_path ON folders(parent_path);
CREATE INDEX IF NOT EXISTS idx_pages_user_id ON pages(user_id);
CREATE INDEX IF NOT EXISTS idx_pages_folder_id ON pages(folder_id);

-- Comentarios para documentación
COMMENT ON TABLE folders IS 'Tabla que almacena las carpetas organizacionales de los usuarios';
COMMENT ON TABLE pages IS 'Tabla que almacena las páginas/documentos de los usuarios';
COMMENT ON COLUMN folders.path IS 'Ruta completa de la carpeta, única por usuario';
COMMENT ON COLUMN folders.parent_path IS 'Ruta de la carpeta padre, vacía para carpetas root';
COMMENT ON COLUMN pages.file_path IS 'Ruta generada automáticamente del archivo markdown';
COMMENT ON COLUMN pages.slug IS 'Identificador único para URLs amigables';
