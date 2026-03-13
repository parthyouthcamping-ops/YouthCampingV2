import { MetadataRoute } from 'next';
import { neon } from '@neondatabase/serverless';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://quote.youthcamping.in';
    
    // Static routes
    const routes = [
        '',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }));

    // Dynamic routes from DB
    let quotations: any[] = [];
    try {
        if (process.env.DATABASE_URL) {
            const sql = neon(process.env.DATABASE_URL);
            const result = await sql`SELECT slug, updated_at FROM quotations`;
            quotations = result.map((row) => ({
                url: `${baseUrl}/quote/${row.slug}`,
                lastModified: new Date(row.updated_at),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            }));
        }
    } catch (error) {
        console.error('Failed to fetch quotations for sitemap:', error);
    }

    return [...routes, ...quotations];
}
