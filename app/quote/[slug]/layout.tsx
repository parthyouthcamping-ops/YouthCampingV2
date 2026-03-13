import { Metadata } from 'next';
import { neon } from '@neondatabase/serverless';

async function getQuoteData(slug: string) {
    if (!process.env.DATABASE_URL) return null;
    const sql = neon(process.env.DATABASE_URL);
    const result = await sql`SELECT * FROM quotations WHERE slugCount = 0 AND slug = ${slug} LIMIT 1`;
    // Wait, the schema might have changed or I should use the lib logic.
    // Let's use the neon directly for SSR metadata.
    const quotes = await sql`SELECT * FROM quotations WHERE slug = ${slug} LIMIT 1`;
    return quotes[0] || null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const quote = await getQuoteData(params.slug);

    if (!quote) {
        return {
            title: 'Quote Not Found | YouthCamping',
        };
    }

    return {
        title: `${quote.destination} Travel Proposal`,
        description: `Exclusive luxury travel proposal for ${quote.destination}. View your personalized itinerary and package tiers.`,
        openGraph: {
            title: `${quote.destination} | Your Exclusive Proposal`,
            description: `Bespoke travel experience curated just for you.`,
            images: [quote.heroImage || '/og-image.jpg'],
        },
    };
}

export default async function QuoteLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { slug: string };
}) {
    const quote = await getQuoteData(params.slug);

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
                                "price": quote.standardTier?.price || 0,
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
