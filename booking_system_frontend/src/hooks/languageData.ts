// Language types, constants, and translation data.
// Kept in a plain .ts file so react-refresh/only-export-components
// does not fire on the .tsx provider file.

export type Language = 'en' | 'fr' | 'nl' | 'be';

export const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
  { code: 'be', label: 'Vlaams', flag: '🇧🇪' },
];

export interface HomeTranslations {
  heroTitle1: string;
  heroTitle2: string;
  heroSubtitle: string;
  exploreFlights: string;
  learnMore: string;
  whyChoose: string;
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;
  feature4Title: string;
  feature4Desc: string;
  exploreDestinations: string;
  destinationLabel: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton: string;
}

export const translations: Record<Language, HomeTranslations> = {
  en: {
    heroTitle1: 'Journey Beyond',
    heroTitle2: 'The Stars',
    heroSubtitle:
      'Experience the future of space travel with Galaxium. Book your interplanetary flight and explore the wonders of our solar system.',
    exploreFlights: 'Explore Flights',
    learnMore: 'Learn More',
    whyChoose: 'Why Choose Galaxium?',
    feature1Title: 'Interplanetary Travel',
    feature1Desc: 'Explore destinations across the solar system with our state-of-the-art spacecraft.',
    feature2Title: 'Multiple Destinations',
    feature2Desc: 'From Mars to Europa, discover new worlds and book your journey today.',
    feature3Title: 'Safe & Secure',
    feature3Desc: 'Your safety is our priority with advanced navigation and life support systems.',
    feature4Title: 'Instant Booking',
    feature4Desc: 'Book your flight in seconds and receive instant confirmation.',
    exploreDestinations: 'Explore Our Destinations',
    destinationLabel: 'Destination',
    ctaTitle: 'Ready for Your Space Adventure?',
    ctaSubtitle:
      'Join thousands of space travelers who have already booked their journey to the stars. Your adventure awaits!',
    ctaButton: 'Book Your Flight Now',
  },
  fr: {
    heroTitle1: 'Voyagez Au-Delà',
    heroTitle2: 'Des Étoiles',
    heroSubtitle:
      'Vivez le futur du voyage spatial avec Galaxium. Réservez votre vol interplanétaire et explorez les merveilles de notre système solaire.',
    exploreFlights: 'Explorer les Vols',
    learnMore: 'En Savoir Plus',
    whyChoose: 'Pourquoi Choisir Galaxium ?',
    feature1Title: 'Voyages Interplanétaires',
    feature1Desc: 'Explorez des destinations dans tout le système solaire à bord de nos vaisseaux de pointe.',
    feature2Title: 'Multiples Destinations',
    feature2Desc: "De Mars à Europe, découvrez de nouveaux mondes et réservez votre voyage dès aujourd'hui.",
    feature3Title: 'Sûr & Sécurisé',
    feature3Desc: 'Votre sécurité est notre priorité grâce à des systèmes avancés de navigation et de survie.',
    feature4Title: 'Réservation Instantanée',
    feature4Desc: 'Réservez votre vol en quelques secondes et recevez une confirmation immédiate.',
    exploreDestinations: 'Explorez Nos Destinations',
    destinationLabel: 'Destination',
    ctaTitle: 'Prêt pour Votre Aventure Spatiale ?',
    ctaSubtitle:
      "Rejoignez des milliers de voyageurs spatiaux qui ont déjà réservé leur voyage vers les étoiles. L'aventure vous attend !",
    ctaButton: 'Réservez Votre Vol Maintenant',
  },
  nl: {
    heroTitle1: 'Reis Voorbij',
    heroTitle2: 'De Sterren',
    heroSubtitle:
      'Beleef de toekomst van ruimtereizen met Galaxium. Boek uw interplanetaire vlucht en ontdek de wonderen van ons zonnestelsel.',
    exploreFlights: 'Vluchten Bekijken',
    learnMore: 'Meer Informatie',
    whyChoose: 'Waarom Kiezen voor Galaxium?',
    feature1Title: 'Interplanetair Reizen',
    feature1Desc: 'Verken bestemmingen door het zonnestelsel met onze geavanceerde ruimtevaartuigen.',
    feature2Title: 'Meerdere Bestemmingen',
    feature2Desc: 'Van Mars tot Europa, ontdek nieuwe werelden en boek vandaag nog uw reis.',
    feature3Title: 'Veilig & Betrouwbaar',
    feature3Desc: 'Uw veiligheid is onze prioriteit met geavanceerde navigatie- en levensonderhoudsystemen.',
    feature4Title: 'Direct Boeken',
    feature4Desc: 'Boek uw vlucht in seconden en ontvang direct bevestiging.',
    exploreDestinations: 'Ontdek Onze Bestemmingen',
    destinationLabel: 'Bestemming',
    ctaTitle: 'Klaar voor Uw Ruimteabenteuer?',
    ctaSubtitle:
      'Sluit u aan bij duizenden ruimtereizigers die hun reis naar de sterren al hebben geboekt. Uw avontuur wacht!',
    ctaButton: 'Boek Nu Uw Vlucht',
  },
  be: {
    heroTitle1: 'Reis Voorbij',
    heroTitle2: 'De Sterren',
    heroSubtitle:
      'Beleef de toekomst van ruimtereizen met Galaxium. Boek uwen interplanetairen vlucht en ontdek de wonderen van ons zonnestelsel.',
    exploreFlights: 'Vluchten Bekijken',
    learnMore: 'Meer Weten',
    whyChoose: 'Waarom Kiezen voor Galaxium?',
    feature1Title: 'Interplanetair Reizen',
    feature1Desc: 'Verken bestemmingen doorheen het zonnestelsel met onze geavanceerde ruimtevaartuigen.',
    feature2Title: 'Vele Bestemmingen',
    feature2Desc: 'Van Mars tot Europa, ontdek nieuwe werelden en boek vandaag nog uwen reis.',
    feature3Title: 'Veilig & Zeker',
    feature3Desc: 'Uw veiligheid is onze prioriteit met geavanceerde navigatie- en levenssupportstemen.',
    feature4Title: 'Direct Reserveren',
    feature4Desc: 'Reserveer uwen vlucht in een paar seconden en ontvang direct bevestiging.',
    exploreDestinations: 'Ontdek Onze Bestemmingen',
    destinationLabel: 'Bestemming',
    ctaTitle: 'Klaar voor Uw Ruimteabenteuer?',
    ctaSubtitle:
      'Sluit u aan bij duizenden ruimtereizigers die hun reis naar de sterren al gereserveerd hebben. Uw avontuur wacht!',
    ctaButton: 'Reserveer Nu Uwen Vlucht',
  },
};

// Made with Bob
