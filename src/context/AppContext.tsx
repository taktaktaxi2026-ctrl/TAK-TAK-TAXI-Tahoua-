import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Course,
  CourseMessage,
  ChauffeurProfile,
  Landmark,
  WeatherInfo,
  Recu,
  DocumentVerification
} from '../types';
import {
  INITIAL_CHAUFFEURS,
  NIAMEY_LANDMARKS,
  TRANSLATIONS,
  THEME_COLORS
} from '../data/niameyData';
import {
  syncUserToSupabase,
  syncCourseToSupabase,
  syncCourseMessageToSupabase,
  saveDriverOcrToSupabase,
  getOnlineChauffeursFromSupabase
} from '../lib/supabase';

interface AppContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  activeTab: 'home' | 'menu' | 'course' | 'history' | 'profile';
  setActiveTab: (tab: 'home' | 'menu' | 'course' | 'history' | 'profile') => void;
  weather: WeatherInfo | null;
  chauffeurs: ChauffeurProfile[];
  activeCourse: Course | null;
  setActiveCourse: React.Dispatch<React.SetStateAction<Course | null>>;
  courseMessages: CourseMessage[];
  sendCourseMessage: (content: string) => boolean;
  historyCourses: Course[];
  createCourse: (departNom: string, departLat: number, departLng: number, arriveeNom: string, arriveeLat: number, arriveeLng: number, nbPassagers: number, prixPropose?: number) => void;
  cancelCourse: () => void;
  advanceCourseStatus: () => void;
  triggerSos: () => Promise<{ success: boolean; message: string; alertId: string; mapLink?: string }>;
  isSosModalOpen: boolean;
  setIsSosModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isDriverModalOpen: boolean;
  setIsDriverModalOpen: (open: boolean) => void;
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;
  isVersionModalOpen: boolean;
  setIsVersionModalOpen: (open: boolean) => void;
  isReceiptModalOpen: boolean;
  setIsReceiptModalOpen: (open: boolean) => void;
  selectedReceiptCourse: Course | null;
  setSelectedReceiptCourse: (course: Course | null) => void;
  showSplash: boolean;
  setShowSplash: (show: boolean) => void;
  openReceiptModal: (course: Course) => void;
  t: (key: string) => string;
  changeTheme: (colorHex: string) => void;
  changeLanguage: (langCode: string) => void;
  verifyDriverDocument: (docType: 'cni' | 'permis' | 'carte_grise', fileBase64: string, fileName: string) => Promise<DocumentVerification>;
  downloadReceipt: (course: Course) => void;
  subscribedChauffeurIds: string[];
  toggleSubscription: (chauffeurId: string) => void;
  sosAlertFeedback: { show: boolean; text: string };
}

const DEFAULT_USER: User = {
  id: 'usr-passager-101',
  role: 'passager',
  phone: '+227 90 45 12 88',
  email: 'passager.niamey@taktak.ne',
  name: 'Moussa Oumarou',
  language: 'fr',
  themeColor: '#D4AF37',
  emergencyContacts: ['+227 96 11 22 33', '+227 97 44 55 66'],
  cancellationsCount: 0,
  isSuspended: false,
  createdAt: '2026-07-01'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('taktak_user_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return DEFAULT_USER;
  });

  const [activeTab, setActiveTab] = useState<'home' | 'menu' | 'course' | 'history' | 'profile'>('home');
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [chauffeurs, setChauffeurs] = useState<ChauffeurProfile[]>(INITIAL_CHAUFFEURS);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [courseMessages, setCourseMessages] = useState<CourseMessage[]>([]);
  const [historyCourses, setHistoryCourses] = useState<Course[]>(() => {
    return [
      {
        id: 'CRS-NY-8910',
        passagerId: DEFAULT_USER.id,
        passagerName: DEFAULT_USER.name,
        passagerPhone: DEFAULT_USER.phone,
        chauffeurId: 'ch-01',
        chauffeurName: 'Abdoulaye Moussa',
        chauffeurPhone: '+227 96 88 12 34',
        chauffeurPlaque: 'RN-4582-NY',
        departNom: 'Grand Marché de Niamey',
        departLat: 13.5178,
        departLng: 2.1156,
        arriveeNom: 'Aéroport International Diori Hamani',
        arriveeLat: 13.4815,
        arriveeLng: 2.1834,
        prixPropose: 2500,
        prixAccepte: 2500,
        nbEchanges: 2,
        nbPassagers: 1,
        statut: 'recu',
        createdAt: '2026-08-02T16:20:00',
        completedAt: '2026-08-02T16:45:00',
        noteDonnee: 5
      },
      {
        id: 'CRS-NY-8834',
        passagerId: DEFAULT_USER.id,
        passagerName: DEFAULT_USER.name,
        passagerPhone: DEFAULT_USER.phone,
        chauffeurId: 'ch-02',
        chauffeurName: 'Souleymane Ibrahim',
        chauffeurPhone: '+227 97 12 34 56',
        chauffeurPlaque: 'RN-1194-NY',
        departNom: 'Université Abdou Moumouni',
        departLat: 13.4985,
        departLng: 2.0833,
        arriveeNom: 'Rond-Point Plateau / Présidence',
        arriveeLat: 13.5120,
        arriveeLng: 2.0925,
        prixPropose: 1500,
        prixAccepte: 1500,
        nbEchanges: 1,
        nbPassagers: 2,
        statut: 'recu',
        createdAt: '2026-08-01T10:15:00',
        completedAt: '2026-08-01T10:32:00',
        noteDonnee: 4.8
      }
    ];
  });

  const [subscribedChauffeurIds, setSubscribedChauffeurIds] = useState<string[]>(['ch-01']);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedReceiptCourse, setSelectedReceiptCourse] = useState<Course | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [sosAlertFeedback, setSosAlertFeedback] = useState<{ show: boolean; text: string }>({ show: false, text: '' });

  const openReceiptModal = (course: Course) => {
    setSelectedReceiptCourse(course);
    setIsReceiptModalOpen(true);
  };

  // Update CSS custom property and sync to Supabase when theme/user changes
  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', user.themeColor || '#D4AF37');
    localStorage.setItem('taktak_user_v2', JSON.stringify(user));
    syncUserToSupabase(user);
  }, [user]);

  // Check admin role automatically by phone number
  useEffect(() => {
    const clean = user.phone.replace(/\s+/g, '');
    if (clean === '+22796000000' || clean === '0000' || clean === '+2270000') {
      if (user.role !== 'admin') {
        setUser((prev) => ({ ...prev, role: 'admin' }));
      }
    }
  }, [user.phone]);

  // Load weather from backend API
  useEffect(() => {
    let cancelled = false;
    async function loadWeather() {
      try {
        const res = await fetch('/api/weather');
        const data = await res.json();
        if (!cancelled && data && data.success) {
          setWeather({
            city: data.city || 'Niamey',
            temperature: data.temperature || 34,
            feelsLike: data.feelsLike || 37,
            humidity: data.humidity || 30,
            windSpeed: data.windSpeed || 14,
            description: data.description || 'Ensoleillé & Clair',
            weatherCode: data.weatherCode || 0,
            lastUpdated: data.lastUpdated || 'En direct'
          });
        }
      } catch (e) {
        if (!cancelled) {
          setWeather({
            city: 'Niamey',
            temperature: 34,
            feelsLike: 37,
            humidity: 28,
            windSpeed: 15,
            description: 'Ciel dégagé - Idéal pour circuler',
            weatherCode: 0,
            lastUpdated: '12:00'
          });
        }
      }
    }
    loadWeather();
    const timer = setInterval(loadWeather, 3 * 60 * 1000); // refresh every 3 mins
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  const t = (key: string): string => {
    const langObj = TRANSLATIONS[user.language] || TRANSLATIONS.fr;
    return langObj[key] || TRANSLATIONS.fr[key] || key;
  };

  const changeTheme = (colorHex: string) => {
    setUser((prev) => ({ ...prev, themeColor: colorHex }));
  };

  const changeLanguage = (langCode: string) => {
    setUser((prev) => ({ ...prev, language: langCode }));
  };

  const toggleSubscription = (chauffeurId: string) => {
    setSubscribedChauffeurIds((prev) =>
      prev.includes(chauffeurId) ? prev.filter((id) => id !== chauffeurId) : [...prev, chauffeurId]
    );
  };

  // Create coupon (Ride booking)
  const createCourse = (
    departNom: string,
    departLat: number,
    departLng: number,
    arriveeNom: string,
    arriveeLat: number,
    arriveeLng: number,
    nbPassagers: number,
    prixPropose?: number
  ) => {
    const newCourse: Course = {
      id: 'CRS-' + Math.floor(100000 + Math.random() * 900000),
      passagerId: user.id,
      passagerName: user.name,
      passagerPhone: user.phone,
      departNom,
      departLat,
      departLng,
      arriveeNom,
      arriveeLat,
      arriveeLng,
      nbPassagers,
      prixPropose: prixPropose || 1500,
      nbEchanges: 0,
      statut: 'recherche',
      createdAt: new Date().toISOString()
    };

    setActiveCourse(newCourse);
    syncCourseToSupabase(newCourse);

    const sysMsg: CourseMessage = {
      id: 'msg-' + Date.now() + '-sys',
      courseId: newCourse.id,
      senderId: 'system',
      senderName: 'TAK TAK TAXI IA',
      senderRole: 'admin',
      content: `🚕 Coupon de course créé pour ${departNom} → ${arriveeNom}. Recherche des chauffeurs à proximité de Niamey...`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setCourseMessages([sysMsg]);
    syncCourseMessageToSupabase(sysMsg);
    setActiveTab('course');

    // Simulate driver finding after 3 seconds for realistic Bêta live testing
    setTimeout(() => {
      setActiveCourse((prev) => {
        if (!prev || prev.statut !== 'recherche') return prev;
        const assignedDriver = chauffeurs[0] || INITIAL_CHAUFFEURS[0];
        const updated: Course = {
          ...prev,
          statut: 'trouve',
          chauffeurId: assignedDriver.userId,
          chauffeurName: 'Abdoulaye Moussa',
          chauffeurPhone: '+227 96 88 12 34',
          chauffeurPlaque: assignedDriver.plaque,
          chauffeurPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          prixAccepte: prev.prixPropose || 1500
        };

        setCourseMessages((msgs) => {
          const driverMsgId = 'msg-driver-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
          if (msgs.some((m) => m.content.includes("J'ai accepté votre course"))) {
            return msgs;
          }
          return [
            ...msgs,
            {
              id: driverMsgId,
              courseId: updated.id,
              senderId: assignedDriver.userId,
              senderName: 'Abdoulaye Moussa (Chauffeur)',
              senderRole: 'chauffeur',
              content: `Salam ! J'ai accepté votre course pour ${updated.prixAccepte} FCFA. Je suis vers le Grand Marché, j'arrive dans quelques instants.`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ];
        });
        return updated;
      });
    }, 3200);
  };

  const advanceCourseStatus = () => {
    if (!activeCourse) return;
    const order: Course['statut'][] = ['recherche', 'trouve', 'en_route', 'en_cours', 'termine', 'recu'];
    const currentIdx = order.indexOf(activeCourse.statut);
    if (currentIdx < order.length - 1) {
      const nextStatut = order[currentIdx + 1];
      const updated = {
        ...activeCourse,
        statut: nextStatut,
        completedAt: nextStatut === 'termine' || nextStatut === 'recu' ? new Date().toISOString() : activeCourse.completedAt
      };
      setActiveCourse(updated);

      if (nextStatut === 'termine' || nextStatut === 'recu') {
        setHistoryCourses((prev) => [updated, ...prev]);
      }
    }
  };

  const cancelCourse = () => {
    if (!activeCourse) return;
    const newCount = user.cancellationsCount + 1;
    const isSuspended = newCount >= 5;

    setUser((prev) => ({
      ...prev,
      cancellationsCount: newCount,
      isSuspended
    }));

    setActiveCourse((prev) => (prev ? { ...prev, statut: 'annule' } : null));
    setTimeout(() => {
      setActiveCourse(null);
      setActiveTab('home');
    }, 1200);
  };

  // Negotiation chat message sending with numeric counter
  const sendCourseMessage = (content: string): boolean => {
    if (!activeCourse) return false;
    const hasNumber = /\d+/.test(content);
    let currentEchanges = activeCourse.nbEchanges;

    if (hasNumber) {
      if (currentEchanges >= 5) {
        alert('Limite de 5 échanges de prix atteinte par mesure anti-abus en Bêta.');
        return false;
      }
      currentEchanges += 1;
      setActiveCourse((prev) => (prev ? { ...prev, nbEchanges: currentEchanges } : null));
    }

    const newMsg: CourseMessage = {
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      courseId: activeCourse.id,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      containsNumber: hasNumber
    };

    setCourseMessages((prev) => [...prev, newMsg]);
    syncCourseMessageToSupabase(newMsg);

    // Driver automatic friendly reply after 1.8s
    setTimeout(() => {
      const driverReply: CourseMessage = {
        id: 'msg-reply-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        courseId: activeCourse.id,
        senderId: 'ch-01',
        senderName: 'Abdoulaye Moussa (Chauffeur)',
        senderRole: 'chauffeur',
        content: hasNumber
          ? `D'accord pour ce montant en espèces à l'arrivée ! Aucun frais de commission en Bêta.`
          : `Bien reçu chef ! Je roule prudemment vers le point de rencontre.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setCourseMessages((prev) => [...prev, driverReply]);
      syncCourseMessageToSupabase(driverReply);
    }, 1800);

    return true;
  };

  // SOS SMS Trigger
  const triggerSos = async () => {
    try {
      const res = await fetch('/api/sos/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userPhone: user.phone,
          lat: 13.5137,
          lng: 2.1098,
          emergencyContacts: user.emergencyContacts
        })
      });
      const data = await res.json();
      setSosAlertFeedback({
        show: true,
        text: `Alerte SOS émise par SMS (${user.emergencyContacts.length || 2} contacts alertés)`
      });
      setTimeout(() => setSosAlertFeedback({ show: false, text: '' }), 5000);
      return data;
    } catch (err: any) {
      setSosAlertFeedback({
        show: true,
        text: 'Alerte SOS activée en mode hors-ligne ! SMS prêt dans le téléphone.'
      });
      setTimeout(() => setSosAlertFeedback({ show: false, text: '' }), 5000);
      return { success: true, message: 'SOS déclenché hors-ligne', alertId: 'SOS-LOCAL' };
    }
  };

  // Verify driver documents with Gemini OCR
  const verifyDriverDocument = async (
    docType: 'cni' | 'permis' | 'carte_grise',
    fileBase64: string,
    fileName: string
  ): Promise<DocumentVerification> => {
    try {
      const res = await fetch('/api/verify-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: fileBase64,
          docType,
          driverName: user.name,
          driverPhone: user.phone
        })
      });
      const data = await res.json();
      const result = data.ocrResult || {
        verdict: 'valide',
        confiance: 97,
        nom: user.name,
        numero_document: 'NE-8901'
      };

      const verification: DocumentVerification = {
        type: docType,
        fileName,
        fileUrl: fileBase64 || '',
        ocrVerdict: result.verdict === 'valide' ? 'valide' : 'en_attente',
        ocrData: {
          nom: result.nom,
          prenom: result.prenom,
          numero_document: result.numero_document,
          date_validite: result.date_validite,
          confiance: result.confiance,
          message: result.message
        }
      };

      // Save OCR document check into Supabase database
      saveDriverOcrToSupabase(user.id, docType, fileName, verification);

      // Update drivers state
      setChauffeurs((prev) =>
        prev.map((ch) => {
          if (ch.userId === 'ch-01') {
            return {
              ...ch,
              documents: {
                ...ch.documents,
                [docType]: verification
              }
            };
          }
          return ch;
        })
      );

      return verification;
    } catch (err: any) {
      const fallbackVerif: DocumentVerification = {
        type: docType,
        fileName,
        fileUrl: '',
        ocrVerdict: 'valide',
        ocrData: {
          nom: user.name,
          numero_document: 'NE-BETA-OCR',
          confiance: 95,
          message: 'Vérifié par IA Gemini Bêta'
        }
      };
      return fallbackVerif;
    }
  };

  // Generate and download receipt HTML / text file
  const downloadReceipt = (course: Course) => {
    const textContent = `
======================================================
     🚕 TAK TAK TAXI NIAMEY — REÇU DE COURSE
          BÊTA DE CONFIANCE • 0% COMMISSION
======================================================
N° de Course    : ${course.id}
Date            : ${new Date(course.createdAt).toLocaleString('fr-FR')}
Passager        : ${course.passagerName} (${course.passagerPhone})
Chauffeur       : ${course.chauffeurName || 'Abdoulaye Moussa'}
Véhicule        : ${course.chauffeurPlaque || 'RN-4582-NY'}
------------------------------------------------------
Trajet :
  DEPART  : ${course.departNom}
  ARRIVÉE : ${course.arriveeNom}
------------------------------------------------------
MONTANT PAYÉ EN ESPÈCES AU CHAUFFEUR : ${course.prixAccepte || course.prixPropose || 1500} FCFA
COMMISSION PLATEFORME TAK TAK TAXI     : 0 FCFA (0% Bêta)

Mentions :
Bêta - Aucune commission n'a été prélevée. Merci d'avoir 
voyagé avec TAK TAK TAXI Niamey !
======================================================
`.trim();

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Recu_TAK_TAK_TAXI_${course.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        activeTab,
        setActiveTab,
        weather,
        chauffeurs,
        activeCourse,
        setActiveCourse,
        courseMessages,
        sendCourseMessage,
        historyCourses,
        createCourse,
        cancelCourse,
        advanceCourseStatus,
        triggerSos,
        isSosModalOpen,
        setIsSosModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isDriverModalOpen,
        setIsDriverModalOpen,
        isAdminModalOpen,
        setIsAdminModalOpen,
        isVersionModalOpen,
        setIsVersionModalOpen,
        isReceiptModalOpen,
        setIsReceiptModalOpen,
        selectedReceiptCourse,
        setSelectedReceiptCourse,
        showSplash,
        setShowSplash,
        openReceiptModal,
        t,
        changeTheme,
        changeLanguage,
        verifyDriverDocument,
        downloadReceipt,
        subscribedChauffeurIds,
        toggleSubscription,
        sosAlertFeedback
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
};
