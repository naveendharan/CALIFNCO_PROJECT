import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PRODUCTS, Product } from '../data/products';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';

interface DealerPortalScreenProps {
  onGoToCart: () => void;
  onExploreCatalog: () => void;
}

export const DealerPortalScreen: React.FC<DealerPortalScreenProps> = ({
  onGoToCart,
  onExploreCatalog
}) => {
  const { colors } = useTheme();
  const { user, isDealer, loginAsDealer } = useAuth();
  const { addToCart, totalWholesaleSavings } = useCart();
  const { triggerPushAlert } = useNotifications();
  const [quotationGenerated, setQuotationGenerated] = useState(false);

  // Filter top wholesale spares & fast-moving items
  const wholesaleFocusItems = PRODUCTS.filter(p =>
    ['CAL-PMP-401', 'CAL-FLT-501', 'CAL-MEM-601', 'CAL-SPR-701', 'CAL-PLT-302', 'CAL-RO-101'].includes(p.id)
  );

  const handleBulkAdd = (product: Product, bulkMultiplier: number) => {
    const qty = product.dealerMoq * bulkMultiplier;
    addToCart(product, qty);
    triggerPushAlert(
      '📦 Bulk Batch Added',
      `Added ${qty} units of ${product.name} at wholesale rate ₹${product.wholesalePrice}.`,
      'dealer'
    );
  };

  const handleGenerateQuotation = () => {
    setQuotationGenerated(true);
    triggerPushAlert(
      '📄 GST Wholesale Quotation Ready',
      `Quotation #Q-CALI-${Math.floor(1000 + Math.random() * 9000)} generated with 18% input credit breakdown.`,
      'dealer'
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Top Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Dealer B2B Wholesale Hub</Text>
          <Text style={[styles.headerSub, { color: colors.textMuted }]}>
            Direct Manufacturer Bulk Pricing & High Margin Spares
          </Text>
        </View>
        <Ionicons name="briefcase" size={24} color="#f59e0b" />
      </View>

      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        {/* Dealer Business Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: '#f59e0b' }]}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarCircle}>
              <Ionicons name="business" size={22} color="#ffffff" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.businessName, { color: colors.text }]}>
                {user.businessName || 'Vikram RO Solutions & Spares Distribution'}
              </Text>
              <Text style={styles.gstText}>
                GSTIN: {user.gstNumber || '29ABCDE1234F1Z5'} • Gold Certified
              </Text>
            </View>
            <View style={styles.approvedPill}>
              <Ionicons name="checkmark-seal" size={12} color="#166534" />
              <Text style={styles.approvedText}>VERIFIED</Text>
            </View>
          </View>

          <View style={[styles.profileDivider, { backgroundColor: colors.border }]} />

          <View style={styles.dealerMetricsRow}>
            <View style={styles.metricItem}>
              <Text style={[styles.metricVal, { color: colors.accentGreen }]}>35% - 48%</Text>
              <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Wholesale Margin</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={[styles.metricVal, { color: colors.primary }]}>₹10,000</Text>
              <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Credit Limit</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={[styles.metricVal, { color: '#f59e0b' }]}>Tier 1</Text>
              <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Distributor Tier</Text>
            </View>
          </View>
        </View>

        {/* Wholesale Quotation Generator Banner */}
        <View style={[styles.quotationCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.quotationHeader}>
            <Ionicons name="document-text" size={20} color={colors.primary} />
            <Text style={[styles.quotationTitle, { color: colors.text }]}>
              Instant GST Wholesale Quotation
            </Text>
          </View>
          <Text style={[styles.quotationSub, { color: colors.textMuted }]}>
            Generate an official proforma invoice with HSN codes and 18% GST input credit tax breakdown for your accounting books.
          </Text>

          <TouchableOpacity
            style={[styles.quotationBtn, { backgroundColor: colors.primary }]}
            onPress={handleGenerateQuotation}
          >
            <Ionicons name="download-outline" size={16} color="#ffffff" />
            <Text style={styles.quotationBtnText}>
              {quotationGenerated ? 'QUOTATION DOWNLOADED (PDF)' : 'GENERATE BULK PROFORMA QUOTATION'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Fast-Moving Bulk Catalog Matrix */}
        <View style={styles.matrixHeaderRow}>
          <Text style={[styles.matrixTitle, { color: colors.text }]}>Fast-Moving Bulk Inventory</Text>
          <TouchableOpacity onPress={onExploreCatalog}>
            <Text style={[styles.viewAllText, { color: colors.primary }]}>View All 50+ Items →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.itemsMatrix}>
          {wholesaleFocusItems.map(prod => {
            const margin = Math.round(((prod.retailPrice - prod.wholesalePrice) / prod.retailPrice) * 100);

            return (
              <View
                key={prod.id}
                style={[styles.matrixCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={styles.cardTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.prodCategory, { color: colors.primary }]}>{prod.category}</Text>
                    <Text style={[styles.prodName, { color: colors.text }]} numberOfLines={1}>
                      {prod.name}
                    </Text>
                  </View>
                  <View style={styles.marginPill}>
                    <Text style={styles.marginText}>{margin}% MARGIN</Text>
                  </View>
                </View>

                {/* Pricing comparison */}
                <View style={styles.matrixPriceRow}>
                  <View>
                    <Text style={styles.rateLabel}>Wholesale Unit Rate</Text>
                    <Text style={[styles.wholesaleRate, { color: colors.accentGreen }]}>
                      ₹{prod.wholesalePrice.toLocaleString('en-IN')}
                    </Text>
                  </View>

                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.rateLabel}>Retail MRP</Text>
                    <Text style={styles.retailCrossed}>₹{prod.retailPrice.toLocaleString('en-IN')}</Text>
                  </View>
                </View>

                {/* Bulk Tier Buttons */}
                <View style={styles.tierButtonsRow}>
                  <TouchableOpacity
                    style={[styles.tierBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
                    onPress={() => handleBulkAdd(prod, 1)}
                  >
                    <Text style={[styles.tierBtnText, { color: colors.text }]}>
                      + {prod.dealerMoq} Units (₹{(prod.dealerMoq * prod.wholesalePrice).toLocaleString('en-IN')})
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.tierBtn, styles.tierBtnHighlight, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}
                    onPress={() => handleBulkAdd(prod, 2)}
                  >
                    <Text style={[styles.tierBtnText, { color: colors.primary, fontWeight: '800' }]}>
                      + {prod.dealerMoq * 2} Units
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {/* View Cart Floating Action */}
        <TouchableOpacity
          style={[styles.viewCartBtn, { backgroundColor: colors.primary }]}
          onPress={onGoToCart}
        >
          <Ionicons name="cart" size={18} color="#ffffff" />
          <Text style={styles.viewCartBtnText}>PROCEED TO WHOLESALE CART & CHECKOUT</Text>
        </TouchableOpacity>
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
  profileCard: {
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f59e0b',
    justifyContent: 'center',
    alignItems: 'center'
  },
  businessName: {
    fontSize: 14,
    fontWeight: '800'
  },
  gstText: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2
  },
  approvedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12
  },
  approvedText: {
    color: '#166534',
    fontSize: 9,
    fontWeight: '800'
  },
  profileDivider: {
    height: 1,
    marginVertical: 12
  },
  dealerMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  metricItem: {
    alignItems: 'center'
  },
  metricVal: {
    fontSize: 16,
    fontWeight: '800'
  },
  metricLabel: {
    fontSize: 10,
    marginTop: 2
  },
  metricDivider: {
    width: 1,
    backgroundColor: '#cbd5e1'
  },
  quotationCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16
  },
  quotationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4
  },
  quotationTitle: {
    fontSize: 13,
    fontWeight: '800'
  },
  quotationSub: {
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 10
  },
  quotationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 10
  },
  quotationBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  matrixHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  matrixTitle: {
    fontSize: 15,
    fontWeight: '800'
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700'
  },
  itemsMatrix: {
    gap: 12,
    marginBottom: 20
  },
  matrixCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  prodCategory: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  prodName: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2
  },
  marginPill: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6
  },
  marginText: {
    color: '#166534',
    fontSize: 10,
    fontWeight: '800'
  },
  matrixPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginVertical: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: '#f1f5f9'
  },
  rateLabel: {
    fontSize: 10,
    color: '#94a3b8'
  },
  wholesaleRate: {
    fontSize: 17,
    fontWeight: '900',
    marginTop: 1
  },
  retailCrossed: {
    fontSize: 13,
    color: '#94a3b8',
    textDecorationLine: 'line-through'
  },
  tierButtonsRow: {
    flexDirection: 'row',
    gap: 8
  },
  tierBtn: {
    flex: 1,
    borderWidth: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center'
  },
  tierBtnHighlight: {
    borderWidth: 1.5
  },
  tierBtnText: {
    fontSize: 11,
    fontWeight: '600'
  },
  viewCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 30
  },
  viewCartBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800'
  }
});
