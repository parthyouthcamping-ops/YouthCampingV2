import { getQuotationBySlug, getBrandSettings } from "@/lib/store";
import { notFound } from "next/navigation";
import QuoteClient from "@/components/quote/QuoteClient";

export const revalidate = 3600; // Revalidate every hour

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params;
    
    // Fetch data in parallel on the server
    const [q, brand] = await Promise.all([
        getQuotationBySlug(slug),
        getBrandSettings()
    ]);

    if (!q) {
        notFound();
    }

    return <QuoteClient q={q} brand={brand} slug={slug} />;
}
