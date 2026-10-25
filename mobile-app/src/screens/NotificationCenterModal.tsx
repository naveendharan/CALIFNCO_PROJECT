import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';

interface NotificationCenterModalProps {
  visible: boolean;
  onClose: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  visible,
  onClose
}) => {
  const { colors } = useTheme();
  const { notifications, markAsRead, markAllAsRead, triggerPushAlert } = useNotifications();

  const handleSimulateTestAlert = () => {
    triggerPushAlert(
      '🚚 Out for Delivery Today',
      'Califnco Delivery Agent #4 is en-route with your order. Keep OTP handy.',
      'order'
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: colors.text }]}>Push Notification Center</Text>
              <Text style={[styles.sub, { color: colors.textMuted }]}>
                Firebase Cloud Messaging (FCM) & In-App Alerts
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Quick Action Bar */}
          <View style={styles.actionRow}>
            <TouchableOpacity onPress={markAllAsRead}>
              <Text style={[styles.actionText, { color: colors.primary }]}>Mark all as read</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSimulateTestAlert}
              style={[styles.testAlertBtn, { backgroundColor: colors.primaryLight }]}
            >
              <Ionicons name="send" size={12} color={colors.primary} />
              <Text style={[styles.testAlertBtnText, { color: colors.primary }]}>Simulate FCM Push</Text>
            </TouchableOpacity>
          </View>

          {/* Notifications List */}
          <ScrollView style={styles.listArea} showsVerticalScrollIndicator={false}>
            {notifications.length === 0 ? (
              <View style={styles.empty}>
                <Ionicons name="notifications-off-outline" size={40} color={colors.textMuted} />
                <Text style={[styles.emptyText, { color: colors.textMuted }]}>No notifications yet.</Text>
              </View>
            ) : (
              notifications.map(notif => (
                <TouchableOpacity
                  key={notif.id}
                  style={[
                    styles.notifCard,
                    {
                      backgroundColor: notif.read ? colors.bg : colors.inputBg,
                      borderColor: notif.read ? colors.border : colors.primary
                    }
                  ]}
                  onPress={() => markAsRead(notif.id)}
                >
                  <View style={styles.notifTop}>
                    <View style={styles.titleWithIcon}>
                      <Ionicons
                        name={notif.type === 'order' ? 'cube' : notif.type === 'service' ? 'construct' : 'notifications'}
                        size={16}
                        color={colors.primary}
                      />
                      <Text style={[styles.notifTitle, { color: colors.text }]}>{notif.title}</Text>
                    </View>
                    <Text style={[styles.timestamp, { color: colors.textMuted }]}>{notif.timestamp}</Text>
                  </View>
                  <Text style={[styles.notifBody, { color: colors.textSecondary }]}>
                    {notif.body}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
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
    borderBottomWidth: 0,
    maxHeight: '80%'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10
  },
  title: {
    fontSize: 18,
    fontWeight: '800'
  },
  sub: {
    fontSize: 11,
    marginTop: 2
  },
  closeBtn: {
    padding: 4
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700'
  },
  testAlertBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  testAlertBtnText: {
    fontSize: 11,
    fontWeight: '700'
  },
  listArea: {
    maxHeight: 350
  },
  notifCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8
  },
  notifTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  notifTitle: {
    fontSize: 13,
    fontWeight: '700'
  },
  timestamp: {
    fontSize: 10
  },
  notifBody: {
    fontSize: 12,
    lineHeight: 16
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40
  },
  emptyText: {
    fontSize: 12,
    marginTop: 8
  }
});
