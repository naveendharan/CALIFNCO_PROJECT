import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../data/products';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ImageLightboxModal } from '../components/ImageLightboxModal';

interface ProductDetailScreenProps {
  product: Product;
  onBack: () => void;
  onGoToCart: () => void;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  product,
  onBack,
  onGoToCart
}) => {
  const { colors } = useTheme();
  const { isDealer } = useAuth();
  const { addToCart } = useCart();
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [quantity, setQuantity] = useState(isDealer ? product.dealerMoq : 1);
  const [added, setAdded] = useState(false);

  const unitPrice = isDealer ? product.wholesalePrice : product.retailPrice;
  const totalPrice = unitPrice * quantity;
  const mrpTotal = product.mrp * quantity;
  const savings = mrpTotal - totalPrice;

  const minQty = isDealer ? product.dealerMoq : 1;

  const incrementQty = () => setQuantity(prev => prev + (isDealer ? product.dealerMoq : 1));
  const decrementQty = () => setQuantity(prev => Math.max(minQty, prev - (isDealer ? product.dealerMoq : 1)));

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Top Navigation Bar */}
      <View style={[styles.topBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.topTitle, { color: colors.text }]} numberOfLines={1}>
          {product.name}
        </Text>
        <TouchableOpacity onPress={onGoToCart} style={styles.cartIconBtn}>
          <Ionicons name="cart-outline" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        {/* Main Product Image Container with Lightbox Trigger */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.zoomButton}
            onPress={() => setLightboxVisible(true)}
          >
            <Ionicons name="scan-outline" size={18} color="#ffffff" />
            <Text style={styles.zoomText}>Pinch & Zoom</Text>
          </TouchableOpacity>
          {product.badge && (
            <View style={[styles.badge, { backgroundColor: colors.primary }]}>
              <Text style={styles.badgeText}>{product.badge}</Text>
            </View>
          )}
        </View>

        {/* Content Details */}
        <View style={styles.detailsContent}>
          <Text style={[styles.category, { color: colors.primary }]}>{product.category}</Text>
          <Text style={[styles.title, { color: colors.text }]}>{product.name}</Text>

          {/* Rating & Stock */}
          <View style={styles.ratingRow}>
            <View style={styles.stars}>
              <Ionicons name="star" size={16} color="#f59e0b" />
              <Text style={[styles.ratingNumber, { color: colors.text }]}>{product.rating}</Text>
            </View>
            <Text style={[styles.reviews, { color: colors.textMuted }]}>
              {product.reviewsCount} Customer Ratings
            </Text>
            <View style={[styles.stockPill, { backgroundColor: product.inStock ? '#dcfce7' : '#fee2e2' }]}>
              <Text style={{ color: product.inStock ? '#166534' : '#991b1b', fontSize: 11, fontWeight: '700' }}>
                {product.inStock ? `In Stock (${product.stockCount} units)` : 'Out of Stock'}
              </Text>
            </View>
          </View>

          {/* Pricing Card */}
          <View style={[styles.priceCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.priceRow}>
              <View>
                <Text style={[styles.priceLabel, { color: colors.textMuted }]}>
                  {isDealer ? 'DEALER WHOLESALE RATE' : 'OFFICIAL RETAIL PRICE'}
                </Text>
                <View style={styles.numberRow}>
                  <Text style={[styles.price, { color: isDealer ? colors.accentGreen : colors.primary }]}>
                    ₹{unitPrice.toLocaleString('en-IN')}
                  </Text>
                  <Text style={styles.mrp}>MRP ₹{product.mrp.toLocaleString('en-IN')}</Text>
                </View>
              </View>
              <View style={[styles.savingsBadge, { backgroundColor: isDealer ? '#dcfce7' : '#e0f2fe' }]}>
                <Text style={{ color: isDealer ? '#166534' : '#0369a1', fontWeight: '800', fontSize: 12 }}>
                  SAVE ₹{savings.toLocaleString('en-IN')}
                </Text>
              </View>
            </View>

            {isDealer && (
              <View style={styles.moqBox}>
                <Ionicons name="information-circle" size={16} color="#0284c7" />
                <Text style={styles.moqText}>
                  Minimum Wholesale Batch: <Text style={{ fontWeight: '800' }}>{product.dealerMoq} units</Text>
                </Text>
              </View>
            )}
          </View>

          {/* Quantity Selector */}
          <View style={[styles.qtyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.qtyLabel, { color: colors.text }]}>
              {isDealer ? 'Wholesale Quantity (Units):' : 'Select Quantity:'}
            </Text>
            <View style={styles.stepperRow}>
              <TouchableOpacity onPress={decrementQty} style={[styles.stepBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                <Ionicons name="remove" size={18} color={colors.text} />
              </TouchableOpacity>
              <Text style={[styles.qtyNumber, { color: colors.text }]}>{quantity}</Text>
              <TouchableOpacity onPress={incrementQty} style={[styles.stepBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                <Ionicons name="add" size={18} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Product Overview</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {product.description}
            </Text>
          </View>

          {/* Key Features */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Key Highlights</Text>
            {product.features.map((feat, idx) => (
              <View key={idx} style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={18} color={colors.accentGreen} />
                <Text style={[styles.featureText, { color: colors.textSecondary }]}>{feat}</Text>
              </View>
            ))}
          </View>

          {/* Technical Specifications Table */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Technical Specifications</Text>
            <View style={[styles.specsTable, { borderColor: colors.border }]}>
              {Object.entries(product.specifications).map(([key, val], idx) => (
                <View
                  key={key}
                  style={[
                    styles.specsRow,
                    {
                      backgroundColor: idx % 2 === 0 ? colors.card : colors.bg,
                      borderColor: colors.border
                    }
                  ]}
                >
                  <Text style={[styles.specKey, { color: colors.textMuted }]}>{key}</Text>
                  <Text style={[styles.specVal, { color: colors.text }]}>{val}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Warranty & Installation Guarantee */}
          <View style={[styles.warrantyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="shield-checkmark" size={24} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.warrantyTitle, { color: colors.text }]}>Califnco Warranty & Assurance</Text>
              <Text style={[styles.warrantyText, { color: colors.textMuted }]}>{product.warranty}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Fixed Checkout / Add Bar */}
      <View style={[styles.bottomBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View>
          <Text style={[styles.bottomTotalLabel, { color: colors.textMuted }]}>
            {quantity} Unit{quantity > 1 ? 's' : ''} Subtotal
          </Text>
          <Text style={[styles.bottomTotalPrice, { color: isDealer ? colors.accentGreen : colors.primary }]}>
            ₹{totalPrice.toLocaleString('en-IN')}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.addCartBtn, { backgroundColor: added ? colors.accentGreen : colors.primary }]}
          onPress={handleAddToCart}
        >
          <Ionicons name={added ? 'checkmark-circle' : 'cart'} size={18} color="#ffffff" />
          <Text style={styles.addCartText}>
            {added ? 'ADDED TO CART' : isDealer ? 'ADD BULK ORDER' : 'ADD TO CART'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Image Lightbox Modal */}
      <ImageLightboxModal
        visible={lightboxVisible}
        imageUrl={product.imageUrl}
        title={product.name}
        onClose={() => setLightboxVisible(false)}
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
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
    marginHorizontal: 12
  },
  cartIconBtn: {
    padding: 4
  },
  scrollArea: {
    flex: 1
  },
  imageContainer: {
    width: '100%',
    height: 280,
    backgroundColor: '#0f172a',
    position: 'relative'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  zoomButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20
  },
  zoomText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700'
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800'
  },
  detailsContent: {
    padding: 16
  },
  category: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
    marginBottom: 8
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16
  },
  stars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  ratingNumber: {
    fontSize: 13,
    fontWeight: '700'
  },
  reviews: {
    fontSize: 12
  },
  stockPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12
  },
  priceCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  priceLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginTop: 2
  },
  price: {
    fontSize: 24,
    fontWeight: '900'
  },
  mrp: {
    fontSize: 14,
    color: '#94a3b8',
    textDecorationLine: 'line-through'
  },
  savingsBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8
  },
  moqBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: '#e2e8f0'
  },
  moqText: {
    fontSize: 12,
    color: '#0369a1'
  },
  qtyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 16
  },
  qtyLabel: {
    fontSize: 13,
    fontWeight: '700'
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  qtyNumber: {
    fontSize: 16,
    fontWeight: '800',
    minWidth: 24,
    textAlign: 'center'
  },
  section: {
    marginBottom: 18
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 8
  },
  description: {
    fontSize: 13,
    lineHeight: 20
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6
  },
  featureText: {
    fontSize: 13,
    fontWeight: '500'
  },
  specsTable: {
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden'
  },
  specsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderBottomWidth: 1
  },
  specKey: {
    fontSize: 12,
    fontWeight: '600'
  },
  specVal: {
    fontSize: 12,
    fontWeight: '700'
  },
  warrantyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 24
  },
  warrantyTitle: {
    fontSize: 13,
    fontWeight: '800'
  },
  warrantyText: {
    fontSize: 12,
    marginTop: 2
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1
  },
  bottomTotalLabel: {
    fontSize: 11
  },
  bottomTotalPrice: {
    fontSize: 20,
    fontWeight: '900'
  },
  addCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12
  },
  addCartText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5
  }
});
