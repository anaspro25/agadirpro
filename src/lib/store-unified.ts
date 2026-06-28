import { Demande, Reclamation, Citoyen } from "./types";
import { isSupabaseConfigured } from "./supabase";
import * as jsonStore from "./store";
import * as sbStore from "./store-supabase";

const useSupabase = () => {
  if (typeof window !== "undefined") return false; // client-side always JSON
  return isSupabaseConfigured();
};

// --- Demandes ---

export async function getDemandes(): Promise<Demande[]> {
  return useSupabase() ? sbStore.getDemandes() : jsonStore.getDemandes();
}

export async function getDemandesBySecteur(secteur: string): Promise<Demande[]> {
  return useSupabase() ? sbStore.getDemandesBySecteur(secteur) : jsonStore.getDemandesBySecteur(secteur);
}

export async function getDemandesByCitoyen(cin: string): Promise<Demande[]> {
  return useSupabase() ? sbStore.getDemandesByCitoyen(cin) : jsonStore.getDemandesByCitoyen(cin);
}

export async function getDemandeById(id: string): Promise<Demande | null> {
  return useSupabase() ? sbStore.getDemandeById(id) : (jsonStore.getDemandeById(id) || null);
}

export async function addDemande(demande: Demande): Promise<void> {
  useSupabase() ? await sbStore.addDemande(demande) : jsonStore.addDemande(demande);
}

export async function updateDemande(id: string, updates: Partial<Demande>): Promise<Demande | null> {
  return useSupabase() ? sbStore.updateDemande(id, updates) : (jsonStore.updateDemande(id, updates) || null);
}

// --- Reclamations ---

export async function getReclamations(): Promise<Reclamation[]> {
  return useSupabase() ? sbStore.getReclamations() : jsonStore.getReclamations();
}

export async function getReclamationsBySecteur(secteur: string): Promise<Reclamation[]> {
  return useSupabase() ? sbStore.getReclamationsBySecteur(secteur) : jsonStore.getReclamationsBySecteur(secteur);
}

export async function getReclamationsByCitoyen(cin: string): Promise<Reclamation[]> {
  return useSupabase() ? sbStore.getReclamationsByCitoyen(cin) : jsonStore.getReclamationsByCitoyen(cin);
}

export async function getReclamationById(id: string): Promise<Reclamation | null> {
  return useSupabase() ? sbStore.getReclamationById(id) : (jsonStore.getReclamationById(id) || null);
}

export async function addReclamation(reclamation: Reclamation): Promise<void> {
  useSupabase() ? await sbStore.addReclamation(reclamation) : jsonStore.addReclamation(reclamation);
}

export async function updateReclamation(id: string, updates: Partial<Reclamation>): Promise<Reclamation | null> {
  return useSupabase() ? sbStore.updateReclamation(id, updates) : (jsonStore.updateReclamation(id, updates) || null);
}

// --- Citoyens ---

export async function getCitoyens(): Promise<Citoyen[]> {
  return useSupabase() ? sbStore.getCitoyens() : jsonStore.getCitoyens();
}

export async function getCitoyenByCin(cin: string): Promise<Citoyen | null> {
  return useSupabase() ? sbStore.getCitoyenByCin(cin) : (jsonStore.getCitoyenByCin(cin) || null);
}

export async function addCitoyen(citoyen: Citoyen): Promise<void> {
  useSupabase() ? await sbStore.addCitoyen(citoyen) : jsonStore.addCitoyen(citoyen);
}

export async function addCitoyens(entries: Citoyen[]): Promise<void> {
  useSupabase() ? await sbStore.addCitoyens(entries) : jsonStore.addCitoyens(entries);
}

export async function searchCitoyens(query: string): Promise<Citoyen[]> {
  return useSupabase() ? sbStore.searchCitoyens(query) : jsonStore.searchCitoyens(query);
}
