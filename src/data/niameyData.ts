import { Landmark, ChauffeurProfile } from '../types';

export const NIAMEY_CENTER = { lat: 13.5137, lng: 2.1098 };

export const NIAMEY_LANDMARKS: Landmark[] = [
  {
    id: 'grand-marche',
    nom: 'Grand Marché de Niamey',
    quartier: 'Centre-Ville',
    lat: 13.5178,
    lng: 2.1156,
    type: 'marche'
  },
  {
    id: 'pont-kennedy',
    nom: 'Pont Kennedy',
    quartier: 'Rive Gauche - Fleuve Niger',
    lat: 13.5042,
    lng: 2.1065,
    type: 'pont'
  },
  {
    id: 'universite',
    nom: 'Université Abdou Moumouni',
    quartier: 'Rive Droite',
    lat: 13.4985,
    lng: 2.0833,
    type: 'universite'
  },
  {
    id: 'harobanda',
    nom: 'Harobanda (Rive Droite)',
    quartier: 'Harobanda',
    lat: 13.5015,
    lng: 2.0945,
    type: 'quartier'
  },
  {
    id: 'niamey-2000',
    nom: 'Niamey 2000',
    quartier: 'Quartier Est',
    lat: 13.5412,
    lng: 2.1645,
    type: 'quartier'
  },
  {
    id: 'aeroport',
    nom: 'Aéroport International Diori Hamani',
    quartier: 'Aéroport',
    lat: 13.4815,
    lng: 2.1834,
    type: 'aeroport'
  },
  {
    id: 'katako',
    nom: 'Marché de Katako',
    quartier: 'Katako',
    lat: 13.5284,
    lng: 2.0991,
    type: 'marche'
  },
  {
    id: 'plateau',
    nom: 'Rond-Point Plateau / Présidence',
    quartier: 'Plateau',
    lat: 13.5120,
    lng: 2.0925,
    type: 'quartier'
  },
  {
    id: 'goudel',
    nom: 'Goudel - Bord de Fleuve',
    quartier: 'Goudel',
    lat: 13.5350,
    lng: 2.0710,
    type: 'quartier'
  }
];

export const THEME_COLORS = [
  { id: 'or', name: 'Or Niamey (1xBet)', color: '#D4AF37' },
  { id: 'bleu', name: 'Bleu Fleuve Niger', color: '#2196F3' },
  { id: 'vert', name: 'Vert Sahara', color: '#4CAF50' },
  { id: 'rouge', name: 'Rouge Ténéré', color: '#FF1744' },
  { id: 'violet', name: 'Violet Agadez', color: '#9C27B0' },
  { id: 'orange', name: 'Orange Sahel', color: '#FF9800' },
  { id: 'turquoise', name: 'Turquoise Oasis', color: '#00BCD4' },
  { id: 'rose', name: 'Rose Hibiscus', color: '#E91E63' },
  { id: 'gris', name: 'Gris Métal', color: '#9E9E9E' },
  { id: 'blanc', name: 'Blanc Pur', color: '#FFFFFF' }
];

export const SUPPORTED_LANGUAGES = [
  { code: 'fr', label: 'Français', native: 'Français' },
  { code: 'ha', label: 'Haoussa', native: 'Hausa' },
  { code: 'za', label: 'Zarma', native: 'Zarma / Songhaï' },
  { code: 'pe', label: 'Peul / Fulfulde', native: 'Fulfulde' },
  { code: 'tm', label: 'Touareg / Tamasheq', native: 'Tamasheq' },
  { code: 'en', label: 'Anglais', native: 'English' },
  { code: 'ar', label: 'Arabe', native: 'العربية' },
  { code: 'yo', label: 'Yoruba', native: 'Yorùbá' }
];

export const INITIAL_CHAUFFEURS: ChauffeurProfile[] = [
  {
    userId: 'ch-01',
    plaque: 'RN-4582-NY',
    vehiculeModele: 'Toyota Corolla Jaune & Blanc',
    note: 4.9,
    statut: 'en_ligne',
    lat: 13.5185,
    lng: 2.1120,
    coursesEffectuees: 142,
    globalVerdict: 'valide',
    documents: {
      cni: {
        type: 'cni',
        fileName: 'CNI_Abdoul_Moussa.jpg',
        fileUrl: '',
        ocrVerdict: 'valide',
        ocrData: {
          nom: 'MOUSSA',
          prenom: 'Abdoulaye',
          numero_document: 'NE-882103',
          date_validite: '2031-08-10',
          confiance: 99
        }
      },
      permis: {
        type: 'permis',
        fileName: 'Permis_Abdoul.jpg',
        fileUrl: '',
        ocrVerdict: 'valide',
        ocrData: {
          nom: 'MOUSSA',
          prenom: 'Abdoulaye',
          numero_document: 'PC-2018-994',
          date_validite: '2029-05-20',
          confiance: 98
        }
      },
      carte_grise: {
        type: 'carte_grise',
        fileName: 'CG_Corolla.jpg',
        fileUrl: '',
        ocrVerdict: 'valide',
        ocrData: {
          nom: 'MOUSSA',
          prenom: 'Abdoulaye',
          numero_document: 'RN-4582-NY',
          date_validite: '2028-11-01',
          confiance: 97
        }
      }
    }
  },
  {
    userId: 'ch-02',
    plaque: 'RN-1194-NY',
    vehiculeModele: 'Renault Logan Jaune Taxi',
    note: 4.8,
    statut: 'en_ligne',
    lat: 13.5045,
    lng: 2.0990,
    coursesEffectuees: 89,
    globalVerdict: 'valide',
    documents: {
      cni: {
        type: 'cni',
        fileName: 'cni_ibrahim.jpg',
        fileUrl: '',
        ocrVerdict: 'valide',
        ocrData: {
          nom: 'IBRAHIM',
          prenom: 'Souleymane',
          numero_document: 'NE-440192',
          date_validite: '2030-01-15',
          confiance: 96
        }
      }
    }
  },
  {
    userId: 'ch-03',
    plaque: 'RN-7731-NY',
    vehiculeModele: 'Peugeot 307 Jaune Niamey',
    note: 4.7,
    statut: 'en_ligne',
    lat: 13.5290,
    lng: 2.1240,
    coursesEffectuees: 64,
    globalVerdict: 'valide',
    documents: {}
  },
  {
    userId: 'ch-04',
    plaque: 'RN-9012-NY',
    vehiculeModele: 'Nissan Sunny Taxi Niamey',
    note: 5.0,
    statut: 'en_ligne',
    lat: 13.4990,
    lng: 2.0860,
    coursesEffectuees: 210,
    globalVerdict: 'valide',
    documents: {}
  }
];

export const TRANSLATIONS: Record<string, Record<string, string>> = {
  fr: {
    app_title: 'TAK TAK TAXI NIAMEY',
    beta_badge: 'BÊTA DE CONFIANCE • 0% COMMISSION',
    tab_home: 'Accueil',
    tab_menu: 'Réserver',
    tab_course: 'Suivi',
    tab_history: 'Historique',
    tab_profile: 'Profil',
    reserver_cta: 'Réserver un taxi maintenant',
    sos_button: 'SOS URGENCE',
    sos_desc: 'Envoie un SMS d\'alerte avec votre position GPS à vos 2 contacts d\'urgence.',
    depart_label: 'Lieu de Départ (Niamey)',
    arrivee_label: 'Lieu d\'Arrivee (Niamey)',
    nb_passagers: 'Nombre de passagers',
    prix_label: 'Prix proposé (FCFA - Facultatif en Bêta)',
    creer_coupon: 'CRÉER LE COUPON (Chercher Chauffeur)',
    commission_info: 'En Bêta de Confiance, le paiement se fait directement en espèces avec le chauffeur. 0% de commission est prélevé par la plateforme.',
    negociation_limite: 'Négociation : 5 échanges de prix maximum autorisés par course.',
    statut_recherche: 'Recherche de chauffeur en cours...',
    statut_trouve: 'Chauffeur trouvé ! En route vers vous.',
    statut_en_route: 'Chauffeur en approche (moins de 10 min)',
    statut_en_cours: 'Course en cours vers destination',
    statut_termine: 'Course terminée',
    statut_recu: 'Reçu émis',
    annuler_course: 'Annuler la course',
    cancel_warning: 'Attention : À 5 annulations, votre compte sera temporairement suspendu.',
    document_check_title: 'Vérification IA Gemini OCR',
    document_check_desc: 'Pour votre sécurité, téléchargez CNI, Permis de Conduire et Carte Grise pour validation instantanée.',
    admin_title: 'Superviseur TAK TAK TAXI (Admin)',
    admin_desc: 'Accès superviseur caché (numéro authentifié)',
    telecharger_recu: 'Télécharger le reçu Bêta',
  },
  ha: {
    app_title: 'TAK TAK TAXI NIAMEY',
    beta_badge: 'BETA ME AMINCI • 0% HARKAR KUDI',
    tab_home: 'Gida',
    tab_menu: 'Yi Siyayya',
    tab_course: 'Bin Didede',
    tab_history: 'Tarihi',
    tab_profile: 'Bayani',
    reserver_cta: 'Nemo Taksi Yanzu',
    sos_button: 'SOS TAIMAKO',
    sos_desc: 'Aika da SMS tare da waje da kuke ga mutane 2 na gaggawa.',
    depart_label: 'Wurin Tashi (Niamey)',
    arrivee_label: 'Wurin Zuwa (Niamey)',
    nb_passagers: 'Yawan Fasinjoji',
    prix_label: 'Farashin Talla (FCFA - Na Zabi)',
    creer_coupon: 'NEMO CHAUFFEUR',
    commission_info: 'Siyan kai tsaye a hannun Chauffeur. 0% kudin kamfani.',
    negociation_limite: 'Tattaunawa : Saƙonni 5 kacal aka yarda a kan farashi.',
    statut_recherche: 'Ana neman direban taksi...',
    statut_trouve: 'An sami direba ! Yana tafe.',
    statut_en_route: 'Direba yana zuwa (minti 10)',
    statut_en_cours: 'Ana cikin tafiya',
    statut_termine: 'Tafiya ta cika',
    statut_recu: 'An ba da rasiti',
    annuler_course: 'Fasa tafiyar',
    cancel_warning: 'Lura : Idan ka fasa sau 5 za a dakatar da asusunka.',
    document_check_title: 'Binciken Gemini OCR IA',
    document_check_desc: 'Loda CNI, Leshi da Katin Mota domin tabbatarwa.',
    admin_title: 'Sufeto TAK TAK TAXI (Admin)',
    admin_desc: 'Hanyar musamman ga jami\'i',
    telecharger_recu: 'Sauke Rasiti',
  },
  za: {
    app_title: 'TAK TAK TAXI NIAMEY',
    beta_badge: 'BETA SAREY • 0% KOMISON',
    tab_home: 'Koyo',
    tab_menu: 'Dondon',
    tab_course: 'Goyey',
    tab_history: 'Kondoo',
    tab_profile: 'Bora',
    reserver_cta: 'Ciri Taxi Sohon',
    sos_button: 'SOS TAAKO',
    sos_desc: 'Sanba SMS ne boro 2 kan ga baa taako.',
    depart_label: 'Tunyan Do (Niamey)',
    arrivee_label: 'Koyyan Do (Niamey)',
    nb_passagers: 'Borey Ibiize',
    prix_label: 'Nooru (FCFA)',
    creer_coupon: 'CEE CHAUFFEUR',
    commission_info: 'Nooru bashi ga ci chauffeur ga. 0% komison beta.',
    negociation_limite: 'Sannno 5 hiino fo nooru.',
    statut_recherche: 'Ir ga cee chauffeur...',
    statut_trouve: 'Chauffeur duu ! A ga kaa.',
    statut_en_route: 'Chauffeur ga kaa (mintiyey 10)',
    statut_en_cours: 'Goy gaa',
    statut_termine: 'Goy ben',
    statut_recu: 'Recu nooya',
    annuler_course: 'Kayandi',
    cancel_warning: 'Hanga: Kayandi soro 5 ga kamba bora.',
    document_check_title: 'Gemini OCR IA Tabbatari',
    document_check_desc: 'Dambu CNI da permis ka tabbatari.',
    admin_title: 'Sufeto TAK TAK TAXI (Admin)',
    admin_desc: 'Sufeto dooni',
    telecharger_recu: 'Ziiji Recu',
  },
  en: {
    app_title: 'TAK TAK TAXI NIAMEY',
    beta_badge: 'TRUST BETA • 0% COMMISSION',
    tab_home: 'Home',
    tab_menu: 'Book Ride',
    tab_course: 'Track',
    tab_history: 'History',
    tab_profile: 'Profile',
    reserver_cta: 'Book a Taxi Now',
    sos_button: 'SOS EMERGENCY',
    sos_desc: 'Sends SMS alert with your GPS coordinates to 2 emergency contacts.',
    depart_label: 'Pickup Location (Niamey)',
    arrivee_label: 'Dropoff Location (Niamey)',
    nb_passagers: 'Number of passengers',
    prix_label: 'Proposed Price (FCFA - Optional)',
    creer_coupon: 'CREATE COUPON (Find Driver)',
    commission_info: 'In Trust Beta, payment is direct cash to the driver. 0% commission is taken.',
    negociation_limite: 'Negotiation limit: max 5 messages with a numeric price per ride.',
    statut_recherche: 'Searching for nearby drivers...',
    statut_trouve: 'Driver found! On the way.',
    statut_en_route: 'Driver approaching (< 10 min)',
    statut_en_cours: 'Ride in progress',
    statut_termine: 'Ride completed',
    statut_recu: 'Receipt generated',
    annuler_course: 'Cancel Ride',
    cancel_warning: 'Warning: 5 cancellations will temporarily suspend your account.',
    document_check_title: 'Gemini OCR Verification',
    document_check_desc: 'Upload ID, Driver License, and Vehicle Reg for instant AI validation.',
    admin_title: 'TAK TAK TAXI Supervisor (Admin)',
    admin_desc: 'Hidden admin dashboard access',
    telecharger_recu: 'Download Beta Receipt',
  }
};
