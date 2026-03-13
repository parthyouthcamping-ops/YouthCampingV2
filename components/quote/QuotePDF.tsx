"use client";

import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { Quotation } from '@/lib/types';

// Standard fonts are usually safer, but we can try to style it
const styles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: '#FFFFFF',
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 30,
        borderBottom: 2,
        borderBottomColor: '#0a192f',
        paddingBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        fontSize: 24,
        fontWeight: 'extrabold',
        color: '#0a192f',
        letterSpacing: -1,
    },
    hero: {
        width: '100%',
        height: 250,
        borderRadius: 15,
        marginBottom: 30,
        objectFit: 'cover',
    },
    sectionTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#0a192f',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 10,
    },
    destinationName: {
        fontSize: 48,
        fontWeight: 'black',
        color: '#0a192f',
        marginBottom: 5,
        textTransform: 'uppercase',
    },
    detailsRow: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 40,
    },
    detailBox: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 8,
    },
    detailLabel: {
        fontSize: 8,
        color: '#6c757d',
        textTransform: 'uppercase',
        marginBottom: 5,
    },
    detailValue: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#212529',
    },
    itinerarySection: {
        marginBottom: 40,
    },
    dayRow: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 20,
    },
    dayNumber: {
        width: 40,
        height: 40,
        backgroundColor: '#0a192f',
        color: '#FFFFFF',
        borderRadius: 8,
        textAlign: 'center',
        paddingTop: 10,
        fontSize: 14,
        fontWeight: 'bold',
    },
    dayContent: {
        flex: 1,
    },
    dayTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    dayDesc: {
        fontSize: 10,
        color: '#495057',
        lineHeight: 1.5,
    },
    pricingSection: {
        marginTop: 20,
        padding: 30,
        backgroundColor: '#0a192f',
        borderRadius: 15,
        color: '#FFFFFF',
    },
    priceLabel: {
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
        opacity: 0.7,
        marginBottom: 5,
    },
    priceValue: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        left: 40,
        right: 40,
        borderTop: 1,
        borderTopColor: '#eeeeee',
        paddingTop: 15,
        textAlign: 'center',
    },
    footerText: {
        fontSize: 8,
        color: '#adb5bd',
        textTransform: 'uppercase',
    }
});

export const QuotePDF = ({ q, selectedTier }: { q: Quotation; selectedTier: 'standard' | 'luxury' }) => {
    const price = selectedTier === 'standard' ? q.lowLevelPrice : q.highLevelPrice;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.logo}>YOUTHCAMPING</Text>
                    <View style={{ textAlign: 'right' }}>
                        <Text style={{ fontSize: 8, color: '#6c757d' }}>OFFICIAL PROPOSAL</Text>
                        <Text style={{ fontSize: 10, fontWeight: 'bold' }}>#{q.slug.toUpperCase()}</Text>
                    </View>
                </View>

                {/* Destination */}
                <View>
                    <Text style={styles.sectionTitle}>Exclusive Journey to</Text>
                    <Text style={styles.destinationName}>{q.destination}</Text>
                </View>

                {/* Hero Image */}
                {q.heroImage && (
                    <Image src={q.heroImage} style={styles.hero} />
                )}

                {/* Details */}
                <View style={styles.detailsRow}>
                    <View style={styles.detailBox}>
                        <Text style={styles.detailLabel}>Client Name</Text>
                        <Text style={styles.detailValue}>{q.clientName}</Text>
                    </View>
                    <View style={styles.detailBox}>
                        <Text style={styles.detailLabel}>Duration</Text>
                        <Text style={styles.detailValue}>{q.duration}</Text>
                    </View>
                    <View style={styles.detailBox}>
                        <Text style={styles.detailLabel}>Travelers</Text>
                        <Text style={styles.detailValue}>{q.pax} Adults</Text>
                    </View>
                </View>

                {/* Itinerary Summary */}
                <View style={styles.itinerarySection}>
                    <Text style={styles.sectionTitle}>The Daily Story</Text>
                    {q.itinerary?.slice(0, 5).map((day, i) => (
                        <View key={i} style={styles.dayRow}>
                            <Text style={styles.dayNumber}>{day.day}</Text>
                            <View style={styles.dayContent}>
                                <Text style={styles.dayTitle}>{day.title}</Text>
                                <Text style={styles.dayDesc}>{day.description.substring(0, 150)}...</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Pricing */}
                <View style={styles.pricingSection}>
                    <Text style={styles.priceLabel}>Total Investment (Per Traveler)</Text>
                    <Text style={styles.priceValue}>₹{price.toLocaleString()}</Text>
                    <Text style={{ fontSize: 8, marginTop: 10, opacity: 0.6 }}>*Inclusions as per your selection ({selectedTier.toUpperCase()} package)</Text>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>© 2026 YouthCamping luxury travel. One Trip at a Time.</Text>
                </View>
            </Page>
        </Document>
    );
};
