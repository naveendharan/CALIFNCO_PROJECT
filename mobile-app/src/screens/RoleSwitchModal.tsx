import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, UserRole } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface RoleSwitchModalProps {
  visible: boolean;
  onClose: () => void;
}

export const RoleSwitchModal: React.FC<RoleSwitchModalProps> = ({ visible, onClose }) => {
  const { colors } = useTheme();
  const { role, switchRole } = useAuth();

  const handleSelectRole = (newRole: UserRole) => {
    switchRole(newRole);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: colors.text }]}>Switch Evaluation Role</Text>
              <Text style={[styles.sub, { color: colors.textMuted }]}>
                Experience the app from different user perspectives as required by the assignment.
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Option 1: Customer */}
          <TouchableOpacity
            style={[
              styles.roleOption,
              {
                backgroundColor: role === 'customer' ? colors.primaryLight : colors.inputBg,
                borderColor: role === 'customer' ? colors.primary : colors.border
              }
            ]}
            onPress={() => handleSelectRole('customer')}
          >
            <View style={[styles.roleIconCircle, { backgroundColor: '#e0f2fe' }]}>
              <Ionicons name="person" size={20} color="#0284c7" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={styles.roleTitleRow}>
                <Text style={[styles.roleTitle, { color: colors.text }]}>Customer (Retail)</Text>
                {role === 'customer' && <View style={styles.activeTag}><Text style={styles.activeTagText}>CURRENT</Text></View>}
              </View>
              <Text style={[styles.roleDesc, { color: colors.textMuted }]}>
                Browse 50+ items at MRP/Retail prices, add to cart, pay with Razorpay test mode, pin address on OpenStreetMap, and book doorstep service.
              </Text>
            </View>
          </TouchableOpacity>

          {/* Option 2: Dealer */}
          <TouchableOpacity
            style={[
              styles.roleOption,
              {
                backgroundColor: role === 'dealer' ? '#fef3c7' : colors.inputBg,
                borderColor: role === 'dealer' ? '#f59e0b' : colors.border
              }
            ]}
            onPress={() => handleSelectRole('dealer')}
          >
            <View style={[styles.roleIconCircle, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="briefcase" size={20} color="#b45309" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={styles.roleTitleRow}>
                <Text style={[styles.roleTitle, { color: colors.text }]}>Dealer (Wholesale B2B)</Text>
                {role === 'dealer' && <View style={[styles.activeTag, { backgroundColor: '#f59e0b' }]}><Text style={styles.activeTagText}>CURRENT</Text></View>}
              </View>
              <Text style={[styles.roleDesc, { color: colors.textMuted }]}>
                Unlocked wholesale rates (25-45% discount), MOQ bulk order enforcement, wholesale quotation generator, and dealer order history.
              </Text>
            </View>
          </TouchableOpacity>

          {/* Option 3: Admin */}
          <TouchableOpacity
            style={[
              styles.roleOption,
              {
                backgroundColor: role === 'admin' ? '#f3e8ff' : colors.inputBg,
                borderColor: role === 'admin' ? '#9333ea' : colors.border
              }
            ]}
            onPress={() => handleSelectRole('admin')}
          >
            <View style={[styles.roleIconCircle, { backgroundColor: '#f3e8ff' }]}>
              <Ionicons name="shield-checkmark" size={20} color="#7e22ce" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={styles.roleTitleRow}>
                <Text style={[styles.roleTitle, { color: colors.text }]}>Admin Panel Preview</Text>
                {role === 'admin' && <View style={[styles.activeTag, { backgroundColor: '#9333ea' }]}><Text style={styles.activeTagText}>CURRENT</Text></View>}
              </View>
              <Text style={[styles.roleDesc, { color: colors.textMuted }]}>
                Order management, dealer approvals, and service desk technician dispatch. Also accessible via the dedicated Next.js Vercel dashboard.
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end'
  },
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderBottomWidth: 0
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16
  },
  title: {
    fontSize: 18,
    fontWeight: '800'
  },
  sub: {
    fontSize: 12,
    marginTop: 2,
    maxWidth: 280
  },
  closeBtn: {
    padding: 4
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12
  },
  roleIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  roleTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  roleTitle: {
    fontSize: 14,
    fontWeight: '800'
  },
  activeTag: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4
  },
  activeTagText: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: '800'
  },
  roleDesc: {
    fontSize: 11,
    lineHeight: 16
  }
});
