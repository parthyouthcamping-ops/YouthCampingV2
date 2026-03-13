import { Metadata } from 'next';
import { neon } from '@neondatabase/serverless';

import { getQuotationBySlug } from '@/lib/store';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const quote = await getQuotationBySlug(slug);

    if (!quote) {
        return {
            title: 'Quote Not Found | YouthCamping',
        };
    }

    const ogUrl = new URL('/api/og', process.env.NEXT_PUBLIC_BASE_URL || 'https://youthcamping.in');
    ogUrl.searchParams.set('destination', quote.destination);
    ogUrl.searchParams.set('duration', quote.duration);

    return {
        title: `${quote.destination} | YouthCamping Exclusive Proposal`,
        description: `Your custom travel itinerary for ${quote.destination}. Curated by ${quote.expert?.name || 'YouthCamping'}.`,
        openGraph: {
            title: `${quote.destination} | YouthCamping`,
            description: `Exclusive Travel Proposal for ${quote.destination}`,
            images: [{ url: ogUrl.toString(), width: 1200, height: 630 }],
        }
    };
}

export default async function QuoteLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const quote = await getQuotationBySlug(slug);

    return (
        <>
            {quote && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "TouristTrip",
                            "name": `${quote.destination} Luxury Expedition`,
                            "description": `A curated ${quote.duration} luxury trip to ${quote.destination}.`,
                            "itinerary": {
                                "@type": "ItemList",
                                "numberOfItems": quote.itinerary?.length || 0,
                            },
                            "offers": {
                                "@type": "Offer",
                                "priceCurrency": "INR",
                                "price": quote.lowLevelPrice || 0,
                                "availability": "https://schema.org/InStock"
                            }
                        })
                    }}
                />
            )}
            {children}
        </>
    );
}
