import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/', '/login', '/debug/'],
            },
        ],
        sitemap: 'https://quote.youthcamping.in/sitemap.xml',
    };
}
