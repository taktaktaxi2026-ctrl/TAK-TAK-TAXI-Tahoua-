-- ====================================================================
-- TAK TAK TAXI - BASE DE DONNÉES SUPABASE (PostgreSQL)
-- Application de mise en relation de taxis à Niamey (Niger)
-- ====================================================================

-- 1. EXTENSIONS & TYPES ENUM
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('passager', 'chauffeur', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE course_status AS ENUM ('recherche', 'trouve', 'en_route', 'en_cours', 'termine', 'recu', 'annule');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE chauffeur_statut AS ENUM ('en_ligne', 'hors_ligne', 'occupe');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE doc_type AS ENUM ('cni', 'permis', 'carte_grise');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE doc_verdict AS ENUM ('en_attente', 'valide', 'refuse');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. TABLE DES UTILISATEURS (USERS)
CREATE TABLE IF NOT EXISTS public.users (
    id VARCHAR(100) PRIMARY KEY,
    role user_role DEFAULT 'passager',
    phone VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(255),
    name VARCHAR(150) NOT NULL,
    avatar_url TEXT,
    language VARCHAR(10) DEFAULT 'fr',
    theme_color VARCHAR(10) DEFAULT '#D4AF37',
    emergency_contacts JSONB DEFAULT '[]'::jsonb,
    cancellations_count INT DEFAULT 0,
    is_suspended BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLE DES CHAUFFEURS ET DOCUMENTS
CREATE TABLE IF NOT EXISTS public.chauffeurs (
    user_id VARCHAR(100) PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    plaque VARCHAR(30) UNIQUE NOT NULL,
    vehicule_modele VARCHAR(100) NOT NULL,
    note NUMERIC(3,2) DEFAULT 4.90,
    statut chauffeur_statut DEFAULT 'en_ligne',
    documents JSONB DEFAULT '{}'::jsonb,
    global_verdict doc_verdict DEFAULT 'valide',
    lat NUMERIC(10,6) DEFAULT 13.5137,
    lng NUMERIC(10,6) DEFAULT 2.1098,
    courses_effectuees INT DEFAULT 120,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLE DES COURSES (COURSES)
CREATE TABLE IF NOT EXISTS public.courses (
    id VARCHAR(100) PRIMARY KEY,
    passager_id VARCHAR(100) REFERENCES public.users(id) ON DELETE SET NULL,
    passager_name VARCHAR(150),
    passager_phone VARCHAR(30),
    chauffeur_id VARCHAR(100) REFERENCES public.users(id) ON DELETE SET NULL,
    chauffeur_name VARCHAR(150),
    chauffeur_phone VARCHAR(30),
    chauffeur_plaque VARCHAR(30),
    depart_nom TEXT NOT NULL,
    depart_lat NUMERIC(10,6) NOT NULL,
    depart_lng NUMERIC(10,6) NOT NULL,
    arrivee_nom TEXT NOT NULL,
    arrivee_lat NUMERIC(10,6) NOT NULL,
    arrivee_lng NUMERIC(10,6) NOT NULL,
    prix_propose INT DEFAULT 1500,
    prix_accepte INT,
    nb_echanges INT DEFAULT 0,
    nb_passagers INT DEFAULT 1,
    statut course_status DEFAULT 'recherche',
    note_donnee NUMERIC(3,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 5. TABLE DES MESSAGES EN DIRECT & NÉGOCIATIONS (CHAT)
CREATE TABLE IF NOT EXISTS public.course_messages (
    id VARCHAR(100) PRIMARY KEY,
    course_id VARCHAR(100) REFERENCES public.courses(id) ON DELETE CASCADE,
    sender_id VARCHAR(100),
    sender_name VARCHAR(150),
    sender_role user_role DEFAULT 'passager',
    content TEXT NOT NULL,
    contains_number BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABLE DES REÇUS FISCAUX DE COURSE
CREATE TABLE IF NOT EXISTS public.recus (
    id VARCHAR(100) PRIMARY KEY,
    course_id VARCHAR(100) REFERENCES public.courses(id) ON DELETE CASCADE,
    trajet TEXT NOT NULL,
    date VARCHAR(50) NOT NULL,
    montant INT NOT NULL,
    chauffeur VARCHAR(150) NOT NULL,
    passager VARCHAR(150) NOT NULL,
    mentions TEXT DEFAULT 'Modèle commission 0% Bêta Niger',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABLE DE VÉRIFICATION DES DOCUMENTS PAR GEMINI IA (OCR)
CREATE TABLE IF NOT EXISTS public.documents_ocr (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id VARCHAR(100) REFERENCES public.chauffeurs(user_id) ON DELETE CASCADE,
    doc_type doc_type NOT NULL,
    file_name TEXT,
    file_url TEXT,
    ocr_verdict doc_verdict DEFAULT 'en_attente',
    ocr_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TABLE DES VERSIONS DE L'APPLICATION (APK / PWA)
CREATE TABLE IF NOT EXISTS public.versions (
    id SERIAL PRIMARY KEY,
    version VARCHAR(50) UNIQUE NOT NULL,
    download_url TEXT,
    mandatory BOOLEAN DEFAULT FALSE,
    changelog TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- DONNÉES INITIALES (SEED DATA FOR NIAMEY BÊTA)
-- ====================================================================

-- Insertion version courante APK
INSERT INTO public.versions (version, download_url, mandatory, changelog)
VALUES ('v1.0.0-beta.niamey', 'https://taktak.ne/downloads/taktak-v1.0.0.apk', FALSE, 'Version initiale Niamey avec carte OpenStreetMap & IA Gemini')
ON CONFLICT (version) DO NOTHING;

-- Insertion administrateur par défaut
INSERT INTO public.users (id, role, phone, email, name, language, theme_color, emergency_contacts)
VALUES ('usr-admin-001', 'admin', '+227 96 00 00 00', 'taktaktaxi2026@gmail.com', 'Superviseur TAK TAK TAXI', 'fr', '#D4AF37', '["+227 96 00 00 00"]')
ON CONFLICT (id) DO NOTHING;

-- Insertion Chauffeur 1 (Abdoulaye Moussa)
INSERT INTO public.users (id, role, phone, email, name, language, theme_color)
VALUES ('ch-01', 'chauffeur', '+227 96 88 12 34', 'abdoulaye.moussa@taktak.ne', 'Abdoulaye Moussa', 'fr', '#D4AF37')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.chauffeurs (user_id, plaque, vehicule_modele, note, statut, global_verdict, lat, lng, courses_effectuees)
VALUES ('ch-01', 'RN-4582-NY', 'Toyota Corolla Gris', 4.90, 'en_ligne', 'valide', 13.5178, 2.1156, 142)
ON CONFLICT (user_id) DO NOTHING;

-- Insertion Chauffeur 2 (Souleymane Ibrahim)
INSERT INTO public.users (id, role, phone, email, name, language, theme_color)
VALUES ('ch-02', 'chauffeur', '+227 90 12 34 56', 'souleymane.ibrahim@taktak.ne', 'Souleymane Ibrahim', 'ha', '#D4AF37')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.chauffeurs (user_id, plaque, vehicule_modele, note, statut, global_verdict, lat, lng, courses_effectuees)
VALUES ('ch-02', 'RN-1092-NY', 'Hyundai Elantra Blanc', 4.80, 'en_ligne', 'valide', 13.5220, 2.1050, 98)
ON CONFLICT (user_id) DO NOTHING;

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chauffeurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents_ocr ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.versions ENABLE ROW LEVEL SECURITY;

-- Autoriser la lecture publique pour la démo Bêta
CREATE POLICY "Allow public read users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update users" ON public.users FOR ALL USING (true);

CREATE POLICY "Allow public read chauffeurs" ON public.chauffeurs FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update chauffeurs" ON public.chauffeurs FOR ALL USING (true);

CREATE POLICY "Allow public read courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update courses" ON public.courses FOR ALL USING (true);

CREATE POLICY "Allow public read messages" ON public.course_messages FOR SELECT USING (true);
CREATE POLICY "Allow public insert messages" ON public.course_messages FOR ALL USING (true);

CREATE POLICY "Allow public read recus" ON public.recus FOR SELECT USING (true);
CREATE POLICY "Allow public insert recus" ON public.recus FOR ALL USING (true);

CREATE POLICY "Allow public read versions" ON public.versions FOR SELECT USING (true);
