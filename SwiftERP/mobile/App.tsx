import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';

export default function App() {
  const [activeTab, setActiveTab] = useState<'warehouse' | 'leave'>('warehouse');
  const [sku, setSku] = useState('PRD-LAP-001');
  const [productData, setProductData] = useState<any>(null);
  const [quantityDelta, setQuantityDelta] = useState('5');
  const [leaveDays, setLeaveDays] = useState('3');
  const [leaveReason, setLeaveReason] = useState('Personal travel');

  const handleScanLookup = () => {
    // Simulated scan lookup against REST API
    setProductData({
      sku: sku,
      name: 'Dell Latitude 5540 15.6" i7',
      currentStock: 25,
      minStockThreshold: 10,
      warehouse: 'Central Distribution Hub'
    });
    Alert.alert('Product Found', `SKU: ${sku}\nCurrent Stock: 25 units`);
  };

  const handleStockAdjust = (type: 'StockIn' | 'StockOut') => {
    const qty = parseInt(quantityDelta) * (type === 'StockIn' ? 1 : -1);
    Alert.alert('Stock Updated', `Transaction: ${type}\nDelta: ${qty} units\nLedger updated atomically in MSSQL.`);
  };

  const handleApplyLeave = () => {
    Alert.alert('Leave Submitted', `Applied for ${leaveDays} days of Annual Leave.\nManager notified.`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>⚡ SwiftERP Companion</Text>
        <Text style={styles.headerSubtitle}>Warehouse Scanning & Leave Approvals</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'warehouse' && styles.activeTab]}
          onPress={() => setActiveTab('warehouse')}
        >
          <Text style={[styles.tabText, activeTab === 'warehouse' && styles.activeTabText]}>📦 Warehouse Stock</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'leave' && styles.activeTab]}
          onPress={() => setActiveTab('leave')}
        >
          <Text style={[styles.tabText, activeTab === 'leave' && styles.activeTabText]}>✈ HR & Leaves</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'warehouse' ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Barcode / SKU Scanner</Text>
            <TextInput
              style={styles.input}
              value={sku}
              onChangeText={setSku}
              placeholder="Scan or enter SKU"
            />
            <TouchableOpacity style={styles.primaryButton} onPress={handleScanLookup}>
              <Text style={styles.buttonText}>🔍 Scan & Verify Stock</Text>
            </TouchableOpacity>

            {productData && (
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{productData.name}</Text>
                <Text style={styles.productStock}>Current Stock: {productData.currentStock} PCS</Text>
                <Text style={styles.productWarehouse}>Location: {productData.warehouse}</Text>

                <View style={styles.adjustRow}>
                  <TextInput
                    style={[styles.input, { flex: 1, marginRight: 8 }]}
                    value={quantityDelta}
                    onChangeText={setQuantityDelta}
                    keyboardType="numeric"
                    placeholder="Qty"
                  />
                  <TouchableOpacity
                    style={[styles.smallButton, { backgroundColor: '#10b981' }]}
                    onPress={() => handleStockAdjust('StockIn')}
                  >
                    <Text style={styles.buttonText}>+ In</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.smallButton, { backgroundColor: '#ef4444', marginLeft: 6 }]}
                    onPress={() => handleStockAdjust('StockOut')}
                  >
                    <Text style={styles.buttonText}>- Out</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Employee Leave Portal</Text>
            <Text style={styles.label}>Leave Days</Text>
            <TextInput
              style={styles.input}
              value={leaveDays}
              onChangeText={setLeaveDays}
              keyboardType="numeric"
            />
            <Text style={styles.label}>Reason</Text>
            <TextInput
              style={styles.input}
              value={leaveReason}
              onChangeText={setLeaveReason}
            />
            <TouchableOpacity style={styles.primaryButton} onPress={handleApplyLeave}>
              <Text style={styles.buttonText}>✈ Submit Leave Request</Text>
            </TouchableOpacity>

            <View style={{ marginTop: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#e2e8f0' }}>
              <Text style={styles.cardTitle}>Pending Approvals (Manager)</Text>
              <View style={styles.approvalItem}>
                <Text style={{ fontWeight: '700' }}>John Doe — 3 Days (Annual)</Text>
                <Text style={{ color: '#64748b', fontSize: 12, marginVertical: 4 }}>Reason: Family vacation and travel</Text>
                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                  <TouchableOpacity
                    style={[styles.smallButton, { backgroundColor: '#10b981', flex: 1, marginRight: 6 }]}
                    onPress={() => Alert.alert('Approved', 'Leave approved. Balance deducted.')}
                  >
                    <Text style={styles.buttonText}>✓ Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.smallButton, { backgroundColor: '#ef4444', flex: 1 }]}
                    onPress={() => Alert.alert('Rejected', 'Leave request rejected.')}
                  >
                    <Text style={styles.buttonText}>✕ Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 20, backgroundColor: '#0f172a' },
  headerTitle: { color: '#ffffff', fontSize: 20, fontWeight: '700' },
  headerSubtitle: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
  tabContainer: { flexDirection: 'row', backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  tabButton: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  activeTab: { borderBottomWidth: 3, borderBottomColor: '#4f46e5' },
  tabText: { color: '#64748b', fontWeight: '600', fontSize: 13 },
  activeTabText: { color: '#4f46e5' },
  content: { padding: 16 },
  card: { backgroundColor: '#ffffff', borderRadius: 12, padding: 18, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 12 },
  label: { fontSize: 12, fontWeight: '600', color: '#475569', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 10, fontSize: 14, marginBottom: 12, backgroundColor: '#fff' },
  primaryButton: { backgroundColor: '#4f46e5', padding: 12, borderRadius: 8, alignItems: 'center' },
  smallButton: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6, alignItems: 'center' },
  buttonText: { color: '#ffffff', fontWeight: '600', fontSize: 13 },
  productDetails: { marginTop: 16, padding: 14, backgroundColor: '#f1f5f9', borderRadius: 8 },
  productName: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
  productStock: { fontSize: 14, fontWeight: '600', color: '#10b981', marginTop: 4 },
  productWarehouse: { fontSize: 12, color: '#64748b', marginTop: 2 },
  adjustRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  approvalItem: { padding: 12, backgroundColor: '#f8fafc', borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0', marginTop: 8 }
});
