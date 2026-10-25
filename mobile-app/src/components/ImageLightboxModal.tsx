import React, { useState } from 'react';
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface ImageLightboxModalProps {
  visible: boolean;
  imageUrl: string;
  title: string;
  onClose: () => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  visible,
  imageUrl,
  title,
  onClose
}) => {
  const { colors } = useTheme();
  const [scale, setScale] = useState(1);

  const zoomIn = () => setScale(prev => Math.min(prev + 0.5, 3.0));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.5, 0.8));
  const resetZoom = () => setScale(1);

  const handleClose = () => {
    setScale(1);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        {/* Header Bar */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText} numberOfLines={1}>{title}</Text>
            <Text style={styles.subText}>Pinch / Zoom Inspection Mode</Text>
          </View>
          <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
            <Ionicons name="close" size={26} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Image Container with Zoom Transform */}
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: imageUrl }}
            style={[
              styles.image,
              { transform: [{ scale }] }
            ]}
            resizeMode="contain"
          />
        </View>

        {/* Zoom Controls Pill */}
        <View style={styles.controlsBar}>
          <TouchableOpacity onPress={zoomOut} style={styles.controlBtn}>
            <Ionicons name="remove-circle-outline" size={24} color="#ffffff" />
            <Text style={styles.btnLabel}>Zoom Out</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={resetZoom} style={styles.controlBtn}>
            <Text style={styles.scaleText}>{Math.round(scale * 100)}%</Text>
            <Text style={styles.btnLabel}>Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={zoomIn} style={styles.controlBtn}>
            <Ionicons name="add-circle-outline" size={24} color="#ffffff" />
            <Text style={styles.btnLabel}>Zoom In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 10, 20, 0.95)',
    justifyContent: 'space-between',
    paddingVertical: 40,
    paddingHorizontal: 16
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 10
  },
  titleContainer: {
    flex: 1,
    marginRight: 12
  },
  titleText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700'
  },
  subText: {
    color: '#38bdf8',
    fontSize: 12,
    marginTop: 2
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  image: {
    width: width * 0.9,
    height: height * 0.55
  },
  controlsBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
    justifyContent: 'space-between',
    width: 280,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)'
  },
  controlBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8
  },
  btnLabel: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 2
  },
  scaleText: {
    color: '#38bdf8',
    fontSize: 14,
    fontWeight: '700'
  }
});
