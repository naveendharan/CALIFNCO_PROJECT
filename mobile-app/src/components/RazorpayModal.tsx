import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RAZORPAY_CONFIG, RazorpayPaymentSuccess } from '../config/razorpay';

interface RazorpayModalProps {
  visible: boolean;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onSuccess: (payment: RazorpayPaymentSuccess) => void;
  onCancel: () => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  visible,
  amount,
  customerName,
  customerEmail,
  customerPhone,
  onSuccess,
  onCancel
}) => {
  const [method, setMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('customer@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('789');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      const generatedPaymentId = `pay_rzp_test_${Math.random().toString(36).substring(2, 10)}${Date.now().toString().slice(-4)}`;
      onSuccess({
        razorpay_payment_id: generatedPaymentId,
        razorpay_order_id: `order_cali_${Date.now()}`,
        razorpay_signature: `sig_${Math.random().toString(36).substring(2, 14)}`,
        amount,
        method
      });
    }, 1500);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          {/* Razorpay Brand Header */}
          <View style={styles.header}>
            <View>
              <View style={styles.brandRow}>
                <Ionicons name="shield-checkmark" size={20} color="#0284c7" />
                <Text style={styles.brandTitle}>Razorpay</Text>
                <View style={styles.testBadge}>
                  <Text style={styles.testBadgeText}>TEST MODE</Text>
                </View>
              </View>
              <Text style={styles.merchantText}>{RAZORPAY_CONFIG.company_name}</Text>
            </View>
            <TouchableOpacity onPress={onCancel} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* Amount Box */}
          <View style={styles.amountBox}>
            <Text style={styles.amountLabel}>Total Payable Amount</Text>
            <Text style={styles.amountValue}>₹{amount.toLocaleString('en-IN')}</Text>
            <Text style={styles.keyInfo}>Key ID: {RAZORPAY_CONFIG.key_id}</Text>
          </View>

          {/* Method Selector Tabs */}
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tabItem, method === 'upi' && styles.tabItemActive]}
              onPress={() => setMethod('upi')}
            >
              <Ionicons name="flash-outline" size={18} color={method === 'upi' ? '#0284c7' : '#64748b'} />
              <Text style={[styles.tabLabel, method === 'upi' && styles.tabLabelActive]}>UPI</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabItem, method === 'card' && styles.tabItemActive]}
              onPress={() => setMethod('card')}
            >
              <Ionicons name="card-outline" size={18} color={method === 'card' ? '#0284c7' : '#64748b'} />
              <Text style={[styles.tabLabel, method === 'card' && styles.tabLabelActive]}>Cards</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabItem, method === 'netbanking' && styles.tabItemActive]}
              onPress={() => setMethod('netbanking')}
            >
              <Ionicons name="business-outline" size={18} color={method === 'netbanking' ? '#0284c7' : '#64748b'} />
              <Text style={[styles.tabLabel, method === 'netbanking' && styles.tabLabelActive]}>Netbanking</Text>
            </TouchableOpacity>
          </View>

          {/* Method Content */}
          <ScrollView style={styles.contentArea}>
            {method === 'upi' && (
              <View style={styles.fieldSection}>
                <Text style={styles.inputLabel}>Enter UPI ID / VPA</Text>
                <TextInput
                  style={styles.textInput}
                  value={upiId}
                  onChangeText={setUpiId}
                  placeholder="username@bank"
                  placeholderTextColor="#94a3b8"
                />
                <View style={styles.upiBadges}>
                  {['Google Pay', 'PhonePe', 'Paytm', 'Cred'].map(app => (
                    <TouchableOpacity
                      key={app}
                      style={styles.upiChip}
                      onPress={() => setUpiId(`customer@${app.toLowerCase().replace(' ', '')}`)}
                    >
                      <Text style={styles.upiChipText}>{app}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.tipText}>Instant payment with 0% gateway surcharge.</Text>
              </View>
            )}

            {method === 'card' && (
              <View style={styles.fieldSection}>
                <Text style={styles.inputLabel}>Card Number (Test Mode Ready)</Text>
                <TextInput
                  style={styles.textInput}
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  placeholder="4111 2222 3333 4444"
                  keyboardType="numeric"
                  placeholderTextColor="#94a3b8"
                />
                <View style={styles.row}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={styles.inputLabel}>Valid Thru</Text>
                    <TextInput
                      style={styles.textInput}
                      value={cardExpiry}
                      onChangeText={setCardExpiry}
                      placeholder="MM/YY"
                      placeholderTextColor="#94a3b8"
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.inputLabel}>CVV</Text>
                    <TextInput
                      style={styles.textInput}
                      value={cardCvv}
                      onChangeText={setCardCvv}
                      placeholder="123"
                      secureTextEntry
                      placeholderTextColor="#94a3b8"
                    />
                  </View>
                </View>
                <Text style={styles.tipText}>Any test CVV and OTP (e.g. 1234) works instantly.</Text>
              </View>
            )}

            {method === 'netbanking' && (
              <View style={styles.fieldSection}>
                <Text style={styles.inputLabel}>Select Popular Banks</Text>
                <View style={styles.bankGrid}>
                  {['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak'].map(bank => (
                    <TouchableOpacity
                      key={bank}
                      style={[styles.bankChip, selectedBank === bank && styles.bankChipSelected]}
                      onPress={() => setSelectedBank(bank)}
                    >
                      <Text style={[styles.bankChipText, selectedBank === bank && styles.bankChipTextSelected]}>
                        {bank}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>

          {/* Action Button */}
          <TouchableOpacity
            style={[styles.payButton, processing && styles.payButtonDisabled]}
            onPress={handlePay}
            disabled={processing}
          >
            {processing ? (
              <View style={styles.buttonContent}>
                <ActivityIndicator color="#ffffff" size="small" />
                <Text style={styles.payBtnText}>Processing Payment...</Text>
              </View>
            ) : (
              <View style={styles.buttonContent}>
                <Ionicons name="lock-closed" size={16} color="#ffffff" />
                <Text style={styles.payBtnText}>PAY ₹{amount.toLocaleString('en-IN')}</Text>
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.securityNote}>
            🔒 256-Bit Encrypted Razorpay Sandbox Checkout • Zero KYC Demo
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end'
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
    paddingBottom: 12
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0284c7',
    marginLeft: 6
  },
  testBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#f59e0b'
  },
  testBadgeText: {
    color: '#b45309',
    fontSize: 9,
    fontWeight: '700'
  },
  merchantText: {
    color: '#475569',
    fontSize: 12,
    marginTop: 2
  },
  closeBtn: {
    padding: 4
  },
  amountBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center'
  },
  amountLabel: {
    color: '#64748b',
    fontSize: 12
  },
  amountValue: {
    color: '#0f172a',
    fontSize: 26,
    fontWeight: '800',
    marginTop: 2
  },
  keyInfo: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 2
  },
  tabBar: {
    flexDirection: 'row',
    marginTop: 14,
    borderBottomWidth: 1,
    borderColor: '#e2e8f0'
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderColor: 'transparent'
  },
  tabItemActive: {
    borderColor: '#0284c7'
  },
  tabLabel: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b'
  },
  tabLabelActive: {
    color: '#0284c7'
  },
  contentArea: {
    marginVertical: 14,
    maxHeight: 180
  },
  fieldSection: {
    paddingHorizontal: 4
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
    marginBottom: 8
  },
  upiBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 4
  },
  upiChip: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  upiChipText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '500'
  },
  bankGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  bankChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1'
  },
  bankChipSelected: {
    backgroundColor: '#e0f2fe',
    borderColor: '#0284c7'
  },
  bankChipText: {
    fontSize: 12,
    color: '#334155'
  },
  bankChipTextSelected: {
    color: '#0284c7',
    fontWeight: '700'
  },
  tipText: {
    fontSize: 11,
    color: '#10b981',
    marginTop: 4
  },
  row: {
    flexDirection: 'row'
  },
  payButton: {
    backgroundColor: '#0284c7',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6
  },
  payButtonDisabled: {
    backgroundColor: '#94a3b8'
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  payBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5
  },
  securityNote: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 10
  }
});
