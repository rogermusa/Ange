// src/components/ReportDocument.jsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const ReportDocument = ({ patientName, reportData }) => {
  const styles = StyleSheet.create({
    page: { padding: 30, backgroundColor: '#FDF6ED' },
    logo: { width: 100, height: 100, marginBottom: 10, alignSelf: 'center' },
    title: { fontSize: 20, textAlign: 'center', color: '#E19393', marginBottom: 5 },
    subtitle: { fontSize: 12, textAlign: 'center', marginBottom: 20, color: '#666' },
    sectionTitle: { fontSize: 14, marginBottom: 10, color: '#E19393', fontWeight: 'bold' },
    text: { fontSize: 10, marginBottom: 5 },
    recommendationBox: { padding: 6, marginBottom: 6, backgroundColor: '#ffffff', borderRadius: 4 },
    conditionBox: { marginBottom: 4, fontSize: 10 },
    footer: { position: 'absolute', bottom: 30, left: 30, right: 30, textAlign: 'center', fontSize: 8, color: '#666' },
    pageNumber: { position: 'absolute', fontSize: 8, bottom: 10, right: 30, color: '#666' },
  });

  const { conditions, recommendations } = reportData;

  const groupedRecommendations = {};
  recommendations.forEach(rec => {
    const category = rec.category || 'Lifestyle';
    const subcategory = rec.subcategory || 'General';
    if (!groupedRecommendations[category]) groupedRecommendations[category] = {};
    if (!groupedRecommendations[category][subcategory]) groupedRecommendations[category][subcategory] = [];
    groupedRecommendations[category][subcategory].push(rec);
  });

  const today = new Date().toLocaleDateString();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image
          style={styles.logo}
          src="https://page1.genspark.site/v1/base64_upload/ac94661b3bcf1867f769b924b2111552"
        />
        <Text style={styles.title}>Lifestyle Microhabits Assessment</Text>
        <Text style={styles.subtitle}>Patient: {patientName || 'Unknown'} | Date: {today}</Text>

        <Text style={styles.sectionTitle}>Identified Conditions</Text>
        {conditions.length > 0 ? (
          conditions.slice(0, 8).map((cond, i) => (
            <Text key={i} style={styles.conditionBox}>• {cond.name}</Text>
          ))
        ) : (
          <Text style={styles.text}>No conditions identified.</Text>
        )}

        <Text style={styles.sectionTitle}>Recommendations</Text>
        {Object.entries(groupedRecommendations).map(([category, subcats]) => (
          <View key={category}>
            <Text style={{ ...styles.text, fontWeight: 'bold' }}>{category}</Text>
            {Object.entries(subcats).map(([subcategory, recs]) => (
              <View key={subcategory} style={{ marginBottom: 6 }}>
                <Text style={styles.text}>{subcategory}</Text>
                {recs.map((rec, i) => (
                  <View key={i} style={styles.recommendationBox}>
                    <Text style={styles.text}>• {rec.text}</Text>
                    {rec.condition && <Text style={styles.text}>Condition: {rec.condition}</Text>}
                    {rec.notes && <Text style={styles.text}>Notes: {rec.notes}</Text>}
                  </View>
                ))}
              </View>
            ))}
          </View>
        ))}

        <Text style={styles.footer}>
          This report is not medical advice. Please consult Dr. Angelina Yee MD for all health-related concerns.
        </Text>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `${pageNumber} / ${totalPages}`
        )} fixed />
      </Page>
    </Document>
  );
};

export default ReportDocument;
