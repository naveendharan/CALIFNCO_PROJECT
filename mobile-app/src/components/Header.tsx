import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';

interface HeaderProps {
  onOpenNotifications?: () => void;
  onOpenReferral?: () => void;
  onOpenCart?: () => void;
  onSwitchRoleModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNotifications,
  onOpenReferral,
  onOpenCart,
  onSwitchRoleModal
}) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const { user, isDealer, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const { unreadCount } = useNotifications();

  return (
    <View style={[styles.container, { backgroundColor: colors.navBg, borderColor: colors.border }]}>
      {/* Brand Title */}
      <View style={styles.brandContainer}>
        <View style={[styles.logoIcon, { backgroundColor: colors.primaryLight }]}>
          <Ionicons name="water" size={18} color={colors.primary} />
        </View>
        <View>
          <Text style={[styles.brandText, { color: colors.text }]}>CALIFNCO</Text>
          <Text style={[styles.subText, { color: colors.textMuted }]}>Water Tech Pure Life</Text>
        </View>
      </View>

      {/* Role Pill */}
      <TouchableOpacity
        onPress={onSwitchRoleModal}
        style={[
          styles.roleBadge,
          {
            backgroundColor: isDealer ? '#fef3c7' : isAdmin ? '#f3e8ff' : colors.primaryLight,
            borderColor: isDealer ? '#f59e0b' : isAdmin ? '#9333ea' : colors.primary
          }
        ]}
      >
        <Ionicons
          name={isDealer ? 'briefcase' : isAdmin ? 'shield-checkmark' : 'person'}
          size={12}
          color={isDealer ? '#b45309' : isAdmin ? '#7e22ce' : colors.primary}
        />
        <Text
          style={[
            styles.roleText,
            { color: isDealer ? '#b45309' : isAdmin ? '#7e22ce' : colors.primary }
          ]}
        >
          {isDealer ? 'DEALER' : isAdmin ? 'ADMIN' : 'CUSTOMER'}
        </Text>
      </TouchableOpacity>

      {/* Right Action Icons */}
      <View style={styles.actionsRow}>
        {/* Referral Gift Icon */}
        <TouchableOpacity onPress={onOpenReferral} style={styles.iconBtn}>
          <Ionicons name="gift-outline" size={21} color={colors.accentOrange} />
        </TouchableOpacity>

        {/* Dark Mode Toggle */}
        <TouchableOpacity onPress={toggleTheme} style={styles.iconBtn}>
          <Ionicons name={isDark ? 'sunny-outline' : 'moon-outline'} size={21} color={colors.text} />
        </TouchableOpacity>

        {/* Notifications Icon with Badge */}
        <TouchableOpacity onPress={onOpenNotifications} style={styles.iconBtn}>
          <Ionicons name="notifications-outline" size={21} color={colors.text} />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Cart Icon with Badge */}
        <TouchableOpacity onPress={onOpenCart} style={[styles.iconBtn, styles.cartBtn, { backgroundColor: colors.primary }]}>
          <Ionicons name="cart-outline" size={20} color="#ffffff" />
          {itemCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{itemCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  brandText: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1
  },
  subText: {
    fontSize: 9,
    letterSpacing: 0.5
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1
  },
  roleText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  iconBtn: {
    padding: 6,
    position: 'relative'
  },
  cartBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '700'
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#f59e0b',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#ffffff'
  },
  cartBadgeText: {
    color: '#000000',
    fontSize: 9,
    fontWeight: '800'
  }
});
