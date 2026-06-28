export interface Demande {
  id: string;
  citoyenId: string;
  nomComplet: string;
  cin: string;
  telephone: string;
  adresse: string;
  secteur: string;
  type: TypeDemande;
  statut: StatutDemande;
  documents: Document[];
  description?: string;
  dateCreation: string;
  dateMiseAJour: string;
  employeId?: string;
  notes?: string;
  latitude?: number;
  longitude?: number;
}

export interface Reclamation {
  id: string;
  citoyenId: string;
  nomComplet: string;
  cin: string;
  telephone: string;
  adresse: string;
  secteur: string;
  sujet: string;
  description: string;
  documents: Document[];
  statut: StatutReclamation;
  dateCreation: string;
  dateMiseAJour: string;
  employeId?: string;
  reponse?: string;
  latitude?: number;
  longitude?: number;
}

export interface Document {
  nom: string;
  type: string;
  dataUrl: string;
}

export interface Employe {
  id: string;
  nomComplet: string;
  email: string;
  motDePasse: string;
  secteurs: string[];
  telephone: string;
  signature?: string;
}

export interface Citoyen {
  id: string;
  cin: string;
  nomComplet: string;
  telephone?: string;
  adresse?: string;
  secteur?: string;
  dateNaissance?: string;
  lieuNaissance?: string;
  profession?: string;
  sexe?: string;
  notes?: string;
}

export enum TypeDemande {
  CHAHADAT_SOKNA = "شهادة السكنى",
  CHAHADAT_ADAM_LAMAL = "شهادة عدم العمل",
  CHAHADAT_TARADUD = "شهادة التردد",
}

export enum StatutDemande {
  MOUDAKHELA = "موداخلة",
  QAYDA_LDIRASA = "قيد الدراسة",
  MOULAJA = "مولجة",
  MO3AMALA = "معاملة",
  MUTAM = "متم",
  MAMBOULA = "مرفوضة",
}

export enum StatutReclamation {
  MOUDAKHELA = "موداخلة",
  QAYDA_LDIRASA = "قيد الدراسة",
  MOULAJA = "مولجة",
  MOAALJA = "معالجة",
  MAMBOULA = "مرفوضة",
}

export const SECTEURS = [
  "حي الداخلة",
  "حي الداخلة 2 (F1-F20)",
  "حي القدس",
  "حي الفضية 1",
  "حي الفضية 2",
  "حي الوفاء",
  "المختار السوسي",
];

export const SECTEUR_LOCATIONS: Record<string, string> = {
  "حي الداخلة": "https://www.google.com/maps/search/حي+الداخلة+أكادير+المغرب",
  "حي الداخلة 2 (F1-F20)": "https://www.google.com/maps/search/حي+الداخلة+2+أكادير+المغرب",
  "حي القدس": "https://www.google.com/maps/search/حي+القدس+أكادير+المغرب",
  "حي الفضية 1": "https://www.google.com/maps/search/حي+الفضية+1+أكادير+المغرب",
  "حي الفضية 2": "https://www.google.com/maps/search/حي+الفضية+2+أكادير+المغرب",
  "حي الوفاء": "https://www.google.com/maps/search/حي+الوفاء+أكادير+المغرب",
  "المختار السوسي": "https://www.google.com/maps/search/المختار+السوسي+أكادير+المغرب",
};

export interface SectorBoundary {
  center: [number, number];
  zoom: number;
  polygon: [number, number][];
}

export const SECTEUR_BOUNDARIES: Record<string, SectorBoundary> = {
  "حي الداخلة": {
    center: [30.4270, -9.5980],
    zoom: 15,
    polygon: [
      [30.4320, -9.6030],
      [30.4320, -9.5900],
      [30.4220, -9.5900],
      [30.4220, -9.6030],
    ],
  },
  "حي الداخلة 2 (F1-F20)": {
    center: [30.4300, -9.5840],
    zoom: 15,
    polygon: [
      [30.4350, -9.5890],
      [30.4350, -9.5780],
      [30.4250, -9.5780],
      [30.4250, -9.5890],
    ],
  },
  "حي القدس": {
    center: [30.4140, -9.5680],
    zoom: 14,
    polygon: [
      [30.4200, -9.5750],
      [30.4200, -9.5600],
      [30.4080, -9.5600],
      [30.4080, -9.5750],
    ],
  },
  "حي الفضية 1": {
    center: [30.4210, -9.5930],
    zoom: 15,
    polygon: [
      [30.4250, -9.5960],
      [30.4250, -9.5880],
      [30.4170, -9.5880],
      [30.4170, -9.5960],
    ],
  },
  "حي الفضية 2": {
    center: [30.4230, -9.5870],
    zoom: 15,
    polygon: [
      [30.4270, -9.5900],
      [30.4270, -9.5830],
      [30.4190, -9.5830],
      [30.4190, -9.5900],
    ],
  },
  "حي الوفاء": {
    center: [30.4050, -9.5900],
    zoom: 14,
    polygon: [
      [30.4120, -9.5970],
      [30.4120, -9.5830],
      [30.3980, -9.5830],
      [30.3980, -9.5970],
    ],
  },
  "المختار السوسي": {
    center: [30.4380, -9.5750],
    zoom: 14,
    polygon: [
      [30.4450, -9.5820],
      [30.4450, -9.5680],
      [30.4310, -9.5680],
      [30.4310, -9.5820],
    ],
  },
};

export const EMPLOYES: Employe[] = [
  { id: "emp1", nomComplet: "عبد الله المسعودي", email: "ahmed@spatcha.ma", motDePasse: "admin123", secteurs: ["حي الداخلة"], telephone: "0661124812" },
  { id: "emp2", nomComplet: "دابوزي عبد الرحمان", email: "fatima@spatcha.ma", motDePasse: "admin123", secteurs: ["حي الداخلة 2 (F1-F20)"], telephone: "0623480385" },
  { id: "emp3", nomComplet: "ليزيد الفيدي", email: "mohamed@spatcha.ma", motDePasse: "admin123", secteurs: ["حي القدس", "حي الفضية 1"], telephone: "0623489866" },
  { id: "emp4", nomComplet: "انس كرابي", email: "saida@spatcha.ma", motDePasse: "admin123", secteurs: ["حي الوفاء", "المختار السوسي", "حي الفضية 2"], telephone: "0662506071" },
];
