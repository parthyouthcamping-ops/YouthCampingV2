export type Hotel = {
    id: string;
    name: string;
    location: string;
    rating: number; // 1-5
    description: string;
    roomType: string;
    photos: string[]; // Base64 or URLs
};

export type DayItinerary = {
    id: string;
    day: number;
    title: string;
    description: string;
    activities: string[];
    sightseeing?: string[];
    photos: string[];
};

export type CustomSection = {
    id: string;
    heading: string;
    description: string;
    image?: string;
    buttonLabel?: string;
    buttonLink?: string;
    isVisible: boolean;
};

export type TransportLeg = {
    city: string;
    time: string;
    terminal?: string;
    date?: string;
    isNextDay?: boolean;
};

export type FlightSegment = {
    from: TransportLeg;
    to: TransportLeg;
    layoverAfter?: string; // e.g. "4h 55m Layover in Bengaluru"
};

export type FlightDetails = {
    airlineName: string;
    flightNumber: string;
    departureDate: string;
    segments: FlightSegment[];
    baggage?: {
        cabin: string;
        checkIn: string;
    };
};

export type TrainDetails = {
    trainName: string;
    trainNumber: string;
    coachClass: string;
    departureDate: string;
    from: TransportLeg;
    to: TransportLeg;
};

export type TransportData = {
    type: 'flight' | 'train' | null;
    flightDetails?: {
        departure: FlightDetails;
        return?: FlightDetails;
    };
    trainDetails?: TrainDetails;
};

export type Quotation = {
    id: string;
    clientId?: string;
    slug: string;
    clientName: string;
    destination: string;
    pax: number;
    travelDates: {
        from: string;
        to: string;
    };
    duration: string; // e.g. "5 Days • 4 Nights"
    transportOption: string;
    transport?: TransportData;
    roomSharing: "Single" | "Double" | "Triple" | "Quad";
    packagePrice: number; // For backward compatibility or legacy display
    lowLevelPrice: number; // Price per pax for low level option
    highLevelPrice: number; // Price per pax for high level option

    // Brand
    companyLogo?: string;
    brandLogo?: string;
    heroImage?: string;
    coverImage?: string;
    experiencePhotos?: string[]; // Multiple photos for the experience section
    routeMap?: string; // One photo for the route map at the bottom

    // Content
    hotels: Hotel[]; // Legacy or fallback
    lowLevelHotels: Hotel[];
    highLevelHotels: Hotel[];
    itinerary: DayItinerary[];
    customSections?: CustomSection[];
    includes: string[];
    exclusions: string[];

    // Expert
    expert: {
        name: string;
        photo?: string;
        whatsapp: string;
        designation?: string;
    };

    status: "Draft" | "Published" | "Sent" | "Viewed" | "Interested" | "Booked";
    createdAt: string;
    updatedAt: string;
};

export type BrandSettings = {
    companyName?: string;
    companyLogo?: string;
    logoMode?: 'contain' | 'fill' | 'cover';
    brandColor?: string;
    instagramLink?: string;
    websiteLink?: string;
    phoneNumber?: string;
    footerText?: string;
    updatedAt: string;
};

export type LandingHero = {
    title: string;
    subtitle: string;
    highlight?: string;
    backgroundImage: string;
    ctaText: string;
};

export type LandingAbout = {
    title: string;
    content: string;
    image: string;
};

export type LandingPackage = {
    id: string;
    name: string;
    price: string;
    duration: string;
    image: string;
};

export type LandingTestimonial = {
    id: string;
    name: string;
    trip: string;
    photo: string;
    quote: string;
    rating: number;
};

export type LandingGalleryItem = {
    id: string;
    url: string;
    type: 'image' | 'video';
    caption?: string;
};

export type TripDay = {
    id: string;
    day: number;
    title: string;
    description: string;
    activities: string[];
    photos: string[];
};

export type Trip = {
    id: string; // The tripId, e.g., YCPARTH01
    title: string;
    description: string;
    price: number;
    duration: string; // e.g., "5 Days / 4 Nights"
    inclusions: string[];
    exclusions: string[];
    itinerary: TripDay[];
    images: string[];
    createdAt: string;
    updatedAt: string;
};

export type LandingContent = {
    hero: LandingHero;
    about: LandingAbout;
    packages: LandingPackage[];
    testimonials: LandingTestimonial[];
    gallery: LandingGalleryItem[];
};
