import { createClient } from '@supabase/supabase-js';
import { User, ChauffeurProfile, Course, CourseMessage, Recu, DocumentVerification } from '../types';

// Safely resolve and validate Supabase URL and Key
function getValidSupabaseUrl(): string {
  const fallback = 'https://taktaktaxi.supabase.co';
  try {
    const raw = (import.meta as any).env?.VITE_SUPABASE_URL;
    if (!raw || typeof raw !== 'string') return fallback;
    const trimmed = raw.trim();
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      return fallback;
    }
    const parsed = new URL(trimmed);
    return parsed.origin || fallback;
  } catch {
    return fallback;
  }
}

function getValidSupabaseKey(): string {
  const fallbackKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRha3Rha3RheGkiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcwMDA0ODAwMCwiZXhwIjoyMDE1NjI0MDAwfQ.demo_taktaktaxi_key';
  try {
    const raw = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;
    if (!raw || typeof raw !== 'string') return fallbackKey;
    const trimmed = raw.trim();
    if (trimmed.length < 10 || trimmed.includes('your-anon-key')) return fallbackKey;
    return trimmed;
  } catch {
    return fallbackKey;
  }
}

const supabaseUrl = getValidSupabaseUrl();
const supabaseAnonKey = getValidSupabaseKey();

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

/**
 * UTILITY FUNCTIONS FOR TAK TAK TAXI SUPABASE SYNC
 */

// 1. Fetch & Sync User
export async function syncUserToSupabase(user: User): Promise<boolean> {
  try {
    const { error } = await supabase.from('users').upsert({
      id: user.id,
      role: user.role,
      phone: user.phone,
      email: user.email || null,
      name: user.name,
      avatar_url: user.avatarUrl || null,
      language: user.language,
      theme_color: user.themeColor,
      emergency_contacts: user.emergencyContacts,
      cancellations_count: user.cancellationsCount,
      is_suspended: user.isSuspended || false,
      updated_at: new Date().toISOString()
    });
    return !error;
  } catch (err) {
    return false;
  }
}

// 2. Fetch Online Chauffeurs around Niamey
export async function getOnlineChauffeursFromSupabase(): Promise<ChauffeurProfile[] | null> {
  try {
    const { data, error } = await supabase
      .from('chauffeurs')
      .select('*, users!inner(*)')
      .eq('statut', 'en_ligne');

    if (error || !data || data.length === 0) {
      return null;
    }

    return data.map((item: any) => ({
      userId: item.user_id,
      plaque: item.plaque,
      vehiculeModele: item.vehicule_modele,
      note: Number(item.note) || 4.9,
      statut: item.statut,
      documents: item.documents || {},
      globalVerdict: item.global_verdict || 'valide',
      lat: Number(item.lat) || 13.5137,
      lng: Number(item.lng) || 2.1098,
      coursesEffectuees: item.courses_effectuees || 0
    }));
  } catch (err) {
    return null;
  }
}

// 3. Save or Sync Course in Supabase
export async function syncCourseToSupabase(course: Course): Promise<boolean> {
  try {
    const { error } = await supabase.from('courses').upsert({
      id: course.id,
      passager_id: course.passagerId,
      passager_name: course.passagerName,
      passager_phone: course.passagerPhone,
      chauffeur_id: course.chauffeurId || null,
      chauffeur_name: course.chauffeurName || null,
      chauffeur_phone: course.chauffeurPhone || null,
      chauffeur_plaque: course.chauffeurPlaque || null,
      depart_nom: course.departNom,
      depart_lat: course.departLat,
      depart_lng: course.departLng,
      arrivee_nom: course.arriveeNom,
      arrivee_lat: course.arriveeLat,
      arrivee_lng: course.arriveeLng,
      prix_propose: course.prixPropose || null,
      prix_accepte: course.prixAccepte || null,
      nb_echanges: course.nbEchanges || 0,
      nb_passagers: course.nbPassagers || 1,
      statut: course.statut,
      note_donnee: course.noteDonnee || null,
      created_at: course.createdAt || new Date().toISOString(),
      completed_at: course.completedAt || null
    });
    return !error;
  } catch (err) {
    return false;
  }
}

// 4. Sync Live Negotiation Chat Message
export async function syncCourseMessageToSupabase(msg: CourseMessage): Promise<boolean> {
  try {
    const { error } = await supabase.from('course_messages').upsert({
      id: msg.id,
      course_id: msg.courseId,
      sender_id: msg.senderId,
      sender_name: msg.senderName,
      sender_role: msg.senderRole,
      content: msg.content,
      contains_number: msg.containsNumber || false,
      created_at: new Date().toISOString()
    });
    return !error;
  } catch (err) {
    return false;
  }
}

// 5. Sync Recu (Receipt)
export async function syncRecuToSupabase(recu: Recu): Promise<boolean> {
  try {
    const { error } = await supabase.from('recus').upsert({
      id: recu.id,
      course_id: recu.courseId,
      trajet: recu.trajet,
      date: recu.date,
      montant: typeof recu.montant === 'number' ? recu.montant : parseInt(String(recu.montant)) || 1500,
      chauffeur: recu.chauffeur,
      passager: recu.passager,
      mentions: recu.mentions
    });
    return !error;
  } catch (err) {
    return false;
  }
}

// 6. Save Driver Document OCR Gemini Verification Result
export async function saveDriverOcrToSupabase(
  driverId: string,
  docType: 'cni' | 'permis' | 'carte_grise',
  fileName: string,
  verification: DocumentVerification
): Promise<boolean> {
  try {
    const { error } = await supabase.from('documents_ocr').insert({
      driver_id: driverId,
      doc_type: docType,
      file_name: fileName,
      ocr_verdict: verification.ocrVerdict,
      ocr_data: verification.ocrData
    });
    return !error;
  } catch (err) {
    return false;
  }
}

// 7. Fetch Latest App Version from Supabase
export async function getLatestAppVersion() {
  try {
    const { data, error } = await supabase
      .from('versions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return { version: '1.0.0-beta.niamey', download_url: 'https://taktak.ne/app.apk', mandatory: false };
    }
    return data;
  } catch (err) {
    return { version: '1.0.0-beta.niamey', download_url: 'https://taktak.ne/app.apk', mandatory: false };
  }
}
