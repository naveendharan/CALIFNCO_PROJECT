import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface CartScreenProps {
  onGoToCheckout: () => void;
  onExploreProducts: () => void;
}

export const CartScreen: React.FC<CartScreenProps> = ({
  onGoToCheckout,
  onExploreProducts
}) => {
  const { colors } = useTheme();
  const { isDealer } = useAuth();
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discount,
    discountCode,
    applyDiscountCode,
    removeDiscountCode,
    tax,
    shipping,
    total,
    totalWholesaleSavings
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; success: boolean } | null>(null);

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    const res = applyDiscountCode(couponInput);
    setCouponMsg({ text: res.message, success: res.success });
    if (res.success) setCouponInput('');
  };

  if (items.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.bg }]}>
        <View style={[styles.emptyIconCircle, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="cart-outline" size={54} color={colors.textMuted} />
        </View>
        <Text style={[styles.emptyTitle, { color: colors.text }]}>Your Cart is Empty</Text>
        <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
          Explore our catalog of 50+ domestic ROs, heavy commercial water coolers, booster pumps & certified spares.
        </Text>
        <TouchableOpacity
          style={[styles.shopNowBtn, { backgroundColor: colors.primary }]}
          onPress={onExploreProducts}
        >
          <Ionicons name="sparkles" size={18} color="#ffffff" />
          <Text style={styles.shopNowText}>EXPLORE 50+ WATER PRODUCTS</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Header Bar */}
      <View style={[styles.header, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Shopping Cart</Text>
          <Text style={[styles.headerSub, { color: colors.textMuted }]}>
            {items.length} Product Line{items.length > 1 ? 's' : ''} ({isDealer ? 'Wholesale Pricing Active' : 'Retail'})
          </Text>
        </View>
        <TouchableOpacity onPress={clearCart} style={styles.clearBtn}>
          <Text style={[styles.clearBtnText, { color: colors.accentRed }]}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        {/* Wholesale Bulk Savings Banner */}
        {isDealer && totalWholesaleSavings > 0 && (
          <View style={styles.savingsBanner}>
            <Ionicons name="pricetag" size={18} color="#166534" />
            <View style={{ flex: 1 }}>
              <Text style={styles.savingsBannerTitle}>Wholesale Margin Verified</Text>
              <Text style={styles.savingsBannerSub}>
                You are saving ₹{totalWholesaleSavings.toLocaleString('en-IN')} vs retail MRP on this bulk batch.
              </Text>
            </View>
          </View>
        )}

        {/* Cart Items List */}
        <View style={styles.itemsList}>
          {items.map(item => {
            const unitPrice = isDealer ? item.product.wholesalePrice : item.product.retailPrice;
            const lineTotal = unitPrice * item.quantity;
            const minQty = isDealer ? item.product.dealerMoq : 1;

            return (
              <View
                key={item.product.id}
                style={[styles.cartItemCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <Image source={{ uri: item.product.imageUrl }} style={styles.itemImage} />

                <View style={styles.itemDetails}>
                  <Text style={[styles.itemCategory, { color: colors.primary }]}>
                    {item.product.category}
                  </Text>
                  <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={2}>
                    {item.product.name}
                  </Text>

                  <View style={styles.itemPriceRow}>
                    <Text style={[styles.itemUnitPrice, { color: isDealer ? colors.accentGreen : colors.primary }]}>
                      ₹{unitPrice.toLocaleString('en-IN')}
                    </Text>
                    <Text style={styles.itemUnitLabel}>/ unit</Text>
                    {isDealer && (
                      <View style={styles.moqPill}>
                        <Text style={styles.moqPillText}>MOQ {item.product.dealerMoq}</Text>
                      </View>
                    )}
                  </View>

                  {/* Quantity Stepper and Remove */}
                  <View style={styles.cardActionsRow}>
                    <View style={[styles.stepper, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                      <TouchableOpacity
                        onPress={() => updateQuantity(item.product.id, item.quantity - (isDealer ? item.product.dealerMoq : 1))}
                        style={styles.stepperBtn}
                      >
                        <Ionicons name="remove" size={14} color={colors.text} />
                      </TouchableOpacity>
                      <Text style={[styles.stepperNumber, { color: colors.text }]}>{item.quantity}</Text>
                      <TouchableOpacity
                        onPress={() => updateQuantity(item.product.id, item.quantity + (isDealer ? item.product.dealerMoq : 1))}
                        style={styles.stepperBtn}
                      >
                        <Ionicons name="add" size={14} color={colors.text} />
                      </TouchableOpacity>
                    </View>

                    <Text style={[styles.lineTotalText, { color: colors.text }]}>
                      ₹{lineTotal.toLocaleString('en-IN')}
                    </Text>

                    <TouchableOpacity onPress={() => removeFromCart(item.product.id)} style={styles.deleteBtn}>
                      <Ionicons name="trash-outline" size={16} color={colors.accentRed} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Promo / Referral Voucher Section */}
        <View style={[styles.couponCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.couponTitle, { color: colors.text }]}>Referral / Voucher Code</Text>
          {discountCode ? (
            <View style={styles.appliedCodeRow}>
              <View style={styles.appliedCodeBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text style={styles.appliedCodeText}>{discountCode} (-₹{discount.toLocaleString('en-IN')})</Text>
              </View>
              <TouchableOpacity onPress={removeDiscountCode}>
                <Ionicons name="close-circle" size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.couponInputRow}>
              <TextInput
                style={[styles.couponInput, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
                placeholder="Try: WELCOME10 or DEALERVIP"
                placeholderTextColor={colors.textMuted}
                value={couponInput}
                onChangeText={setCouponInput}
                autoCapitalize="characters"
              />
              <TouchableOpacity
                style={[styles.applyCouponBtn, { backgroundColor: colors.primary }]}
                onPress={handleApplyCoupon}
              >
                <Text style={styles.applyCouponText}>APPLY</Text>
              </TouchableOpacity>
            </View>
          )}

          {couponMsg && (
            <Text style={[styles.couponFeedback, { color: couponMsg.success ? colors.accentGreen : colors.accentRed }]}>
              {couponMsg.text}
            </Text>
          )}
        </View>

        {/* Price Breakdown Bill Summary */}
        <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.summaryTitle, { color: colors.text }]}>Order Price Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Items Subtotal</Text>
            <Text style={[styles.summaryVal, { color: colors.text }]}>₹{subtotal.toLocaleString('en-IN')}</Text>
          </View>

          {discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.accentGreen }]}>Voucher Discount</Text>
              <Text style={[styles.summaryVal, { color: colors.accentGreen }]}>-₹{discount.toLocaleString('en-IN')}</Text>
            </View>
          )}

          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>GST / Taxes (18% Statutory)</Text>
            <Text style={[styles.summaryVal, { color: colors.text }]}>₹{tax.toLocaleString('en-IN')}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Delivery & Insurance</Text>
            <Text style={[styles.summaryVal, { color: shipping === 0 ? colors.accentGreen : colors.text }]}>
              {shipping === 0 ? 'FREE' : `₹${shipping}`}
            </Text>
          </View>

          <View style={[styles.totalDivider, { backgroundColor: colors.border }]} />

          <View style={styles.totalRow}>
            <View>
              <Text style={[styles.totalLabel, { color: colors.text }]}>Total Amount</Text>
              <Text style={[styles.inclusiveTag, { color: colors.textMuted }]}>Includes 18% GST & Free Transit Insurance</Text>
            </View>
            <Text style={[styles.totalVal, { color: isDealer ? colors.accentGreen : colors.primary }]}>
              ₹{total.toLocaleString('en-IN')}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Checkout Bottom Bar */}
      <View style={[styles.bottomBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View>
          <Text style={[styles.checkoutGrandLabel, { color: colors.textMuted }]}>Grand Total</Text>
          <Text style={[styles.checkoutGrandPrice, { color: isDealer ? colors.accentGreen : colors.primary }]}>
            ₹{total.toLocaleString('en-IN')}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.checkoutBtn, { backgroundColor: colors.primary }]}
          onPress={onGoToCheckout}
        >
          <Ionicons name="card-outline" size={18} color="#ffffff" />
          <Text style={styles.checkoutBtnText}>CHECKOUT WITH RAZORPAY</Text>
        </TouchableOpacity>
      </View>
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
    paddingVertical: 12,
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
  clearBtn: {
    padding: 6
  },
  clearBtnText: {
    fontSize: 12,
    fontWeight: '700'
  },
  scrollArea: {
    flex: 1,
    padding: 16
  },
  savingsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#dcfce7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#86efac'
  },
  savingsBannerTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#166534'
  },
  savingsBannerSub: {
    fontSize: 11,
    color: '#15803d',
    marginTop: 2
  },
  itemsList: {
    marginBottom: 14
  },
  cartItemCard: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#0f172a'
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12
  },
  itemCategory: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  itemName: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: 2
  },
  itemPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginTop: 4,
    marginBottom: 8
  },
  itemUnitPrice: {
    fontSize: 14,
    fontWeight: '800'
  },
  itemUnitLabel: {
    fontSize: 10,
    color: '#94a3b8'
  },
  moqPill: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 6
  },
  moqPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#b45309'
  },
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16
  },
  stepperBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  stepperNumber: {
    fontSize: 12,
    fontWeight: '800',
    minWidth: 18,
    textAlign: 'center'
  },
  lineTotalText: {
    fontSize: 14,
    fontWeight: '800'
  },
  deleteBtn: {
    padding: 4
  },
  couponCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14
  },
  couponTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8
  },
  couponInputRow: {
    flexDirection: 'row',
    gap: 8
  },
  couponInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    fontWeight: '600'
  },
  applyCouponBtn: {
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  applyCouponText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800'
  },
  appliedCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#dcfce7',
    padding: 8,
    borderRadius: 8
  },
  appliedCodeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  appliedCodeText: {
    color: '#166534',
    fontSize: 13,
    fontWeight: '700'
  },
  couponFeedback: {
    fontSize: 11,
    marginTop: 6,
    fontWeight: '600'
  },
  summaryCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 24
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 10
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4
  },
  summaryLabel: {
    fontSize: 12
  },
  summaryVal: {
    fontSize: 12,
    fontWeight: '600'
  },
  totalDivider: {
    height: 1,
    marginVertical: 10
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '800'
  },
  inclusiveTag: {
    fontSize: 9,
    marginTop: 2
  },
  totalVal: {
    fontSize: 20,
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
  checkoutGrandLabel: {
    fontSize: 10
  },
  checkoutGrandPrice: {
    fontSize: 18,
    fontWeight: '900'
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12
  },
  checkoutBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    maxWidth: 280
  },
  shopNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 14
  },
  shopNowText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5
  }
});
