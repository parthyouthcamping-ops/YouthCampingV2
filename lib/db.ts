import { neon } from '@neondatabase/serverless';

const isUrl = (v: unknown): v is string =>
    typeof v === 'string' && v.startsWith('https://');

function scrubHotels(hotels: any[]): any[] {
    return (hotels || []).map((h: any) => ({
        ...h,
        photos: (h.photos || []).filter(isUrl)
    }));
}

function sanitisePayload(data: any): any {
    if (!data || typeof data !== 'object') return data;

    const clean = {
        ...data,
        heroImage:        isUrl(data.heroImage)        ? data.heroImage        : null,
        coverImage:       isUrl(data.coverImage)       ? data.coverImage       : null,
        routeMap:         isUrl(data.routeMap)         ? data.routeMap         : null,
        experiencePhotos: (data.experiencePhotos || []).filter(isUrl),
        hotels:           scrubHotels(data.hotels),
        lowLevelHotels:   scrubHotels(data.lowLevelHotels),
        highLevelHotels:  scrubHotels(data.highLevelHotels),
        itinerary: (data.itinerary || []).map((day: any) => ({
            ...day,
            photos: (day.photos || []).filter(isUrl)
        })),
        expert: data.expert ? {
            ...data.expert,
            photo: isUrl(data.expert.photo) ? data.expert.photo : null
        } : data.expert,
        customSections: (data.customSections || []).map((s: any) => ({
            ...s,
            image: isUrl(s.image) ? s.image : null
        }))
    };

    return JSON.parse(JSON.stringify(clean, (_k, v) => {
        if (v instanceof File || v instanceof Blob) return null;
        if (typeof v === 'undefined') return null;
        return v;
    }));
}

const MAX_PAYLOAD_BYTES = 3 * 1024 * 1024;

export class YouthDB {
    private async callApi(action: string, body: any = {}) {
        const isServer = typeof window === 'undefined';
        
        if (isServer && process.env.DATABASE_URL) {
            const sql = neon(process.env.DATABASE_URL);
            const { id, slug, data } = body;

            try {
                if (action === 'set') {
                    const clean = id === 'global_brand' ? data : sanitisePayload(data);
                    const jsonString = JSON.stringify(clean);
                    if (id === 'global_brand') {
                        await sql`
                            INSERT INTO brand_settings (id, data, updated_at)
                            VALUES ('global_brand', ${jsonString}::jsonb, ${new Date().toISOString()})
                            ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = EXCLUDED.updated_at
                        `;
                    } else {
                        const createdAt = clean?.createdAt || new Date().toISOString();
                        await sql`
                            INSERT INTO quotations (id, slug, data, updated_at, created_at)
                            VALUES (${id}, ${slug}, ${jsonString}::jsonb, ${new Date().toISOString()}, ${createdAt})
                            ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, data = EXCLUDED.data, updated_at = EXCLUDED.updated_at
                        `;
                    }
                    return { success: true };
                }

                if (action === 'get') {
                    const res = id === 'global_brand'
                        ? await sql`SELECT data FROM brand_settings WHERE id = ${id}`
                        : await sql`SELECT data FROM quotations WHERE id = ${id}`;
                    return res[0]?.data || null;
                }

                if (action === 'getAll') {
                    const res = await sql`SELECT data FROM quotations ORDER BY updated_at DESC`;
                    return res.map((r: any) => r.data);
                }

                if (action === 'getBySlug') {
                    const res = await sql`SELECT data FROM quotations WHERE slug = ${slug} LIMIT 1`;
                    return res[0]?.data || null;
                }

                if (action === 'delete') {
                    await sql`DELETE FROM quotations WHERE id = ${id}`;
                    return { success: true };
                }

                if (action === 'getLandingSection') {
                    const res = await sql`SELECT data FROM landing_sections WHERE id = ${id}`;
                    return res[0]?.data || null;
                }

                if (action === 'setLandingSection') {
                    const jsonString = JSON.stringify(data);
                    await sql`
                        INSERT INTO landing_sections (id, data, updated_at)
                        VALUES (${id}, ${jsonString}::jsonb, ${new Date().toISOString()})
                        ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = EXCLUDED.updated_at
                    `;
                    return { success: true };
                }

                if (action === 'getAllLandingSections') {
                    const res = await sql`SELECT id, data FROM landing_sections`;
                    return res.reduce((acc: any, curr: any) => {
                        acc[curr.id] = curr.data;
                        return acc;
                    }, {});
                }
            } catch (error) {
                console.error("[DB SERVER ERROR]", error);
                throw error;
            }
        }

        // CLIENT SIDE OR NO DATABASE_URL
        const sanitisedBody = body.data && body.id !== 'global_brand'
            ? { ...body, data: sanitisePayload(body.data) }
            : body;

        const payload = JSON.stringify({ action, ...sanitisedBody });

        if (payload.length > MAX_PAYLOAD_BYTES) {
            throw new Error(`Payload too large: ${(payload.length / 1024).toFixed(0)} KB.`);
        }

        const response = await fetch('/api/db', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload
        });
        
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'API call failed');
        }
        return response.json();
    }

    async set(value: any): Promise<void> {
        if (value.id === 'global_brand') {
            await this.callApi('set', { id: 'global_brand', data: value });
        } else {
            await this.callApi('set', { id: value.id, slug: value.slug, data: value });
        }
    }

    async get(id: string): Promise<any> {
        return await this.callApi('get', { id });
    }

    async getAll(): Promise<any[]> {
        return await this.callApi('getAll');
    }

    async getBySlug(slug: string): Promise<any> {
        return await this.callApi('getBySlug', { slug });
    }

    async delete(id: string): Promise<void> {
        await this.callApi('delete', { id });
    }

    async getLandingSection(id: string): Promise<any> {
        return await this.callApi('getLandingSection', { id });
    }

    async setLandingSection(id: string, data: any): Promise<void> {
        await this.callApi('setLandingSection', { id, data });
    }

    async getAllLandingSections(): Promise<any> {
        return await this.callApi('getAllLandingSections');
    }
}

export const db = new YouthDB();
