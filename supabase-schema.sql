-- Spatcha Database Schema for Supabase
-- Run this in the Supabase SQL Editor

-- Employes (Agents d'Autorité)
CREATE TABLE employes (
  id TEXT PRIMARY KEY,
  nom_complet TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  mot_de_passe TEXT NOT NULL,
  secteurs TEXT[] NOT NULL DEFAULT '{}',
  telephone TEXT NOT NULL,
  signature TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Citoyens (Residents)
CREATE TABLE citoyens (
  id TEXT PRIMARY KEY,
  cin TEXT UNIQUE NOT NULL,
  nom_complet TEXT NOT NULL,
  telephone TEXT,
  adresse TEXT,
  secteur TEXT,
  date_naissance TEXT,
  lieu_naissance TEXT,
  profession TEXT,
  sexe TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Demandes (Certificate Requests)
CREATE TABLE demandes (
  id TEXT PRIMARY KEY,
  citoyen_id TEXT REFERENCES citoyens(cin),
  nom_complet TEXT NOT NULL,
  cin TEXT NOT NULL,
  telephone TEXT NOT NULL,
  adresse TEXT NOT NULL,
  secteur TEXT NOT NULL,
  type TEXT NOT NULL,
  statut TEXT NOT NULL DEFAULT 'موداخلة',
  documents JSONB DEFAULT '[]',
  description TEXT DEFAULT '',
  date_creation TIMESTAMPTZ DEFAULT NOW(),
  date_mise_a_jour TIMESTAMPTZ DEFAULT NOW(),
  employe_id TEXT REFERENCES employes(id),
  notes TEXT,
  latitude FLOAT,
  longitude FLOAT
);

-- Reclamations (Complaints)
CREATE TABLE reclamations (
  id TEXT PRIMARY KEY,
  citoyen_id TEXT REFERENCES citoyens(cin),
  nom_complet TEXT NOT NULL,
  cin TEXT NOT NULL,
  telephone TEXT NOT NULL,
  adresse TEXT NOT NULL,
  secteur TEXT NOT NULL,
  sujet TEXT NOT NULL,
  description TEXT NOT NULL,
  documents JSONB DEFAULT '[]',
  statut TEXT NOT NULL DEFAULT 'موداخلة',
  date_creation TIMESTAMPTZ DEFAULT NOW(),
  date_mise_a_jour TIMESTAMPTZ DEFAULT NOW(),
  employe_id TEXT REFERENCES employes(id),
  reponse TEXT,
  latitude FLOAT,
  longitude FLOAT
);

-- Indexes
CREATE INDEX idx_demandes_cin ON demandes(cin);
CREATE INDEX idx_demandes_secteur ON demandes(secteur);
CREATE INDEX idx_demandes_statut ON demandes(statut);
CREATE INDEX idx_reclamations_cin ON reclamations(cin);
CREATE INDEX idx_reclamations_secteur ON reclamations(secteur);
CREATE INDEX idx_reclamations_statut ON reclamations(statut);
CREATE INDEX idx_citoyens_cin ON citoyens(cin);
CREATE INDEX idx_citoyens_secteur ON citoyens(secteur);

-- Insert employees
INSERT INTO employes (id, nom_complet, email, mot_de_passe, secteurs, telephone) VALUES
  ('emp1', 'عبد الله المسعودي', 'ahmed@spatcha.ma', 'admin123', ARRAY['حي الداخلة'], '0661124812'),
  ('emp2', 'دابوزي عبد الرحمان', 'fatima@spatcha.ma', 'admin123', ARRAY['حي الداخلة 2 (F1-F20)'], '0623480385'),
  ('emp3', 'ليزيد الفيدي', 'mohamed@spatcha.ma', 'admin123', ARRAY['حي القدس', 'حي الفضية 1'], '0623489866'),
  ('emp4', 'انس كرابي', 'saida@spatcha.ma', 'admin123', ARRAY['حي الوفاء', 'المختار السوسي', 'حي الفضية 2'], '0662506071');
