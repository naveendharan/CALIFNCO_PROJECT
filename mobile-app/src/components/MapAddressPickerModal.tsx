import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface MapAddressPickerModalProps {
  visible: boolean;
  initialAddress?: string;
  onSelectAddress: (address: string, coords: { lat: number; lng: number }) => void;
  onClose: () => void;
}

export const MapAddressPickerModal: React.FC<MapAddressPickerModalProps> = ({
  visible,
  initialAddress = '',
  onSelectAddress,
  onClose
}) => {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(
    initialAddress || 'Flat 402, Aqua Heights, Indiranagar 100ft Road, Bengaluru, Karnataka 560038'
  );
  const [coords, setCoords] = useState({ lat: 12.9716, lng: 77.5946 });
  const [isSearching, setIsSearching] = useState(false);

  const POPULAR_LOCATIONS = [
    {
      name: 'Indiranagar, Bengaluru',
      address: 'Indiranagar 100ft Road, Stage 2, Bengaluru, 560038',
      lat: 12.9784,
      lng: 77.6408
    },
    {
      name: 'Whitefield Tech Zone, Bengaluru',
      address: 'ITPL Main Road, Whitefield, Bengaluru, 560066',
      lat: 12.9698,
      lng: 77.7499
    },
    {
      name: 'Peenya Industrial Area (Dealer Hub)',
      address: 'Plot 18, 4th Phase, Peenya Industrial Area, Bengaluru, 560058',
      lat: 13.0285,
      lng: 77.5195
    },
    {
      name: 'Koramangala 4th Block',
      address: '80 Feet Road, 4th Block, Koramangala, Bengaluru, 560034',
      lat: 12.9352,
      lng: 77.6245
    }
  ];

  const searchOpenStreetMap = async (query: string) => {
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      // Free OpenStreetMap Nominatim Geocoding API (Zero cost, no credit card required)
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
        { headers: { 'User-Agent': 'CalifncoWaterApp/1.0' } }
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const item = data[0];
        setSelectedAddress(item.display_name);
        setCoords({ lat: parseFloat(item.lat), lng: parseFloat(item.lon) });
      }
    } catch (e) {
      console.log('OSM Geocoding offline fallback', e);
    } finally {
      setIsSearching(false);
    }
  };

  const handleConfirm = () => {
    onSelectAddress(selectedAddress, coords);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Ionicons name="map" size={22} color={colors.primary} />
              <Text style={[styles.headerTitle, { color: colors.text }]}>OpenStreetMap Pinpoint</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.subHeader, { color: colors.textMuted }]}>
            Zero-cost OpenStreetMap location verification for water purifier delivery and technician installation.
          </Text>

          {/* Search Bar */}
          <View style={styles.searchRow}>
            <TextInput
              style={[styles.searchInput, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
              placeholder="Search area, landmark or PIN code..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => searchOpenStreetMap(searchQuery)}
            />
            <TouchableOpacity
              style={[styles.searchBtn, { backgroundColor: colors.primary }]}
              onPress={() => searchOpenStreetMap(searchQuery)}
              disabled={isSearching}
            >
              {isSearching ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Ionicons name="search" size={18} color="#ffffff" />
              )}
            </TouchableOpacity>
          </View>

          {/* Interactive Map Visual Mockup (Stylized OpenStreetMap Canvas) */}
          <View style={[styles.mapCanvas, { backgroundColor: colors.isDark ? '#08172c' : '#e2e8f0', borderColor: colors.border }]}>
            {/* Grid Lines simulating map streets */}
            <View style={styles.streetHorizontal} />
            <View style={styles.streetVertical} />
            <View style={styles.streetDiagonal} />

            {/* Central Pin */}
            <View style={styles.pinWrapper}>
              <View style={[styles.pinBubble, { backgroundColor: colors.primary }]}>
                <Ionicons name="water" size={14} color="#ffffff" />
                <Text style={styles.pinBubbleText}>Delivery Destination</Text>
              </View>
              <Ionicons name="location" size={38} color="#ef4444" style={styles.pinIcon} />
              <View style={styles.pinShadow} />
            </View>

            {/* Live GPS Coordinates Tag */}
            <View style={[styles.coordBadge, { backgroundColor: 'rgba(15, 23, 42, 0.85)' }]}>
              <Text style={styles.coordText}>
                LAT: {coords.lat.toFixed(4)} | LNG: {coords.lng.toFixed(4)}
              </Text>
              <Text style={styles.osmAttribution}>© OpenStreetMap Contributors</Text>
            </View>
          </View>

          {/* Selected Address Box */}
          <View style={[styles.addressBox, { backgroundColor: colors.bg, borderColor: colors.border }]}>
            <View style={styles.addressTitleRow}>
              <Ionicons name="checkmark-circle" size={16} color={colors.accentGreen} />
              <Text style={[styles.addressLabel, { color: colors.accentGreen }]}>Confirmed Service Address</Text>
            </View>
            <Text style={[styles.addressText, { color: colors.text }]} numberOfLines={3}>
              {selectedAddress}
            </Text>
          </View>

          {/* Quick Select Popular Hubs */}
          <Text style={[styles.quickLabel, { color: colors.textMuted }]}>Quick Select Verified Hubs:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
            {POPULAR_LOCATIONS.map(loc => (
              <TouchableOpacity
                key={loc.name}
                style={[styles.locChip, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
                onPress={() => {
                  setSelectedAddress(loc.address);
                  setCoords({ lat: loc.lat, lng: loc.lng });
                }}
              >
                <Ionicons name="business-outline" size={12} color={colors.primary} />
                <Text style={[styles.locChipText, { color: colors.textSecondary }]}>{loc.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Confirm Button */}
          <TouchableOpacity
            style={[styles.confirmBtn, { backgroundColor: colors.primary }]}
            onPress={handleConfirm}
          >
            <Ionicons name="navigate-circle-outline" size={20} color="#ffffff" />
            <Text style={styles.confirmBtnText}>CONFIRM THIS LOCATION</Text>
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
    borderBottomWidth: 0,
    maxHeight: '90%'
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
  subHeader: {
    fontSize: 12,
    marginTop: 4,
    marginBottom: 12
  },
  closeBtn: {
    padding: 4
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13
  },
  searchBtn: {
    width: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  mapCanvas: {
    height: 180,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center'
  },
  streetHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 90,
    height: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  },
  streetVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '48%',
    width: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  },
  streetDiagonal: {
    position: 'absolute',
    width: 300,
    height: 8,
    transform: [{ rotate: '35deg' }],
    backgroundColor: 'rgba(56, 189, 248, 0.15)'
  },
  pinWrapper: {
    alignItems: 'center',
    zIndex: 10
  },
  pinBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: -4
  },
  pinBubbleText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700'
  },
  pinIcon: {
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4
  },
  pinShadow: {
    width: 14,
    height: 6,
    borderRadius: 7,
    backgroundColor: 'rgba(0,0,0,0.4)',
    marginTop: -8
  },
  coordBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8
  },
  coordText: {
    color: '#38bdf8',
    fontSize: 10,
    fontFamily: 'monospace',
    fontWeight: '700'
  },
  osmAttribution: {
    color: '#94a3b8',
    fontSize: 9
  },
  addressBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 12
  },
  addressTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4
  },
  addressLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  addressText: {
    fontSize: 13,
    lineHeight: 18
  },
  quickLabel: {
    fontSize: 11,
    marginTop: 10,
    marginBottom: 6,
    fontWeight: '600'
  },
  chipsScroll: {
    flexDirection: 'row',
    marginBottom: 14
  },
  locChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8
  },
  locChipText: {
    fontSize: 11,
    fontWeight: '500'
  },
  confirmBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    paddingVertical: 14
  },
  confirmBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5
  }
});
