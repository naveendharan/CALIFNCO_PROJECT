import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { DataStore, Order } from '../services/dataStore';
import { RazorpayModal } from '../components/RazorpayModal';
import { MapAddressPickerModal } from '../components/MapAddressPickerModal';
import { RazorpayPaymentSuccess } from '../config/razorpay';

interface CheckoutScreenProps {
  onBack: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  onBack,
  onOrderSuccess
}) => {
  const { colors } = useTheme();
  const { user, isDealer } = useAuth();
  const { items, subtotal, discount, tax, shipping, total, clearCart } = useCart();
  const { triggerPushAlert } = useNotifications();

  // Contact fields
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [address, setAddress] = useState(
    user.savedAddress || 'Flat 402, Aqua Heights, Indiranagar, Bengaluru, 560038'
  );
  const [coords, setCoords] = useState(user.coordinates || { lat: 12.9716, lng: 77.5946 });

  // Modals
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [razorpayModalOpen, setRazorpayModalOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const handleRazorpaySuccess = (payment: RazorpayPaymentSuccess) => {
    setRazorpayModalOpen(false);

    // Save order in DataStore
    const newOrder = DataStore.createOrder({
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      role: user.role,
      businessName: user.businessName,
      gstNumber: user.gstNumber,
      items: items.map(i => ({
        product: i.product,
        quantity: i.quantity,
        unitPrice: isDealer ? i.product.wholesalePrice : i.product.retailPrice,
        totalPrice: (isDealer ? i.product.wholesalePrice : i.product.retailPrice) * i.quantity
      })),
      subtotal,
      discount,
      tax,
      totalAmount: total,
      paymentMethod: `razorpay_${payment.method}` as any,
      paymentId: payment.razorpay_payment_id,
      shippingAddress: address,
      coordinates: coords,
      status: 'Confirmed'
    });

    // Fire FCM simulated push alert
    triggerPushAlert(
      '🎉 Order Placed Successfully!',
      `Order #${newOrder.id} for ₹${total.toLocaleString('en-IN')} confirmed. Tracking: ${newOrder.trackingNumber || 'CALI-TRK-990'}`,
      'order'
    );

    clearCart();
    setConfirmedOrder(newOrder);
  };

  if (confirmedOrder) {
    return (
      <View style={[styles.successContainer, { backgroundColor: colors.bg }]}>
        <View style={styles.successIconCircle}>
          <Ionicons name="checkmark-done" size={54} color="#ffffff" />
        </View>

        <Text style={[styles.successTitle, { color: colors.text }]}>Order Confirmed!</Text>
        <Text style={[styles.successOrderNumber, { color: colors.primary }]}>#{confirmedOrder.id}</Text>

        <View style={[styles.successReceiptCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.receiptRow}>
            <Text style={[styles.receiptLabel, { color: colors.textMuted }]}>Payment Status</Text>
            <View style={styles.paidBadge}>
              <Text style={styles.paidBadgeText}>PAID (RAZORPAY TEST)</Text>
            </View>
          </View>

          <View style={styles.receiptRow}>
            <Text style={[styles.receiptLabel, { color: colors.textMuted }]}>Razorpay Transaction ID</Text>
            <Text style={[styles.receiptVal, { color: colors.text, fontFamily: 'monospace' }]}>
              {confirmedOrder.paymentId}
            </Text>
          </View>

          <View style={styles.receiptRow}>
            <Text style={[styles.receiptLabel, { color: colors.textMuted }]}>Total Amount Paid</Text>
            <Text style={[styles.receiptVal, { color: colors.accentGreen, fontWeight: '800' }]}>
              ₹{confirmedOrder.totalAmount.toLocaleString('en-IN')}
            </Text>
          </View>

          <View style={styles.receiptRow}>
            <Text style={[styles.receiptLabel, { color: colors.textMuted }]}>Delivery Pinpoint</Text>
            <Text style={[styles.receiptVal, { color: colors.text }]} numberOfLines={2}>
              {confirmedOrder.shippingAddress}
            </Text>
          </View>
        </View>

        <View style={styles.notificationSentBox}>
          <Ionicons name="mail" size={16} color="#0284c7" />
          <Text style={styles.notifSentText}>
            Email confirmation sent to {confirmedOrder.customerEmail} & SMS alerts to {confirmedOrder.customerPhone}.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.viewOrdersBtn, { backgroundColor: colors.primary }]}
          onPress={() => onOrderSuccess(confirmedOrder)}
        >
          <Ionicons name="receipt-outline" size={18} color="#ffffff" />
          <Text style={styles.viewOrdersBtnText}>VIEW ORDER STATUS IN HISTORY</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Top Bar */}
      <View style={[styles.topBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.topTitle, { color: colors.text }]}>Checkout & Verification</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        {/* OpenStreetMap Address Selection Card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTitleRow}>
              <Ionicons name="location" size={20} color={colors.primary} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>Delivery Destination</Text>
            </View>
            <TouchableOpacity
              onPress={() => setMapModalOpen(true)}
              style={[styles.changePinBtn, { backgroundColor: colors.primaryLight }]}
            >
              <Ionicons name="map-outline" size={14} color={colors.primary} />
              <Text style={[styles.changePinText, { color: colors.primary }]}>Pin on Map</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.addressDisplay, { color: colors.textSecondary }]}>
            {address}
          </Text>

          <View style={styles.coordsRow}>
            <Ionicons name="navigate-circle" size={14} color={colors.accentGreen} />
            <Text style={[styles.coordsText, { color: colors.textMuted }]}>
              Verified GPS: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)} (OpenStreetMap)
            </Text>
          </View>
        </View>

        {/* Customer / Dealer Contact Info Card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="person-circle-outline" size={20} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {isDealer ? 'Wholesale Dealer Credentials' : 'Contact Information'}
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textMuted }]}>Full Name</Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputRow}>
            <View style={{ flex: 1, marginRight: 6 }}>
              <Text style={[styles.inputLabel, { color: colors.textMuted }]}>Phone Number</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
            <View style={{ flex: 1, marginLeft: 6 }}>
              <Text style={[styles.inputLabel, { color: colors.textMuted }]}>Email (for Invoice)</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {isDealer && (
            <View style={styles.inputRow}>
              <View style={{ flex: 1, marginRight: 6 }}>
                <Text style={[styles.inputLabel, { color: colors.textMuted }]}>Business Name</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
                  value={user.businessName || ''}
                  editable={false}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 6 }}>
                <Text style={[styles.inputLabel, { color: colors.textMuted }]}>GST Number</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
                  value={user.gstNumber || ''}
                  editable={false}
                />
              </View>
            </View>
          )}
        </View>

        {/* Order Items Preview */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text, marginBottom: 10 }]}>
            Review Items ({items.length})
          </Text>
          {items.map(item => (
            <View key={item.product.id} style={styles.itemSummaryRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.itemSummaryName, { color: colors.text }]} numberOfLines={1}>
                  {item.product.name}
                </Text>
                <Text style={[styles.itemSummaryQty, { color: colors.textMuted }]}>
                  Quantity: {item.quantity} units @ ₹{(isDealer ? item.product.wholesalePrice : item.product.retailPrice).toLocaleString('en-IN')}
                </Text>
              </View>
              <Text style={[styles.itemSummaryTotal, { color: colors.text }]}>
                ₹{((isDealer ? item.product.wholesalePrice : item.product.retailPrice) * item.quantity).toLocaleString('en-IN')}
              </Text>
            </View>
          ))}

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.finalTotalRow}>
            <Text style={[styles.finalTotalLabel, { color: colors.text }]}>Final Amount Payable</Text>
            <Text style={[styles.finalTotalVal, { color: isDealer ? colors.accentGreen : colors.primary }]}>
              ₹{total.toLocaleString('en-IN')}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Pay Now Button */}
      <View style={[styles.bottomBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View>
          <Text style={[styles.bottomAmtLabel, { color: colors.textMuted }]}>Total to Pay</Text>
          <Text style={[styles.bottomAmtVal, { color: isDealer ? colors.accentGreen : colors.primary }]}>
            ₹{total.toLocaleString('en-IN')}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.payNowBtn, { backgroundColor: colors.primary }]}
          onPress={() => setRazorpayModalOpen(true)}
        >
          <Ionicons name="shield-checkmark" size={18} color="#ffffff" />
          <Text style={styles.payNowBtnText}>PAY VIA RAZORPAY TEST</Text>
        </TouchableOpacity>
      </View>

      {/* Razorpay Test Mode Modal */}
      <RazorpayModal
        visible={razorpayModalOpen}
        amount={total}
        customerName={name}
        customerEmail={email}
        customerPhone={phone}
        onSuccess={handleRazorpaySuccess}
        onCancel={() => setRazorpayModalOpen(false)}
      />

      {/* OpenStreetMap Address Pinpoint Modal */}
      <MapAddressPickerModal
        visible={mapModalOpen}
        initialAddress={address}
        onSelectAddress={(newAddr, newCoords) => {
          setAddress(newAddr);
          setCoords(newCoords);
        }}
        onClose={() => setMapModalOpen(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1
  },
  backBtn: {
    padding: 4
  },
  topTitle: {
    fontSize: 16,
    fontWeight: '800'
  },
  scrollArea: {
    flex: 1,
    padding: 16
  },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800'
  },
  changePinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14
  },
  changePinText: {
    fontSize: 11,
    fontWeight: '700'
  },
  addressDisplay: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 6
  },
  coordsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  coordsText: {
    fontSize: 11,
    fontFamily: 'monospace'
  },
  inputGroup: {
    marginBottom: 10
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 10
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 13
  },
  itemSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6
  },
  itemSummaryName: {
    fontSize: 12,
    fontWeight: '600'
  },
  itemSummaryQty: {
    fontSize: 11,
    marginTop: 2
  },
  itemSummaryTotal: {
    fontSize: 13,
    fontWeight: '700'
  },
  divider: {
    height: 1,
    marginVertical: 10
  },
  finalTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  finalTotalLabel: {
    fontSize: 14,
    fontWeight: '800'
  },
  finalTotalVal: {
    fontSize: 18,
    fontWeight: '900'
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1
  },
  bottomAmtLabel: {
    fontSize: 10
  },
  bottomAmtVal: {
    fontSize: 18,
    fontWeight: '900'
  },
  payNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12
  },
  payNowBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '900'
  },
  successOrderNumber: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 4,
    marginBottom: 20
  },
  successReceiptCard: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6
  },
  receiptLabel: {
    fontSize: 12
  },
  receiptVal: {
    fontSize: 12,
    maxWidth: '55%',
    textAlign: 'right'
  },
  paidBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  paidBadgeText: {
    color: '#166534',
    fontSize: 10,
    fontWeight: '800'
  },
  notificationSentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#e0f2fe',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20
  },
  notifSentText: {
    color: '#0369a1',
    fontSize: 11,
    flex: 1
  },
  viewOrdersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 14
  },
  viewOrdersBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800'
  }
});
