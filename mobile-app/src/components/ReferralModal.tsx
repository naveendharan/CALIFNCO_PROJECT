import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Share,
  Clipboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface ReferralModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ReferralModal: React.FC<ReferralModalProps> = ({ visible, onClose }) => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { applyDiscountCode } = useCart();
  const [copied, setCopied] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);

  const referralCode = user.referralCode || 'CALIFNCO-50';

  const handleCopy = () => {
    // Clipboard copy
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Drink 100% pure mineral water! Use my Califnco referral code ${referralCode} to get ₹500 OFF your water purifier order or bulk spares: https://app.califnco.com`
      });
    } catch (e) {
      console.log('Share error', e);
    }
  };

  const handleApplyFriendCode = () => {
    if (!inputCode.trim()) return;
    const res = applyDiscountCode(inputCode);
    setMessage({ text: res.message, error: !res.success });
    if (res.success) {
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Ionicons name="gift" size={24} color={colors.accentOrange} />
              <Text style={[styles.headerTitle, { color: colors.text }]}>Califnco Referral Club</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Give ₹500, Get ₹500! Every time a friend or client uses your code, you both earn instant rewards.
          </Text>

          {/* User Referral Stats Bar */}
          <View style={[styles.statsBar, { backgroundColor: colors.bg, borderColor: colors.border }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>{user.referralCount}</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Successful Referrals</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.accentGreen }]}>₹{user.referralEarnings}</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Wallet Credits Earned</Text>
            </View>
          </View>

          {/* Your Unique Code Card */}
          <View style={[styles.codeBox, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
            <Text style={[styles.codeBoxLabel, { color: colors.primary }]}>YOUR EXCLUSIVE CODE</Text>
            <Text style={[styles.codeText, { color: colors.text }]}>{referralCode}</Text>
            <View style={styles.actionRow}>
              <TouchableOpacity style={[styles.codeBtn, { backgroundColor: colors.primary }]} onPress={handleCopy}>
                <Ionicons name={copied ? 'checkmark' : 'copy-outline'} size={16} color="#ffffff" />
                <Text style={styles.codeBtnText}>{copied ? 'COPIED!' : 'COPY CODE'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.codeBtn, { backgroundColor: '#25D366' }]} onPress={handleShare}>
                <Ionicons name="logo-whatsapp" size={16} color="#ffffff" />
                <Text style={styles.codeBtnText}>SHARE WHATSAPP</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Have a friend's code? */}
          <View style={styles.applySection}>
            <Text style={[styles.applyTitle, { color: colors.text }]}>Have a Referral / Promo Code?</Text>
            <View style={styles.applyInputRow}>
              <TextInput
                style={[styles.applyInput, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
                placeholder="e.g. CALI-RAHUL-50"
                placeholderTextColor={colors.textMuted}
                value={inputCode}
                onChangeText={setInputCode}
                autoCapitalize="characters"
              />
              <TouchableOpacity
                style={[styles.applyBtn, { backgroundColor: colors.primary }]}
                onPress={handleApplyFriendCode}
              >
                <Text style={styles.applyBtnText}>APPLY</Text>
              </TouchableOpacity>
            </View>
            {message && (
              <Text style={[styles.messageText, { color: message.error ? colors.accentRed : colors.accentGreen }]}>
                {message.text}
              </Text>
            )}
          </View>
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
    alignItems: 'center'
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800'
  },
  subtitle: {
    fontSize: 12,
    marginTop: 4,
    marginBottom: 14
  },
  closeBtn: {
    padding: 4
  },
  statsBar: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    marginBottom: 14
  },
  statItem: {
    flex: 1,
    alignItems: 'center'
  },
  statDivider: {
    width: 1,
    backgroundColor: '#cbd5e1'
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800'
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2
  },
  codeBox: {
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16
  },
  codeBoxLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1
  },
  codeText: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 2,
    marginVertical: 8
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4
  },
  codeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20
  },
  codeBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700'
  },
  applySection: {
    marginTop: 4,
    marginBottom: 10
  },
  applyTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6
  },
  applyInputRow: {
    flexDirection: 'row',
    gap: 8
  },
  applyInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    fontWeight: '600'
  },
  applyBtn: {
    borderRadius: 10,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center'
  },
  applyBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700'
  },
  messageText: {
    fontSize: 12,
    marginTop: 6,
    fontWeight: '600'
  }
});
