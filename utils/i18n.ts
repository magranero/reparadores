import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext } from 'react';

export const SUPPORTED_LANGUAGES = {
  en: {
    name: 'English',
    nativeName: 'English',
  },
  es: {
    name: 'Spanish',
    nativeName: 'Español',
  },
};

const COUNTRY_LANGUAGE_MAP: { [key: string]: string } = {
  ES: 'es', // Spain
  MX: 'es', // Mexico
  AR: 'es', // Argentina
  CO: 'es', // Colombia
  PE: 'es', // Peru
  VE: 'es', // Venezuela
  CL: 'es', // Chile
  EC: 'es', // Ecuador
  GT: 'es', // Guatemala
  CU: 'es', // Cuba
};

const translations = {
  en: {
    // Profile
    profile: 'Profile',
    contactInformation: 'Contact Information',
    phone: 'Phone',
    email: 'Email',
    address: 'Address',
    preferences: 'Preferences',
    notifications: 'Notifications',
    darkMode: 'Dark Mode',
    language: 'Language',
    support: 'Support',
    privacyPolicy: 'Privacy Policy',
    helpSupport: 'Help & Support',
    aboutUs: 'About Us',
    logOut: 'Log Out',
    edit: 'Edit Profile',

    // Tab Navigation
    home: 'Home',
    diagnosis: 'Diagnosis',
    professionals: 'Professionals',
    quotes: 'Quotes',
    
    // Menu items and tabs
    all: 'All',
    accepted: 'Accepted',
    rejected: 'Rejected',

    // Home Screen
    whatNeedsFixing: 'What needs fixing today?',
    recentDiagnoses: 'Recent Diagnoses',
    viewAll: 'View All',
    startNewDiagnosis: 'Start New Diagnosis',
    serviceCategories: 'Service Categories',
    maintenanceTips: 'Maintenance Tips',
    findProfessionals: 'Find Professionals',
    needRepairExpert: 'Need a repair expert?',
    browseNetwork: 'Browse our network of verified professionals ready to help with your home repairs.',
    findPros: 'Find Pros',

    // Language Settings
    selectLanguage: 'Select Language',
    systemLanguage: 'System Language',
    changeLanguage: 'Change Language',
    languageChanged: 'Language Changed',

    // Common
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    new: 'New',
    more: 'more',
    continue: 'Continue',
    retake: 'Retake',
    submit: 'Submit',

    // Diagnosis Status
    completed: 'Completed',
    pending: 'Pending',
    archived: 'Archived',

    // Diagnosis Screen
    diagnoseHomeIssues: 'Diagnose Home Issues',
    useAIToDiagnose: 'Use our AI to diagnose home repair issues and get expert solutions.',
    searchDiagnoses: 'Search diagnoses...',
    camera: 'Camera',
    upload: 'Upload',
    voice: 'Voice',
    yourDiagnoses: 'Your Diagnoses',
    noDiagnosesFound: 'No diagnoses found. Start a new diagnosis to get help with your home repair issues.',
    notSureWhereToStart: 'Not sure where to start?',
    ourAICanHelp: 'Our AI can help diagnose common home issues. Take a photo, upload an image, or describe the problem.',
    getHelp: 'Get Help',

    // Camera and Voice
    loadingPermissions: 'Loading permissions...',
    needCameraPermission: 'We need your permission',
    grantCameraPermission: 'Please grant camera access to diagnose home repair issues with photos.',
    grantPermission: 'Grant Permission',
    pointAtIssue: 'Point at the area with the issue',
    photoTakenPrompt: 'Now you can explain the problem by voice after clicking continue',
    explainProblem: 'Explain the Problem',
    yourExplanation: 'Your Explanation',
    explainIssuePrompt: 'Explain what\'s wrong with the item in the photo. Be specific about the issue you\'re experiencing.',
    listening: 'Listening... Tap to pause',
    tapToSpeak: 'Tap to start speaking',
    speechNotSupported: 'Voice recognition is not supported on your device. You can still submit the photo without voice explanation.',
    initializingSpeech: 'Initializing voice recognition...',

    // Diagnosis Detail Screen
    diagnosisNotFound: 'Diagnosis Not Found',
    diagnosisNotFoundMessage: 'The diagnosis you\'re looking for doesn\'t exist or has been removed.',
    goBack: 'Go Back',
    analysisInProgress: 'Analysis in Progress',
    analysisProgressMessage: 'Our AI is analyzing your issue. Results will be available soon.',
    checkAnalysisStatus: 'Check Analysis Status',
    diagnosisResults: 'Diagnosis Results',
    identifiedIssue: 'Identified Issue',
    severity: 'SEVERITY',
    highSeverity: 'HIGH',
    mediumSeverity: 'MEDIUM',
    lowSeverity: 'LOW',
    recommendedActions: 'Recommended Actions',
    stepsToFix: 'Steps to Fix',
    requiredParts: 'Required Parts',
    partsList: 'Parts List',
    estimatedCost: 'Est. Cost:',
    availabilityStatus: 'Availability Status',
    inStock: 'In Stock',
    limited: 'Limited',
    outOfStock: 'Out of Stock',
    findProfessionalsButton: 'Find Professionals',
    share: 'Share',
    createdOn: 'Created on',

    // Result Screen
    analysisComplete: 'Analysis Complete',
    weIdentifiedIssue: 'We\'ve identified the issue and have recommendations for you.',
    imageProcessing: 'Image Processing',
    patternMatching: 'Pattern Matching',
    generatingSolutions: 'Generating Solutions',
    analyzingYourPhotos: 'Our AI is analyzing your photos to identify the issue and provide repair recommendations.',
    complete: 'Complete',
    shareResults: 'Share Results',
    tryAgain: 'Try Again',
    cancelAnalysis: 'Cancel Analysis',
    analysisFailed: 'Analysis Failed',
    analysisFailedMessage: 'We encountered an error while analyzing your image. Please try again with a clearer image or from a different angle.',

    // Professionals Screen
    connectWithTrustedExperts: 'Connect with trusted experts for your home repair needs.',
    searchByNameOrSpecialty: 'Search by name or specialty...',
    professionalsFound: 'professionals found',
    reviews: 'reviews',
    availableNow: 'Available Now',
    limitedAvailability: 'Limited Availability',
    unavailable: 'Unavailable',
    viewProfile: 'View Profile',
    contact: 'Contact',
    noProfessionalsFound: 'No professionals found. Try adjusting your search criteria.',
    clearFilters: 'Clear Filters',

    // Filter Screen
    filterProfessionals: 'Filter Professionals',
    distance: 'Distance',
    within5Miles: 'Within 5 miles',
    within10Miles: 'Within 10 miles',
    within25Miles: 'Within 25 miles',
    anyDistance: 'Any distance',
    minimumRating: 'Minimum Rating',
    priceRange: 'Price Range',
    budgetPrice: '$ (Budget)',
    averagePrice: '$$ (Average)',
    premiumPrice: '$$$ (Premium)',
    resetAll: 'Reset All',
    applyFilters: 'Apply Filters',

    // Quotes Screen
    quoteManagement: 'Quote Management',
    reviewAndManageQuotes: 'Review and manage quotes from professionals.',
    for: 'For',
    est: 'Est.',
    belowMarket: 'Below Market',
    marketRate: 'Market Rate',
    aboveMarket: 'Above Market',
    notAnalyzed: 'Not Analyzed',
    expires: 'Expires',
    noQuotesFound: 'No Quotes Found',
    noQuotesYet: "You don't have any quotes yet. Get a diagnosis first to receive quotes from professionals.",
    noFilteredQuotes: "You don't have any quotes with this status. Check the 'All' tab to see all your quotes."
  },
  es: {
    // Profile
    profile: 'Perfil',
    contactInformation: 'Información de Contacto',
    phone: 'Teléfono',
    email: 'Correo',
    address: 'Dirección',
    preferences: 'Preferencias',
    notifications: 'Notificaciones',
    darkMode: 'Modo Oscuro',
    language: 'Idioma',
    support: 'Soporte',
    privacyPolicy: 'Política de Privacidad',
    helpSupport: 'Ayuda y Soporte',
    aboutUs: 'Sobre Nosotros',
    logOut: 'Cerrar Sesión',
    edit: 'Editar Perfil',

    // Tab Navigation
    home: 'Inicio',
    diagnosis: 'Diagnóstico',
    professionals: 'Profesionales',
    quotes: 'Presupuestos',
    
    // Menu items and tabs
    all: 'Todos',
    accepted: 'Aceptados',
    rejected: 'Rechazados',

    // Home Screen
    whatNeedsFixing: '¿Qué necesita reparación hoy?',
    recentDiagnoses: 'Diagnósticos Recientes',
    viewAll: 'Ver Todo',
    startNewDiagnosis: 'Iniciar Nuevo Diagnóstico',
    serviceCategories: 'Categorías de Servicio',
    maintenanceTips: 'Consejos de Mantenimiento',
    findProfessionals: 'Encontrar Profesionales',
    needRepairExpert: '¿Necesitas un experto en reparaciones?',
    browseNetwork: 'Explora nuestra red de profesionales verificados listos para ayudar con las reparaciones de tu hogar.',
    findPros: 'Encontrar Profesionales',

    // Language Settings
    selectLanguage: 'Seleccionar Idioma',
    systemLanguage: 'Idioma del Sistema',
    changeLanguage: 'Cambiar Idioma',
    languageChanged: 'Idioma Cambiado',

    // Common
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    new: 'Nuevo',
    more: 'más',
    continue: 'Continuar',
    retake: 'Volver a Tomar',
    submit: 'Enviar',

    // Diagnosis Status
    completed: 'Completado',
    pending: 'Pendiente',
    archived: 'Archivado',

    // Diagnosis Screen
    diagnoseHomeIssues: 'Diagnosticar Problemas del Hogar',
    useAIToDiagnose: 'Utiliza nuestra IA para diagnosticar problemas de reparación del hogar y obtener soluciones de expertos.',
    searchDiagnoses: 'Buscar diagnósticos...',
    camera: 'Cámara',
    upload: 'Subir',
    voice: 'Voz',
    yourDiagnoses: 'Tus Diagnósticos',
    noDiagnosesFound: 'No se encontraron diagnósticos. Inicia un nuevo diagnóstico para obtener ayuda con los problemas de reparación de tu hogar.',
    notSureWhereToStart: '¿No estás seguro por dónde empezar?',
    ourAICanHelp: 'Nuestra IA puede ayudar a diagnosticar problemas comunes del hogar. Toma una foto, sube una imagen o describe el problema.',
    getHelp: 'Obtener Ayuda',

    // Camera and Voice
    loadingPermissions: 'Cargando permisos...',
    needCameraPermission: 'Necesitamos tu permiso',
    grantCameraPermission: 'Por favor, concede acceso a la cámara para diagnosticar problemas de reparación del hogar con fotos.',
    grantPermission: 'Conceder Permiso',
    pointAtIssue: 'Apunta al área con el problema',
    photoTakenPrompt: 'Ahora puedes explicar el problema por voz después de hacer clic en continuar',
    explainProblem: 'Explica el Problema',
    yourExplanation: 'Tu Explicación',
    explainIssuePrompt: 'Explica qué está mal con el elemento en la foto. Sé específico sobre el problema que estás experimentando.',
    listening: 'Escuchando... Toca para pausar',
    tapToSpeak: 'Toca para comenzar a hablar',
    speechNotSupported: 'El reconocimiento de voz no es compatible con tu dispositivo. Aún puedes enviar la foto sin explicación por voz.',
    initializingSpeech: 'Inicializando reconocimiento de voz...',

    // Diagnosis Detail Screen
    diagnosisNotFound: 'Diagnóstico No Encontrado',
    diagnosisNotFoundMessage: 'El diagnóstico que estás buscando no existe o ha sido eliminado.',
    goBack: 'Volver',
    analysisInProgress: 'Análisis en Progreso',
    analysisProgressMessage: 'Nuestra IA está analizando tu problema. Los resultados estarán disponibles pronto.',
    checkAnalysisStatus: 'Verificar Estado del Análisis',
    diagnosisResults: 'Resultados del Diagnóstico',
    identifiedIssue: 'Problema Identificado',
    severity: 'SEVERIDAD',
    highSeverity: 'ALTA',
    mediumSeverity: 'MEDIA',
    lowSeverity: 'BAJA',
    recommendedActions: 'Acciones Recomendadas',
    stepsToFix: 'Pasos para Reparar',
    requiredParts: 'Piezas Necesarias',
    partsList: 'Lista de Piezas',
    estimatedCost: 'Costo Est.:',
    availabilityStatus: 'Estado de Disponibilidad',
    inStock: 'En Stock',
    limited: 'Limitado',
    outOfStock: 'Agotado',
    findProfessionalsButton: 'Encontrar Profesionales',
    share: 'Compartir',
    createdOn: 'Creado el',

    // Result Screen
    analysisComplete: 'Análisis Completo',
    weIdentifiedIssue: 'Hemos identificado el problema y tenemos recomendaciones para ti.',
    imageProcessing: 'Procesando Imagen',
    patternMatching: 'Coincidencia de Patrones',
    generatingSolutions: 'Generando Soluciones',
    analyzingYourPhotos: 'Nuestra IA está analizando tus fotos para identificar el problema y proporcionar recomendaciones de reparación.',
    complete: 'Completo',
    shareResults: 'Compartir Resultados',
    tryAgain: 'Intentar de Nuevo',
    cancelAnalysis: 'Cancelar Análisis',
    analysisFailed: 'Análisis Fallido',
    analysisFailedMessage: 'Encontramos un error al analizar tu imagen. Por favor, intenta de nuevo con una imagen más clara o desde un ángulo diferente.',

    // Professionals Screen
    connectWithTrustedExperts: 'Conéctate con expertos confiables para tus necesidades de reparación en el hogar.',
    searchByNameOrSpecialty: 'Buscar por nombre o especialidad...',
    professionalsFound: 'profesionales encontrados',
    reviews: 'reseñas',
    availableNow: 'Disponible Ahora',
    limitedAvailability: 'Disponibilidad Limitada',
    unavailable: 'No Disponible',
    viewProfile: 'Ver Perfil',
    contact: 'Contactar',
    noProfessionalsFound: 'No se encontraron profesionales. Intenta ajustar tus criterios de búsqueda.',
    clearFilters: 'Limpiar Filtros',

    // Filter Screen
    filterProfessionals: 'Filtrar Profesionales',
    distance: 'Distancia',
    within5Miles: 'Dentro de 5 millas',
    within10Miles: 'Dentro de 10 millas',
    within25Miles: 'Dentro de 25 millas',
    anyDistance: 'Cualquier distancia',
    minimumRating: 'Calificación Mínima',
    priceRange: 'Rango de Precios',
    budgetPrice: '$ (Económico)',
    averagePrice: '$$ (Promedio)',
    premiumPrice: '$$$ (Premium)',
    resetAll: 'Restablecer Todo',
    applyFilters: 'Aplicar Filtros',

    // Quotes Screen
    quoteManagement: 'Gestión de Presupuestos',
    reviewAndManageQuotes: 'Revisa y gestiona presupuestos de profesionales.',
    for: 'Para',
    est: 'Est.',
    belowMarket: 'Bajo Mercado',
    marketRate: 'Precio de Mercado',
    aboveMarket: 'Sobre Mercado',
    notAnalyzed: 'Sin Analizar',
    expires: 'Vence',
    noQuotesFound: 'No Se Encontraron Presupuestos',
    noQuotesYet: "Aún no tienes presupuestos. Obtén un diagnóstico primero para recibir presupuestos de profesionales.",
    noFilteredQuotes: "No tienes presupuestos con este estado. Consulta la pestaña 'Todos' para ver todos tus presupuestos."
  },
};

const i18n = new I18n(translations);

i18n.defaultLocale = 'en';
i18n.enableFallback = true;

const deviceLocale = getLocales()[0];
const countryCode = deviceLocale.regionCode;
const initialLocale = COUNTRY_LANGUAGE_MAP[countryCode || ''] || deviceLocale.languageCode;

export const LanguageContext = createContext({
  locale: initialLocale,
  setLocale: (locale: string) => {},
  t: (key: string, params?: object) => '',
});

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}

export async function initializeI18n() {
  try {
    const savedLocale = await AsyncStorage.getItem('userLocale');
    i18n.locale = savedLocale || initialLocale;
    return i18n.locale;
  } catch (error) {
    console.error('Error loading saved locale:', error);
    i18n.locale = initialLocale;
    return initialLocale;
  }
}

export default i18n;