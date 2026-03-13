import { 
    Document, 
    Page, 
    Text, 
    View, 
    StyleSheet, 
    Image, 
    Font 
} from '@react-pdf/renderer';

// Register fonts if needed
// Font.register({ family: 'Inter', src: '...' });

const styles = StyleSheet.create({
    page: {
        padding: 50,
        fontFamily: 'Helvetica',
        color: '#1a1a1a',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#0066FF',
    },
    invoiceDetails: {
        textAlign: 'right',
    },
    section: {
        marginBottom: 20,
    },
    label: {
        fontSize: 10,
        textTransform: 'uppercase',
        color: '#999',
        marginBottom: 5,
    },
    value: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    table: {
        marginTop: 30,
        borderTop: 1,
        borderColor: '#eee',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f8f8f8',
        padding: 10,
        fontWeight: 'bold',
    },
    tableRow: {
        flexDirection: 'row',
        padding: 10,
        borderBottom: 1,
        borderColor: '#eee',
    },
    footer: {
        position: 'absolute',
        bottom: 50,
        left: 50,
        right: 50,
        textAlign: 'center',
        fontSize: 10,
        color: '#999',
        borderTop: 1,
        borderColor: '#eee',
        paddingTop: 20,
    }
});

export const InvoicePDF = ({ booking, client, quotation }: any) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>YOUTHCAMPING</Text>
                    <Text style={{ fontSize: 10, color: '#666' }}>Premium Travel & Experiences</Text>
                </View>
                <View style={styles.invoiceDetails}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>INVOICE</Text>
                    <Text style={{ fontSize: 10, color: '#666' }}>#{booking.id}</Text>
                    <Text style={{ fontSize: 10, color: '#666' }}>Date: {new Date().toLocaleDateString()}</Text>
                </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={styles.section}>
                    <Text style={styles.label}>Bill To</Text>
                    <Text style={styles.value}>{client.name}</Text>
                    <Text style={{ fontSize: 10, color: '#666' }}>{client.email}</Text>
                    <Text style={{ fontSize: 10, color: '#666' }}>{client.phone}</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.label}>Destination</Text>
                    <Text style={styles.value}>{quotation.destination}</Text>
                </View>
            </View>

            <View style={styles.table}>
                <View style={styles.tableHeader}>
                    <Text style={{ flex: 3 }}>Description</Text>
                    <Text style={{ flex: 1, textAlign: 'right' }}>Amount</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={{ flex: 3 }}>Premium {quotation.destination} Experience Package</Text>
                    <Text style={{ flex: 1, textAlign: 'right' }}>₹{booking.amount.toLocaleString()}</Text>
                </View>
                <View style={[styles.tableRow, { backgroundColor: '#fdfdfd' }]}>
                    <Text style={{ flex: 3, fontWeight: 'bold' }}>Total Paid</Text>
                    <Text style={{ flex: 1, textAlign: 'right', fontWeight: 'bold', color: '#0066FF' }}>₹{booking.amount.toLocaleString()}</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <Text>Thank you for choosing YouthCamping. We ensure luxury at every step.</Text>
                <Text style={{ marginTop: 5 }}>www.youthcamping.com | support@youthcamping.com</Text>
            </View>
        </Page>
    </Document>
);
