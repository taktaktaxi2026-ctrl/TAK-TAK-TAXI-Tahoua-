export type UserRole = 'passager' | 'chauffeur' | 'admin';

export type CourseStatus = 
  | 'recherche' 
  | 'trouve' 
  | 'en_route' 
  | 'en_cours' 
  | 'termine' 
  | 'recu'
  | 'annule';

export type DocumentType = 'cni' | 'permis' | 'carte_grise';

export interface User {
  id: string;
  role: UserRole;
  phone: string;
  email?: string;
  name: string;
  avatarUrl?: string;
  language: string;
  themeColor: string;
  emergencyContacts: string[];
  cancellationsCount: number;
  isSuspended?: boolean;
  createdAt: string;
}

export interface DocumentVerification {
  type: DocumentType;
  fileName: string;
  fileUrl: string;
  ocrVerdict: 'en_attente' | 'valide' | 'refuse';
  ocrData?: {
    nom?: string;
    prenom?: string;
    numero_document?: string;
    date_validite?: string;
    confiance?: number;
    message?: string;
  };
}

export interface ChauffeurProfile {
  userId: string;
  plaque: string;
  vehiculeModele: string;
  note: number;
  statut: 'en_ligne' | 'hors_ligne' | 'occupe';
  documents: {
    cni?: DocumentVerification;
    permis?: DocumentVerification;
    carte_grise?: DocumentVerification;
  };
  globalVerdict: 'en_attente' | 'valide' | 'refuse';
  lat: number;
  lng: number;
  coursesEffectuees: number;
}

export interface CourseMessage {
  id: string;
  courseId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  timestamp: string;
  containsNumber?: boolean;
}

export interface Course {
  id: string;
  passagerId: string;
  passagerName: string;
  passagerPhone: string;
  chauffeurId?: string;
  chauffeurName?: string;
  chauffeurPhone?: string;
  chauffeurPlaque?: string;
  chauffeurPhoto?: string;
  departNom: string;
  departLat: number;
  departLng: number;
  arriveeNom: string;
  arriveeLat: number;
  arriveeLng: number;
  prixPropose?: number;
  prixAccepte?: number;
  nbEchanges: number; // Max 5 messages with numbers
  nbPassagers: number;
  statut: CourseStatus;
  createdAt: string;
  completedAt?: string;
  noteDonnee?: number;
}

export interface Recu {
  id: string;
  courseId: string;
  trajet: string;
  date: string;
  montant: number | string;
  chauffeur: string;
  passager: string;
  mentions: string;
}

export interface Landmark {
  id: string;
  nom: string;
  quartier: string;
  lat: number;
  lng: number;
  type: 'marche' | 'pont' | 'universite' | 'aeroport' | 'quartier' | 'hopital';
}

export interface WeatherInfo {
  city: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  weatherCode: number;
  lastUpdated: string;
}
