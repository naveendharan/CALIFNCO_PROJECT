import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DataStore, ServiceRequest } from '../services/dataStore';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export const ServiceDeskScreen: React.FC = () => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { triggerPushAlert } = useNotifications();

  const [services, setServices] = useState<ServiceRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'book' | 'history'>('book');

  // Booking Form State
  const [serviceType, setServiceType] = useState<ServiceRequest['serviceType']>(
    'Filter Cartridge Replacement'
  );
  const [waterSource, setWaterSource] = useState<'Borewell' | 'Municipal / Tanker' | 'Mixed'>('Borewell');
  const [currentTds, setCurrentTds] = useState('650');
  const [preferredDate, setPreferredDate] = useState('2026-10-27');
  const [preferredSlot, setPreferredSlot] = useState<ServiceRequest['preferredTimeSlot']>(
    'Morning (09:00 - 12:00)'
  );
  const [purifierModel, setPurifierModel] = useState('Califnco AquaShield RO 10L');
  const [address, setAddress] = useState(user.savedAddress || 'Flat 402, Indiranagar, Bengaluru');
  const [notes, setNotes] = useState('');
  const [bookedSuccess, setBookedSuccess] = useState<ServiceRequest | null>(null);

  useEffect(() => {
    const update = () => {
      setServices(DataStore.getServices());
    };
    update();
    const unsub = DataStore.subscribe(update);
    return unsub;
  }, []);

  const handleBookService = () => {
    const newService = DataStore.bookService({
      serviceType,
      customerName: user.name,
      phone: user.phone,
      address,
      waterSource,
      currentTds: parseInt(currentTds) || 500,
      preferredDate,
      preferredTimeSlot: preferredSlot,
      purifierModel,
      notes
    });

    triggerPushAlert(
      '🛠️ Service Booking Confirmed',
      `Ticket #${newService.id} registered for ${serviceType} on ${preferredDate}. Technician dispatch pending.`,
      'service'
    );

    setBookedSuccess(newService);
    setActiveTab('history');
  };

  const SERVICE_TYPES: ServiceRequest['serviceType'][] = [
    'Filter Cartridge Replacement',
    'New Purifier Installation',
    'TDS Purity Test & Health Check',
    'Motor / Solenoid Breakdown Repair',
    'Annual Maintenance (AMC)'
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Top Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Service Desk & AMC</Text>
          <Text style={[styles.headerSub, { color: colors.textMuted }]}>
            Doorstep Technician Dispatch & Water Health Verification
          </Text>
        </View>
        <Ionicons name="construct" size={24} color={colors.primary} />
      </View>

      {/* Tabs */}
      <View style={[styles.tabBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'book' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
          onPress={() => setActiveTab('book')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'book' ? colors.primary : colors.textMuted }]}>
            Book a Technician
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'history' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'history' ? colors.primary : colors.textMuted }]}>
            My Tickets ({services.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        {activeTab === 'book' ? (
          <View style={styles.formContainer}>
            {/* Service Type Selection */}
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Required Service</Text>
              <View style={styles.typeGrid}>
                {SERVICE_TYPES.map(type => {
                  const isSelected = serviceType === type;
                  return (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typePill,
                        {
                          backgroundColor: isSelected ? colors.primaryLight : colors.inputBg,
                          borderColor: isSelected ? colors.primary : colors.border
                        }
                      ]}
                      onPress={() => setServiceType(type)}
                    >
                      <Ionicons
                        name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                        size={16}
                        color={isSelected ? colors.primary : colors.textMuted}
                      />
                      <Text style={[styles.typeText, { color: isSelected ? colors.primary : colors.textSecondary }]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Water Source & TDS Details */}
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Water Quality Profile</Text>

              <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Raw Water Source</Text>
              <View style={styles.sourceRow}>
                {(['Borewell', 'Municipal / Tanker', 'Mixed'] as const).map(src => (
                  <TouchableOpacity
                    key={src}
                    style={[
                      styles.sourceChip,
                      {
                        backgroundColor: waterSource === src ? colors.primaryLight : colors.inputBg,
                        borderColor: waterSource === src ? colors.primary : colors.border
                      }
                    ]}
                    onPress={() => setWaterSource(src)}
                  >
                    <Text style={{ color: waterSource === src ? colors.primary : colors.textSecondary, fontSize: 11, fontWeight: '700' }}>
                      {src}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.inputRow}>
                <View style={{ flex: 1, marginRight: 6 }}>
                  <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Current Raw TDS (PPM)</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
                    value={currentTds}
                    onChangeText={setCurrentTds}
                    keyboardType="numeric"
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 6 }}>
                  <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Purifier Model</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
                    value={purifierModel}
                    onChangeText={setPurifierModel}
                  />
                </View>
              </View>
            </View>

            {/* Preferred Date & Slot */}
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Technician Appointment Slot</Text>

              <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Preferred Date</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
                value={preferredDate}
                onChangeText={setPreferredDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textMuted}
              />

              <Text style={[styles.fieldLabel, { color: colors.textMuted, marginTop: 10 }]}>Time Slot</Text>
              <View style={styles.slotList}>
                {(['Morning (09:00 - 12:00)', 'Afternoon (12:00 - 04:00)', 'Evening (04:00 - 07:00)'] as const).map(slot => (
                  <TouchableOpacity
                    key={slot}
                    style={[
                      styles.slotPill,
                      {
                        backgroundColor: preferredSlot === slot ? colors.primaryLight : colors.inputBg,
                        borderColor: preferredSlot === slot ? colors.primary : colors.border
                      }
                    ]}
                    onPress={() => setPreferredSlot(slot)}
                  >
                    <Ionicons
                      name="time-outline"
                      size={14}
                      color={preferredSlot === slot ? colors.primary : colors.textMuted}
                    />
                    <Text style={{ color: preferredSlot === slot ? colors.primary : colors.textSecondary, fontSize: 12, fontWeight: '600' }}>
                      {slot}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.fieldLabel, { color: colors.textMuted, marginTop: 10 }]}>Installation Address</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
                value={address}
                onChangeText={setAddress}
              />

              <Text style={[styles.fieldLabel, { color: colors.textMuted, marginTop: 10 }]}>Technician Instructions</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border, height: 60 }]}
                value={notes}
                onChangeText={setNotes}
                placeholder="e.g. Please bring extra 1/4 inch elbow fittings and Teflon tape."
                placeholderTextColor={colors.textMuted}
                multiline
              />
            </View>

            {/* Book Button */}
            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: colors.primary }]}
              onPress={handleBookService}
            >
              <Ionicons name="calendar" size={18} color="#ffffff" />
              <Text style={styles.submitBtnText}>SCHEDULE CERTIFIED TECHNICIAN</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Tickets History List */
          <View style={styles.ticketsList}>
            {services.map(ticket => (
              <View
                key={ticket.id}
                style={[styles.ticketCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={styles.ticketHeader}>
                  <View>
                    <Text style={[styles.ticketId, { color: colors.primary }]}>{ticket.id}</Text>
                    <Text style={[styles.ticketDate, { color: colors.textMuted }]}>
                      Scheduled for: {ticket.preferredDate} ({ticket.preferredTimeSlot.split(' ')[0]})
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: ticket.status === 'Completed' ? '#dcfce7' : ticket.status === 'Assigned' ? '#e0f2fe' : '#fef3c7' }]}>
                    <Text style={{ color: ticket.status === 'Completed' ? '#166534' : ticket.status === 'Assigned' ? '#0369a1' : '#b45309', fontSize: 11, fontWeight: '800' }}>
                      {ticket.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.ticketServiceType, { color: colors.text }]}>
                  {ticket.serviceType}
                </Text>
                <Text style={[styles.ticketModel, { color: colors.textSecondary }]}>
                  Model: {ticket.purifierModel} • Water Source: {ticket.waterSource} (TDS {ticket.currentTds} PPM)
                </Text>

                {ticket.technicianName && (
                  <View style={styles.techAssignedBox}>
                    <Ionicons name="person" size={16} color="#0284c7" />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.techName}>Assigned Tech: {ticket.technicianName}</Text>
                      <Text style={styles.techPhone}>Phone: {ticket.technicianPhone || '+91 98111 22334'}</Text>
                    </View>
                  </View>
                )}

                <Text style={[styles.ticketAddress, { color: colors.textMuted }]}>
                  📍 {ticket.address}
                </Text>
              </View>
            ))}
          </View>
        )}
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
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center'
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700'
  },
  scrollArea: {
    flex: 1,
    padding: 16
  },
  formContainer: {
    marginBottom: 20
  },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 10
  },
  typeGrid: {
    gap: 8
  },
  typePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10
  },
  typeText: {
    fontSize: 13,
    fontWeight: '600'
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4
  },
  sourceRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12
  },
  sourceChip: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center'
  },
  inputRow: {
    flexDirection: 'row'
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13
  },
  slotList: {
    gap: 6,
    marginBottom: 6
  },
  slotPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 6,
    marginBottom: 30
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  ticketsList: {
    marginBottom: 20
  },
  ticketCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  ticketId: {
    fontSize: 14,
    fontWeight: '800'
  },
  ticketDate: {
    fontSize: 11,
    marginTop: 2
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  ticketServiceType: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4
  },
  ticketModel: {
    fontSize: 12,
    marginBottom: 8
  },
  techAssignedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#e0f2fe',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8
  },
  techName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0369a1'
  },
  techPhone: {
    fontSize: 10,
    color: '#0284c7'
  },
  ticketAddress: {
    fontSize: 11
  }
});
