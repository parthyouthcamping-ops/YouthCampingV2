import { neon } from '@neondatabase/serverless';
import { v4 as uuidv4 } from "uuid";

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

                if (action === 'getClients') {
                    const res = await sql`SELECT * FROM clients ORDER BY created_at DESC`;
                    return res;
                }

                if (action === 'setClient') {
                    const jsonString = JSON.stringify(data);
                    await sql`
                        INSERT INTO clients (id, name, email, phone, status, notes, data, updated_at)
                        VALUES (${id}, ${body.name}, ${body.email}, ${body.phone}, ${body.status}, ${body.notes}, ${jsonString}::jsonb, ${new Date().toISOString()})
                        ON CONFLICT (id) DO UPDATE SET 
                            name = EXCLUDED.name, 
                            email = EXCLUDED.email, 
                            phone = EXCLUDED.phone, 
                            status = EXCLUDED.status, 
                            notes = EXCLUDED.notes, 
                            data = EXCLUDED.data, 
                            updated_at = EXCLUDED.updated_at
                    `;
                    return { success: true };
                }

                if (action === 'deleteClient') {
                    await sql`DELETE FROM clients WHERE id = ${id}`;
                    return { success: true };
                }

                if (action === 'getNotifications') {
                    const res = await sql`SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50`;
                    return res;
                }

                if (action === 'addNotification') {
                    await sql`
                        INSERT INTO notifications (id, title, message, type, link)
                        VALUES (${id || uuidv4()}, ${body.title}, ${body.message}, ${body.type || 'info'}, ${body.link})
                    `;
                    return { success: true };
                }

                if (action === 'markNotificationRead') {
                    await sql`UPDATE notifications SET is_read = TRUE WHERE id = ${id}`;
                    return { success: true };
                }

                if (action === 'getBookings') {
                    const res = await sql`
                        SELECT b.*, c.name as client_name, q.destination 
                        FROM bookings b
                        LEFT JOIN clients c ON b.client_id = c.id
                        LEFT JOIN quotations q ON b.quotation_id = q.id
                        ORDER BY b.created_at DESC
                    `;
                    return res;
                }

                if (action === 'setBooking') {
                    const jsonString = JSON.stringify(data);
                    await sql`
                        INSERT INTO bookings (id, quotation_id, client_id, amount, status, data, updated_at)
                        VALUES (${id}, ${body.quotationId}, ${body.clientId}, ${body.amount}, ${body.status}, ${jsonString}::jsonb, ${new Date().toISOString()})
                        ON CONFLICT (id) DO UPDATE SET 
                            status = EXCLUDED.status, 
                            data = EXCLUDED.data, 
                            updated_at = EXCLUDED.updated_at
                    `;
                    return { success: true };
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

    async getClients(): Promise<any[]> {
        return await this.callApi('getClients');
    }

    async setClient(client: any): Promise<void> {
        await this.callApi('setClient', { 
            id: client.id, 
            name: client.name, 
            email: client.email, 
            phone: client.phone, 
            status: client.status, 
            notes: client.notes,
            data: client.data || {} 
        });
    }

    async deleteClient(id: string): Promise<void> {
        await this.callApi('deleteClient', { id });
    }

    async getNotifications(): Promise<any[]> {
        return await this.callApi('getNotifications');
    }

    async addNotification(data: { title: string, message: string, type?: string, link?: string }): Promise<void> {
        await this.callApi('addNotification', data);
    }

    async markNotificationRead(id: string): Promise<void> {
        await this.callApi('markNotificationRead', { id });
    }

    async getBookings(): Promise<any[]> {
        return await this.callApi('getBookings');
    }

    async setBooking(booking: any): Promise<void> {
        await this.callApi('setBooking', {
            id: booking.id,
            quotationId: booking.quotation_id,
            clientId: booking.client_id,
            amount: booking.amount,
            status: booking.status,
            data: booking.data || {}
        });
    }
}

export const db = new YouthDB();
