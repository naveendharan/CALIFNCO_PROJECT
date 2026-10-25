import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface ProfileScreenProps {
  onOpenReferral: () => void;
  onOpenRoleSwitch: () => void;
  onOpenOrders: () => void;
  onOpenService: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onOpenReferral,
  onOpenRoleSwitch,
  onOpenOrders,
  onOpenService
}) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const { user, isDealer, isAdmin } = useAuth();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Account & Preferences</Text>
        <Ionicons name="settings-outline" size={20} color={colors.text} />
      </View>

      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={[styles.userCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.userRow}>
            <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
              <Ionicons
                name={isDealer ? 'briefcase' : isAdmin ? 'shield-checkmark' : 'person'}
                size={28}
                color={colors.primary}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
              <Text style={[styles.userEmail, { color: colors.textMuted }]}>{user.email}</Text>
              <Text style={[styles.userPhone, { color: colors.textMuted }]}>{user.phone}</Text>
            </View>
          </View>

          {/* Role Pill and Switch Button */}
          <View style={[styles.roleSwitchCard, { backgroundColor: colors.bg, borderColor: colors.border }]}>
            <View>
              <Text style={[styles.roleLabel, { color: colors.textMuted }]}>ACTIVE ACCOUNT ROLE</Text>
              <Text style={[styles.roleValue, { color: colors.primary }]}>
                {user.role.toUpperCase()} {isDealer ? '(B2B WHOLESALE)' : isAdmin ? '(OPERATIONS ADMIN)' : '(RETAIL BUYER)'}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.switchRoleBtn, { backgroundColor: colors.primary }]}
              onPress={onOpenRoleSwitch}
            >
              <Text style={styles.switchRoleBtnText}>SWITCH ROLE</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Referral Club Bonus Section */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onOpenReferral}
          style={[styles.referralBanner, { backgroundColor: colors.card, borderColor: colors.accentOrange }]}
        >
          <View style={[styles.giftCircle, { backgroundColor: '#fef3c7' }]}>
            <Ionicons name="gift" size={24} color="#d97706" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <View style={styles.refTitleRow}>
              <Text style={[styles.refTitle, { color: colors.text }]}>Califnco Referral Club</Text>
              <View style={styles.bonusTag}>
                <Text style={styles.bonusTagText}>+5 PTS BONUS</Text>
              </View>
            </View>
            <Text style={[styles.refSub, { color: colors.textMuted }]}>
              Code: <Text style={{ fontWeight: '800', color: colors.accentOrange }}>{user.referralCode}</Text> • ₹{user.referralEarnings} Earned
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Quick Menu */}
        <View style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TouchableOpacity style={styles.menuItem} onPress={onOpenOrders}>
            <View style={[styles.menuIcon, { backgroundColor: '#e0f2fe' }]}>
              <Ionicons name="receipt-outline" size={18} color="#0284c7" />
            </View>
            <Text style={[styles.menuText, { color: colors.text }]}>Order History & Invoices</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />

          <TouchableOpacity style={styles.menuItem} onPress={onOpenService}>
            <View style={[styles.menuIcon, { backgroundColor: '#dcfce7' }]}>
              <Ionicons name="construct-outline" size={18} color="#166534" />
            </View>
            <Text style={[styles.menuText, { color: colors.text }]}>Book Water Purifier Service / AMC</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* App Polish: Dark Mode Toggle */}
        <View style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.toggleRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={[styles.menuIcon, { backgroundColor: isDark ? '#1e293b' : '#fef3c7' }]}>
                <Ionicons name={isDark ? 'moon' : 'sunny'} size={18} color={isDark ? '#38bdf8' : '#f59e0b'} />
              </View>
              <View>
                <Text style={[styles.menuText, { color: colors.text }]}>Dark Mode Appearance</Text>
                <Text style={[styles.toggleSub, { color: colors.textMuted }]}>
                  {isDark ? 'Oceanic Slate Theme' : 'Clean Light Theme'}
                </Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              thumbColor={isDark ? '#38bdf8' : '#0284c7'}
              trackColor={{ false: '#cbd5e1', true: '#0369a1' }}
            />
          </View>
        </View>

        {/* Company & Support Information */}
        <View style={styles.aboutCard}>
          <Text style={[styles.aboutTitle, { color: colors.textMuted }]}>CALIFNCO WATER TECHNOLOGIES PVT LTD</Text>
          <Text style={[styles.aboutText, { color: colors.textMuted }]}>
            ISO 9001:2015 Certified • NSF Standard 58 Components
          </Text>
          <Text style={[styles.aboutText, { color: colors.textMuted }]}>
            Toll-Free Helpline: 1800-CALI-PURE (1800-225-4787)
          </Text>
          <Text style={[styles.versionText, { color: colors.primary }]}>
            Califnco Mobile App v1.4.0 (Expo + Firebase Spark)
          </Text>
        </View>
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
  scrollArea: {
    flex: 1,
    padding: 16
  },
  userCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center'
  },
  userName: {
    fontSize: 17,
    fontWeight: '800'
  },
  userEmail: {
    fontSize: 12,
    marginTop: 2
  },
  userPhone: {
    fontSize: 12,
    marginTop: 2
  },
  roleSwitchCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10
  },
  roleLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5
  },
  roleValue: {
    fontSize: 12,
    fontWeight: '800',
    marginTop: 2
  },
  switchRoleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8
  },
  switchRoleBtnText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800'
  },
  referralBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14
  },
  giftCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center'
  },
  refTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  refTitle: {
    fontSize: 13,
    fontWeight: '800'
  },
  bonusTag: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4
  },
  bonusTagText: {
    color: '#b45309',
    fontSize: 9,
    fontWeight: '800'
  },
  refSub: {
    fontSize: 11,
    marginTop: 3
  },
  menuCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 6,
    marginBottom: 14
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8
  },
  menuIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  menuText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1
  },
  menuDivider: {
    height: 1,
    marginHorizontal: 8
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 8
  },
  toggleSub: {
    fontSize: 11,
    marginTop: 1
  },
  aboutCard: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20
  },
  aboutTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1
  },
  aboutText: {
    fontSize: 11,
    marginTop: 4
  },
  versionText: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 8
  }
});
