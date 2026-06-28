import { Demande, Reclamation, Citoyen } from "./types";
import { supabase } from "./supabase";

// --- Demandes ---

export async function getDemandes(): Promise<Demande[]> {
  const { data } = await supabase!.from("demandes").select("*").order("date_creation", { ascending: false });
  return (data || []).map(mapDemande);
}

export async function getDemandesBySecteur(secteur: string): Promise<Demande[]> {
  const { data } = await supabase!.from("demandes").select("*").eq("secteur", secteur).order("date_creation", { ascending: false });
  return (data || []).map(mapDemande);
}

export async function getDemandesByCitoyen(cin: string): Promise<Demande[]> {
  const { data } = await supabase!.from("demandes").select("*").eq("cin", cin).order("date_creation", { ascending: false });
  return (data || []).map(mapDemande);
}

export async function getDemandeById(id: string): Promise<Demande | null> {
  const { data } = await supabase!.from("demandes").select("*").eq("id", id).single();
  return data ? mapDemande(data) : null;
}

export async function addDemande(demande: Demande): Promise<void> {
  await supabase!.from("demandes").insert([mapDemandeToRow(demande)]);
}

export async function updateDemande(id: string, updates: Partial<Demande>): Promise<Demande | null> {
  const row: any = {};
  if (updates.statut) row.statut = updates.statut;
  if (updates.notes !== undefined) row.notes = updates.notes;
  if (updates.employeId) row.employe_id = updates.employeId;
  row.date_mise_a_jour = new Date().toISOString();
  const { data } = await supabase!.from("demandes").update(row).eq("id", id).select().single();
  return data ? mapDemande(data) : null;
}

// --- Reclamations ---

export async function getReclamations(): Promise<Reclamation[]> {
  const { data } = await supabase!.from("reclamations").select("*").order("date_creation", { ascending: false });
  return (data || []).map(mapReclamation);
}

export async function getReclamationsBySecteur(secteur: string): Promise<Reclamation[]> {
  const { data } = await supabase!.from("reclamations").select("*").eq("secteur", secteur).order("date_creation", { ascending: false });
  return (data || []).map(mapReclamation);
}

export async function getReclamationsByCitoyen(cin: string): Promise<Reclamation[]> {
  const { data } = await supabase!.from("reclamations").select("*").eq("cin", cin).order("date_creation", { ascending: false });
  return (data || []).map(mapReclamation);
}

export async function getReclamationById(id: string): Promise<Reclamation | null> {
  const { data } = await supabase!.from("reclamations").select("*").eq("id", id).single();
  return data ? mapReclamation(data) : null;
}

export async function addReclamation(reclamation: Reclamation): Promise<void> {
  await supabase!.from("reclamations").insert([mapReclamationToRow(reclamation)]);
}

export async function updateReclamation(id: string, updates: Partial<Reclamation>): Promise<Reclamation | null> {
  const row: any = {};
  if (updates.statut) row.statut = updates.statut;
  if (updates.reponse !== undefined) row.reponse = updates.reponse;
  if (updates.employeId) row.employe_id = updates.employeId;
  row.date_mise_a_jour = new Date().toISOString();
  const { data } = await supabase!.from("reclamations").update(row).eq("id", id).select().single();
  return data ? mapReclamation(data) : null;
}

// --- Citoyens ---

export async function getCitoyens(): Promise<Citoyen[]> {
  const { data } = await supabase!.from("citoyens").select("*").order("nom_complet", { ascending: true });
  return (data || []).map(mapCitoyen);
}

export async function getCitoyenByCin(cin: string): Promise<Citoyen | null> {
  const { data } = await supabase!.from("citoyens").select("*").eq("cin", cin).single();
  return data ? mapCitoyen(data) : null;
}

export async function addCitoyen(citoyen: Citoyen): Promise<void> {
  await supabase!.from("citoyens").insert([mapCitoyenToRow(citoyen)]);
}

export async function addCitoyens(entries: Citoyen[]): Promise<void> {
  if (entries.length === 0) return;
  await supabase!.from("citoyens").insert(entries.map(mapCitoyenToRow));
}

export async function searchCitoyens(query: string): Promise<Citoyen[]> {
  const q = `%${query.toLowerCase()}%`;
  const { data } = await supabase!
    .from("citoyens")
    .select("*")
    .or(`cin.ilike.${q},nom_complet.ilike.${q},telephone.ilike.${q}`)
    .limit(50);
  return (data || []).map(mapCitoyen);
}

// --- Mappers ---

function mapDemande(row: any): Demande {
  return {
    id: row.id,
    citoyenId: row.citoyen_id || row.cin,
    nomComplet: row.nom_complet,
    cin: row.cin,
    telephone: row.telephone,
    adresse: row.adresse,
    secteur: row.secteur,
    type: row.type,
    statut: row.statut,
    documents: row.documents || [],
    description: row.description || "",
    dateCreation: row.date_creation,
    dateMiseAJour: row.date_mise_a_jour,
    employeId: row.employe_id || undefined,
    notes: row.notes || undefined,
    latitude: row.latitude || undefined,
    longitude: row.longitude || undefined,
  };
}

function mapDemandeToRow(d: Demande): any {
  return {
    id: d.id,
    citoyen_id: d.citoyenId || d.cin,
    nom_complet: d.nomComplet,
    cin: d.cin,
    telephone: d.telephone,
    adresse: d.adresse,
    secteur: d.secteur,
    type: d.type,
    statut: d.statut,
    documents: d.documents || [],
    description: d.description || "",
    date_creation: d.dateCreation,
    date_mise_a_jour: d.dateMiseAJour || d.dateCreation,
    employe_id: d.employeId || null,
    notes: d.notes || null,
    latitude: d.latitude || null,
    longitude: d.longitude || null,
  };
}

function mapReclamation(row: any): Reclamation {
  return {
    id: row.id,
    citoyenId: row.citoyen_id || row.cin,
    nomComplet: row.nom_complet,
    cin: row.cin,
    telephone: row.telephone,
    adresse: row.adresse,
    secteur: row.secteur,
    sujet: row.sujet,
    description: row.description || "",
    documents: row.documents || [],
    statut: row.statut,
    dateCreation: row.date_creation,
    dateMiseAJour: row.date_mise_a_jour,
    employeId: row.employe_id || undefined,
    reponse: row.reponse || undefined,
    latitude: row.latitude || undefined,
    longitude: row.longitude || undefined,
  };
}

function mapReclamationToRow(r: Reclamation): any {
  return {
    id: r.id,
    citoyen_id: r.citoyenId || r.cin,
    nom_complet: r.nomComplet,
    cin: r.cin,
    telephone: r.telephone,
    adresse: r.adresse,
    secteur: r.secteur,
    sujet: r.sujet,
    description: r.description || "",
    documents: r.documents || [],
    statut: r.statut,
    date_creation: r.dateCreation,
    date_mise_a_jour: r.dateMiseAJour || r.dateCreation,
    employe_id: r.employeId || null,
    reponse: r.reponse || null,
    latitude: r.latitude || null,
    longitude: r.longitude || null,
  };
}

function mapCitoyen(row: any): Citoyen {
  return {
    id: row.id,
    cin: row.cin,
    nomComplet: row.nom_complet,
    telephone: row.telephone || undefined,
    adresse: row.adresse || undefined,
    secteur: row.secteur || undefined,
    dateNaissance: row.date_naissance || undefined,
    lieuNaissance: row.lieu_naissance || undefined,
    profession: row.profession || undefined,
    sexe: row.sexe || undefined,
    notes: row.notes || undefined,
  };
}

function mapCitoyenToRow(c: Citoyen): any {
  return {
    id: c.id,
    cin: c.cin,
    nom_complet: c.nomComplet,
    telephone: c.telephone || null,
    adresse: c.adresse || null,
    secteur: c.secteur || null,
    date_naissance: c.dateNaissance || null,
    lieu_naissance: c.lieuNaissance || null,
    profession: c.profession || null,
    sexe: c.sexe || null,
    notes: c.notes || null,
  };
}
