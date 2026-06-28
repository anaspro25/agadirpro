import fs from "fs";
import path from "path";
import { Demande, Reclamation, Citoyen } from "./types";
import { supabase, isSupabaseConfigured } from "./supabase";

const DATA_DIR = path.join(process.cwd(), ".data");
const DEMANDES_FILE = path.join(DATA_DIR, "demandes.json");
const RECLAMATIONS_FILE = path.join(DATA_DIR, "reclamations.json");
const CITOYENS_FILE = path.join(DATA_DIR, "citoyens.json");

function ensureDir(): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJSON<T>(filePath: string, fallback: T): T {
  ensureDir();
  if (!fs.existsSync(filePath)) return fallback;
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data) as T;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(filePath: string, data: T): void {
  ensureDir();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export function getDemandes(): Demande[] {
  return readJSON<Demande[]>(DEMANDES_FILE, []);
}

export function getDemandesByCitoyen(citoyenId: string): Demande[] {
  return getDemandes().filter((d) => d.citoyenId === citoyenId);
}

export function getDemandesBySecteur(secteur: string): Demande[] {
  return getDemandes().filter((d) => d.secteur === secteur);
}

export function getDemandeById(id: string): Demande | undefined {
  return getDemandes().find((d) => d.id === id);
}

export function addDemande(demande: Demande): void {
  const demandes = getDemandes();
  demandes.push(demande);
  writeJSON(DEMANDES_FILE, demandes);
}

export function updateDemande(id: string, updates: Partial<Demande>): Demande | undefined {
  const demandes = getDemandes();
  const index = demandes.findIndex((d) => d.id === id);
  if (index === -1) return undefined;
  demandes[index] = { ...demandes[index], ...updates, dateMiseAJour: new Date().toISOString() };
  writeJSON(DEMANDES_FILE, demandes);
  return demandes[index];
}

export function getReclamations(): Reclamation[] {
  return readJSON<Reclamation[]>(RECLAMATIONS_FILE, []);
}

export function getReclamationsByCitoyen(citoyenId: string): Reclamation[] {
  return getReclamations().filter((r) => r.citoyenId === citoyenId);
}

export function getReclamationsBySecteur(secteur: string): Reclamation[] {
  return getReclamations().filter((r) => r.secteur === secteur);
}

export function getReclamationById(id: string): Reclamation | undefined {
  return getReclamations().find((r) => r.id === id);
}

export function addReclamation(reclamation: Reclamation): void {
  const reclamations = getReclamations();
  reclamations.push(reclamation);
  writeJSON(RECLAMATIONS_FILE, reclamations);
}

export function updateReclamation(id: string, updates: Partial<Reclamation>): Reclamation | undefined {
  const reclamations = getReclamations();
  const index = reclamations.findIndex((r) => r.id === id);
  if (index === -1) return undefined;
  reclamations[index] = { ...reclamations[index], ...updates, dateMiseAJour: new Date().toISOString() };
  writeJSON(RECLAMATIONS_FILE, reclamations);
  return reclamations[index];
}

// Citoyens
export function getCitoyens(): Citoyen[] {
  return readJSON<Citoyen[]>(CITOYENS_FILE, []);
}

export function getCitoyenByCin(cin: string): Citoyen | undefined {
  return getCitoyens().find((c) => c.cin === cin);
}

export function addCitoyen(citoyen: Citoyen): void {
  const citoyens = getCitoyens();
  citoyens.push(citoyen);
  writeJSON(CITOYENS_FILE, citoyens);
}

export function addCitoyens(entries: Citoyen[]): void {
  const citoyens = getCitoyens();
  citoyens.push(...entries);
  writeJSON(CITOYENS_FILE, citoyens);
}

export function searchCitoyens(query: string): Citoyen[] {
  const q = query.toLowerCase();
  return getCitoyens().filter(
    (c) =>
      c.cin.toLowerCase().includes(q) ||
      c.nomComplet.toLowerCase().includes(q) ||
      (c.telephone || "").includes(q)
  );
}
