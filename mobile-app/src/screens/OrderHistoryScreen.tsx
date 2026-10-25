import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DataStore, Order } from '../services/dataStore';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface OrderHistoryScreenProps {
  onExploreProducts: () => void;
}

export const OrderHistoryScreen: React.FC<OrderHistoryScreenProps> = ({ onExploreProducts }) => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const update = () => {
      setOrders(DataStore.getOrders());
    };
    update();
    const unsub = DataStore.subscribe(update);
    return unsub;
  }, []);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Delivered':
        return { bg: '#dcfce7', text: '#166534', icon: 'checkmark-circle' };
      case 'Shipped':
        return { bg: '#e0f2fe', text: '#0369a1', icon: 'airplane' };
      case 'Confirmed':
        return { bg: '#fef3c7', text: '#b45309', icon: 'shield-checkmark' };
      default:
        return { bg: '#f1f5f9', text: '#475569', icon: 'time' };
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Top Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Orders & Delivery Tracking</Text>
          <Text style={[styles.headerSub, { color: colors.textMuted }]}>
            {orders.length} Registered Order{orders.length > 1 ? 's' : ''} (Real-time Firebase Sync)
          </Text>
        </View>
        <Ionicons name="cube" size={24} color={colors.primary} />
      </View>

      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        {orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={50} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Orders Placed Yet</Text>
            <Text style={[styles.emptySub, { color: colors.textMuted }]}>
              Explore our 50+ item catalog of purifiers and spares to place your first order.
            </Text>
            <TouchableOpacity
              style={[styles.shopBtn, { backgroundColor: colors.primary }]}
              onPress={onExploreProducts}
            >
              <Text style={styles.shopBtnText}>BROWSE CATALOG</Text>
            </TouchableOpacity>
          </View>
        ) : (
          orders.map(order => {
            const statusConfig = getStatusColor(order.status);
            return (
              <View
                key={order.id}
                style={[styles.orderCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                {/* Order Top Bar */}
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={[styles.orderId, { color: colors.primary }]}>{order.id}</Text>
                    <Text style={[styles.orderDate, { color: colors.textMuted }]}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
                    <Ionicons name={statusConfig.icon as any} size={13} color={statusConfig.text} />
                    <Text style={[styles.statusText, { color: statusConfig.text }]}>{order.status}</Text>
                  </View>
                </View>

                {/* Tracking Progress Stepper Bar */}
                <View style={styles.stepperContainer}>
                  {['Confirmed', 'Processing', 'Shipped', 'Delivered'].map((step, idx) => {
                    const steps = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
                    const currentIdx = steps.indexOf(order.status);
                    const stepIdx = steps.indexOf(step);
                    const isDone = currentIdx >= stepIdx;

                    return (
                      <View key={step} style={styles.stepColumn}>
                        <View
                          style={[
                            styles.stepDot,
                            { backgroundColor: isDone ? colors.accentGreen : colors.border }
                          ]}
                        >
                          {isDone && <Ionicons name="checkmark" size={10} color="#ffffff" />}
                        </View>
                        <Text
                          style={[
                            styles.stepLabel,
                            { color: isDone ? colors.text : colors.textMuted }
                          ]}
                        >
                          {step}
                        </Text>
                      </View>
                    );
                  })}
                </View>

                {/* Items Itemized List */}
                <View style={styles.itemsSection}>
                  <Text style={[styles.itemsSectionTitle, { color: colors.textMuted }]}>
                    Purchased Water Spares & Systems ({order.items.length})
                  </Text>
                  {order.items.map((it, i) => (
                    <View key={i} style={styles.itemRow}>
                      <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={1}>
                        • {it.product.name}
                      </Text>
                      <Text style={[styles.itemQtyPrice, { color: colors.textSecondary }]}>
                        {it.quantity}x @ ₹{it.unitPrice.toLocaleString('en-IN')} = ₹{it.totalPrice.toLocaleString('en-IN')}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Footer Details */}
                <View style={[styles.footerDivider, { backgroundColor: colors.border }]} />
                <View style={styles.footerRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.footerAddress, { color: colors.textMuted }]} numberOfLines={1}>
                      📍 {order.shippingAddress}
                    </Text>
                    <Text style={[styles.payIdText, { color: colors.textMuted }]}>
                      💳 Razorpay ID: {order.paymentId}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.totalLabel, { color: colors.textMuted }]}>Paid Total</Text>
                    <Text style={[styles.totalAmount, { color: colors.accentGreen }]}>
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800'
  },
  headerSub: {
    fontSize: 11,
    marginTop: 2
  },
  scrollArea: {
    flex: 1,
    padding: 16
  },
  orderCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  orderId: {
    fontSize: 15,
    fontWeight: '800'
  },
  orderDate: {
    fontSize: 11,
    marginTop: 2
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase'
  },
  stepperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12
  },
  stepColumn: {
    alignItems: 'center',
    flex: 1
  },
  stepDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: '600'
  },
  itemsSection: {
    marginVertical: 4
  },
  itemsSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase'
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3
  },
  itemName: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
    marginRight: 8
  },
  itemQtyPrice: {
    fontSize: 11,
    fontWeight: '500'
  },
  footerDivider: {
    height: 1,
    marginVertical: 10
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  footerAddress: {
    fontSize: 11
  },
  payIdText: {
    fontSize: 10,
    fontFamily: 'monospace',
    marginTop: 2
  },
  totalLabel: {
    fontSize: 10
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '900'
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 14
  },
  emptySub: {
    fontSize: 12,
    textAlign: 'center',
    maxWidth: 260,
    marginTop: 4,
    marginBottom: 20
  },
  shopBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12
  },
  shopBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800'
  }
});
