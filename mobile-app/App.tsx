import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, Text, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { CartProvider, useCart } from './src/context/CartContext';
import { NotificationProvider } from './src/context/NotificationContext';

import { Header } from './src/components/Header';
import { PushNotificationBanner } from './src/components/PushNotificationBanner';
import { ReferralModal } from './src/components/ReferralModal';
import { RoleSwitchModal } from './src/screens/RoleSwitchModal';
import { NotificationCenterModal } from './src/screens/NotificationCenterModal';

import { CatalogScreen } from './src/screens/CatalogScreen';
import { ProductDetailScreen } from './src/screens/ProductDetailScreen';
import { CartScreen } from './src/screens/CartScreen';
import { CheckoutScreen } from './src/screens/CheckoutScreen';
import { OrderHistoryScreen } from './src/screens/OrderHistoryScreen';
import { ServiceDeskScreen } from './src/screens/ServiceDeskScreen';
import { DealerPortalScreen } from './src/screens/DealerPortalScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { Product } from './src/data/products';

type Tab = 'catalog' | 'dealer' | 'cart' | 'service' | 'orders' | 'profile';

function MainAppShell() {
  const { colors, isDark } = useTheme();
  const { isDealer, isAdmin } = useAuth();
  const { itemCount } = useCart();

  const [activeTab, setActiveTab] = useState<Tab>('catalog');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [inCheckout, setInCheckout] = useState(false);

  // Global Modals
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [notifModalVisible, setNotifModalVisible] = useState(false);
  const [referralModalVisible, setReferralModalVisible] = useState(false);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleBackToCatalog = () => {
    setSelectedProduct(null);
    setInCheckout(false);
  };

  const handleGoToCart = () => {
    setSelectedProduct(null);
    setInCheckout(false);
    setActiveTab('cart');
  };

  const handleGoToCheckout = () => {
    setInCheckout(true);
  };

  const handleOrderSuccess = () => {
    setInCheckout(false);
    setSelectedProduct(null);
    setActiveTab('orders');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.navBg }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.navBg}
      />

      {/* Floating Push Alert Toast */}
      <PushNotificationBanner />

      {/* Persistent Header */}
      <Header
        onOpenNotifications={() => setNotifModalVisible(true)}
        onOpenReferral={() => setReferralModalVisible(true)}
        onOpenCart={handleGoToCart}
        onSwitchRoleModal={() => setRoleModalVisible(true)}
      />

      {/* Screen Body */}
      <View style={styles.bodyContainer}>
        {inCheckout ? (
          <CheckoutScreen
            onBack={() => setInCheckout(false)}
            onOrderSuccess={handleOrderSuccess}
          />
        ) : selectedProduct ? (
          <ProductDetailScreen
            product={selectedProduct}
            onBack={handleBackToCatalog}
            onGoToCart={handleGoToCart}
          />
        ) : (
          <>
            {activeTab === 'catalog' && (
              <CatalogScreen onSelectProduct={handleSelectProduct} />
            )}
            {activeTab === 'dealer' && (
              <DealerPortalScreen
                onGoToCart={handleGoToCart}
                onExploreCatalog={() => setActiveTab('catalog')}
              />
            )}
            {activeTab === 'cart' && (
              <CartScreen
                onGoToCheckout={handleGoToCheckout}
                onExploreProducts={() => setActiveTab('catalog')}
              />
            )}
            {activeTab === 'service' && <ServiceDeskScreen />}
            {activeTab === 'orders' && (
              <OrderHistoryScreen onExploreProducts={() => setActiveTab('catalog')} />
            )}
            {activeTab === 'profile' && (
              <ProfileScreen
                onOpenReferral={() => setReferralModalVisible(true)}
                onOpenRoleSwitch={() => setRoleModalVisible(true)}
                onOpenOrders={() => setActiveTab('orders')}
                onOpenService={() => setActiveTab('service')}
              />
            )}
          </>
        )}
      </View>

      {/* Bottom Navigation Bar */}
      {!inCheckout && !selectedProduct && (
        <View style={[styles.bottomNav, { backgroundColor: colors.navBg, borderColor: colors.border }]}>
          {/* Catalog Tab */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveTab('catalog')}
          >
            <Ionicons
              name={activeTab === 'catalog' ? 'water' : 'water-outline'}
              size={21}
              color={activeTab === 'catalog' ? colors.primary : colors.textMuted}
            />
            <Text
              style={[
                styles.navLabel,
                { color: activeTab === 'catalog' ? colors.primary : colors.textMuted }
              ]}
            >
              50+ Items
            </Text>
          </TouchableOpacity>

          {/* Dealer Wholesale Tab */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveTab('dealer')}
          >
            <Ionicons
              name={activeTab === 'dealer' ? 'briefcase' : 'briefcase-outline'}
              size={21}
              color={activeTab === 'dealer' ? '#f59e0b' : colors.textMuted}
            />
            <Text
              style={[
                styles.navLabel,
                { color: activeTab === 'dealer' ? '#f59e0b' : colors.textMuted }
              ]}
            >
              Wholesale
            </Text>
          </TouchableOpacity>

          {/* Cart Tab with Badge */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveTab('cart')}
          >
            <View style={{ position: 'relative' }}>
              <Ionicons
                name={activeTab === 'cart' ? 'cart' : 'cart-outline'}
                size={22}
                color={activeTab === 'cart' ? colors.primary : colors.textMuted}
              />
              {itemCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{itemCount}</Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.navLabel,
                { color: activeTab === 'cart' ? colors.primary : colors.textMuted }
              ]}
            >
              Cart
            </Text>
          </TouchableOpacity>

          {/* Service Desk Tab */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveTab('service')}
          >
            <Ionicons
              name={activeTab === 'service' ? 'construct' : 'construct-outline'}
              size={21}
              color={activeTab === 'service' ? colors.primary : colors.textMuted}
            />
            <Text
              style={[
                styles.navLabel,
                { color: activeTab === 'service' ? colors.primary : colors.textMuted }
              ]}
            >
              Service Desk
            </Text>
          </TouchableOpacity>

          {/* Orders History Tab */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveTab('orders')}
          >
            <Ionicons
              name={activeTab === 'orders' ? 'receipt' : 'receipt-outline'}
              size={21}
              color={activeTab === 'orders' ? colors.primary : colors.textMuted}
            />
            <Text
              style={[
                styles.navLabel,
                { color: activeTab === 'orders' ? colors.primary : colors.textMuted }
              ]}
            >
              Orders
            </Text>
          </TouchableOpacity>

          {/* Profile Tab */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveTab('profile')}
          >
            <Ionicons
              name={activeTab === 'profile' ? 'person' : 'person-outline'}
              size={21}
              color={activeTab === 'profile' ? colors.primary : colors.textMuted}
            />
            <Text
              style={[
                styles.navLabel,
                { color: activeTab === 'profile' ? colors.primary : colors.textMuted }
              ]}
            >
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Global Modals */}
      <RoleSwitchModal
        visible={roleModalVisible}
        onClose={() => setRoleModalVisible(false)}
      />

      <NotificationCenterModal
        visible={notifModalVisible}
        onClose={() => setNotifModalVisible(false)}
      />

      <ReferralModal
        visible={referralModalVisible}
        onClose={() => setReferralModalVisible(false)}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <NotificationProvider>
            <MainAppShell />
          </NotificationProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  bodyContainer: {
    flex: 1
  },
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderTopWidth: 1
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    minWidth: 50
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#f59e0b',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3
  },
  cartBadgeText: {
    color: '#000000',
    fontSize: 9,
    fontWeight: '800'
  }
});
