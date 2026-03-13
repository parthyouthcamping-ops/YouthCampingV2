import { Quotation, BrandSettings } from "./types";
import { db } from "./db";

const STORAGE_KEY = "youthcamping_quotations_v3";

export const getQuotations = async (): Promise<Quotation[]> => {
    if (typeof window === "undefined") return [];

    // Check for migration
    const legacyData = localStorage.getItem(STORAGE_KEY);
    if (legacyData) {
        try {
            const parsed = JSON.parse(legacyData);
            if (Array.isArray(parsed)) {
                for (const q of parsed) {
                    await db.set(q);
                }
            }
            localStorage.removeItem(STORAGE_KEY);
        } catch (e) {
            console.error("Migration failed", e);
        }
    }

    const all = await db.getAll();
    return all;
};

export const saveQuotation = async (quotation: Quotation) => {
    const updated = {
        ...quotation,
        updatedAt: new Date().toISOString(),
        createdAt: quotation.createdAt || new Date().toISOString()
    };
    await db.set(updated);
};

export const deleteQuotation = async (id: string) => {
    await db.delete(id);
};

export const getQuotationBySlug = async (slug: string): Promise<Quotation | undefined> => {
    return await db.getBySlug(slug);
};

export const getQuotationById = async (id: string): Promise<Quotation | undefined> => {
    return await db.get(id);
};

export const generateSlug = (destination: string, id: string) => {
    const cleanDest = destination.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    return `${cleanDest || "trip"}-luxury-${id.substring(0, 5)}`;
};

export const getBrandSettings = async (): Promise<BrandSettings | null> => {
    if (typeof window === "undefined") return null;
    return await db.get("global_brand");
};

export const saveBrandSettings = async (settings: BrandSettings) => {
    await db.set({ ...settings, id: "global_brand" });
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("brandSettingsUpdated"));
    }
};

export const getLandingContent = async (): Promise<any> => {
    return await db.getAllLandingSections();
};

export const updateLandingSection = async (id: string, data: any) => {
    await db.setLandingSection(id, data);
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("landingContentUpdated"));
    }
};

export const getClients = async (): Promise<any[]> => {
    return await db.getClients();
};

export const saveClient = async (client: any) => {
    await db.setClient(client);
};

export const deleteClient = async (id: string) => {
    await db.deleteClient(id);
};

export const addNotification = async (notification: any) => {
    await db.addNotification(notification);
};

export const getNotifications = async (): Promise<any[]> => {
    return await db.getNotifications();
};

export const markNotificationRead = async (id: string) => {
    await db.markNotificationRead(id);
};

export const getBookings = async (): Promise<any[]> => {
    return await db.getBookings();
};

export const saveBooking = async (booking: any) => {
    await db.setBooking(booking);
};
