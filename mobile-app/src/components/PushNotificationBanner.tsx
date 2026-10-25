import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';

export const PushNotificationBanner: React.FC = () => {
  const { bannerAlert, clearBanner } = useNotifications();
  const { colors } = useTheme();

  if (!bannerAlert) return null;

  return (
    <SafeAreaView style={styles.safeContainer}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={clearBanner}
        style={[styles.bannerCard, { backgroundColor: colors.isDark ? '#0f1f38' : '#ffffff', borderColor: colors.primary }]}
      >
        <View style={[styles.iconWrapper, { backgroundColor: colors.primaryLight }]}>
          <Ionicons name="notifications" size={20} color={colors.primary} />
        </View>

        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: colors.text }]}>{bannerAlert.title}</Text>
            <Text style={styles.badge}>FCM PUSH</Text>
          </View>
          <Text style={[styles.body, { color: colors.textSecondary }]} numberOfLines={2}>
            {bannerAlert.body}
          </Text>
        </View>

        <TouchableOpacity onPress={clearBanner} style={styles.dismissBtn}>
          <Ionicons name="close" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    position: 'absolute',
    top: 40,
    left: 12,
    right: 12,
    zIndex: 9999
  },
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 12
  },
  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  textContainer: {
    flex: 1
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2
  },
  title: {
    fontSize: 13,
    fontWeight: '800'
  },
  badge: {
    fontSize: 9,
    fontWeight: '700',
    color: '#0284c7',
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4
  },
  body: {
    fontSize: 12,
    lineHeight: 16
  },
  dismissBtn: {
    padding: 6,
    marginLeft: 4
  }
});
