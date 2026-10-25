import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../data/products';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ImageLightboxModal } from './ImageLightboxModal';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const { colors } = useTheme();
  const { isDealer } = useAuth();
  const { addToCart } = useCart();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const price = isDealer ? product.wholesalePrice : product.retailPrice;
  const originalPrice = product.mrp;
  const savings = originalPrice - price;
  const savingsPercent = Math.round((savings / originalPrice) * 100);

  const handleAddToCart = () => {
    addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {/* Product Image Box with Zoom Trigger */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Zoom Lightbox Trigger */}
        <TouchableOpacity
          onPress={() => setLightboxOpen(true)}
          style={styles.zoomBtn}
          accessibilityLabel="Inspect Image"
        >
          <Ionicons name="scan-outline" size={16} color="#ffffff" />
        </TouchableOpacity>

        {/* Feature / Bestseller Badge */}
        {product.badge && (
          <View style={[styles.badgePill, { backgroundColor: colors.primary }]}>
            <Text style={styles.badgeText}>{product.badge}</Text>
          </View>
        )}

        {/* Dealer Wholesale Flag */}
        {isDealer && (
          <View style={styles.dealerFlag}>
            <Ionicons name="pricetag" size={11} color="#ffffff" />
            <Text style={styles.dealerFlagText}>WHOLESALE MOQ {product.dealerMoq}</Text>
          </View>
        )}
      </View>

      {/* Product Info */}
      <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.infoArea}>
        <Text style={[styles.categoryText, { color: colors.primary }]}>{product.category}</Text>
        <Text style={[styles.titleText, { color: colors.text }]} numberOfLines={2}>
          {product.name}
        </Text>

        {/* Rating and Reviews */}
        <View style={styles.ratingRow}>
          <View style={styles.stars}>
            <Ionicons name="star" size={13} color="#f59e0b" />
            <Text style={[styles.ratingNumber, { color: colors.text }]}>{product.rating}</Text>
          </View>
          <Text style={[styles.reviewsCount, { color: colors.textMuted }]}>
            ({product.reviewsCount})
          </Text>
          <Text style={[styles.stockStatus, { color: product.inStock ? colors.accentGreen : colors.accentRed }]}>
            • {product.inStock ? 'In Stock' : 'Out of Stock'}
          </Text>
        </View>

        {/* Pricing Area */}
        <View style={styles.priceContainer}>
          <View>
            <View style={styles.priceRow}>
              <Text style={[styles.sellingPrice, { color: isDealer ? colors.accentGreen : colors.primary }]}>
                ₹{price.toLocaleString('en-IN')}
              </Text>
              <Text style={styles.mrpPrice}>₹{originalPrice.toLocaleString('en-IN')}</Text>
            </View>
            <Text style={[styles.savingsText, { color: isDealer ? colors.accentGreen : colors.accentOrange }]}>
              {isDealer ? `Save ${savingsPercent}% (Wholesale Margin)` : `Save ₹${savings.toLocaleString('en-IN')} (${savingsPercent}% off)`}
            </Text>
          </View>
        </View>

        {/* Add To Cart Button */}
        <TouchableOpacity
          style={[
            styles.addButton,
            { backgroundColor: justAdded ? colors.accentGreen : colors.primary }
          ]}
          onPress={handleAddToCart}
        >
          <Ionicons
            name={justAdded ? 'checkmark-circle' : isDealer ? 'cube-outline' : 'cart-outline'}
            size={16}
            color="#ffffff"
          />
          <Text style={styles.addButtonText}>
            {justAdded ? 'ADDED!' : isDealer ? `BULK ORDER (${product.dealerMoq} UNITS)` : 'ADD TO CART'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Lightbox Zoom Modal Component */}
      <ImageLightboxModal
        visible={lightboxOpen}
        imageUrl={product.imageUrl}
        title={product.name}
        onClose={() => setLightboxOpen(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3
  },
  imageContainer: {
    height: 180,
    width: '100%',
    position: 'relative',
    backgroundColor: '#0f172a'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  zoomBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  badgePill: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase'
  },
  dealerFlag: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  dealerFlagText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800'
  },
  infoArea: {
    padding: 14
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4
  },
  titleText: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 6
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  stars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginRight: 4
  },
  ratingNumber: {
    fontSize: 12,
    fontWeight: '700'
  },
  reviewsCount: {
    fontSize: 11,
    marginRight: 6
  },
  stockStatus: {
    fontSize: 11,
    fontWeight: '600'
  },
  priceContainer: {
    marginBottom: 12
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8
  },
  sellingPrice: {
    fontSize: 18,
    fontWeight: '900'
  },
  mrpPrice: {
    fontSize: 13,
    color: '#94a3b8',
    textDecorationLine: 'line-through'
  },
  savingsText: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5
  }
});
