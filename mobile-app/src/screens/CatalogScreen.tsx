import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PRODUCTS, CATEGORIES, Product } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface CatalogScreenProps {
  onSelectProduct: (product: Product) => void;
}

export const CatalogScreen: React.FC<CatalogScreenProps> = ({ onSelectProduct }) => {
  const { colors } = useTheme();
  const { isDealer } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'popular' | 'priceLow' | 'priceHigh' | 'rating'>('popular');

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS.filter(p => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (sortBy === 'priceLow') {
      result.sort((a, b) => {
        const priceA = isDealer ? a.wholesalePrice : a.retailPrice;
        const priceB = isDealer ? b.wholesalePrice : b.retailPrice;
        return priceA - priceB;
      });
    } else if (sortBy === 'priceHigh') {
      result.sort((a, b) => {
        const priceA = isDealer ? a.wholesalePrice : a.retailPrice;
        const priceB = isDealer ? b.wholesalePrice : b.retailPrice;
        return priceB - priceA;
      });
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [selectedCategory, searchQuery, sortBy, isDealer]);

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Search and Filter Header */}
      <View style={[styles.searchSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.searchBox, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search 50+ purifiers, pumps, filters..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Pills Scroll */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {CATEGORIES.map(cat => {
            const isActive = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryPill,
                  {
                    backgroundColor: isActive ? colors.primary : colors.inputBg,
                    borderColor: isActive ? colors.primary : colors.border
                  }
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    { color: isActive ? '#ffffff' : colors.textSecondary }
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Sort & Count Row */}
        <View style={styles.filterMetaRow}>
          <Text style={[styles.productCount, { color: colors.textMuted }]}>
            Showing <Text style={{ color: colors.primary, fontWeight: '700' }}>{filteredProducts.length}</Text> water tech items
          </Text>

          <View style={styles.sortRow}>
            <Ionicons name="swap-vertical" size={14} color={colors.textMuted} />
            <TouchableOpacity
              onPress={() => {
                const modes: ('popular' | 'priceLow' | 'priceHigh' | 'rating')[] = ['popular', 'priceLow', 'priceHigh', 'rating'];
                const nextIdx = (modes.indexOf(sortBy) + 1) % modes.length;
                setSortBy(modes[nextIdx]);
              }}
            >
              <Text style={[styles.sortText, { color: colors.primary }]}>
                {sortBy === 'popular' && 'Popular'}
                {sortBy === 'priceLow' && 'Price: Low to High'}
                {sortBy === 'priceHigh' && 'Price: High to Low'}
                {sortBy === 'rating' && 'Top Rated'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Dealer Wholesale Notice Banner */}
      {isDealer && (
        <View style={styles.wholesaleNotice}>
          <Ionicons name="briefcase" size={16} color="#b45309" />
          <Text style={styles.wholesaleNoticeText}>
            Wholesale Mode Active: Displaying tax-exempt B2B prices with Minimum Order Quantity tiers.
          </Text>
        </View>
      )}

      {/* 50+ Product Grid / List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={() => onSelectProduct(item)} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No matching items found</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
              Try searching for "RO", "Pump", "Carbon", "TDS" or clear your filter.
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    marginBottom: 10
  },
  searchInput: {
    flex: 1,
    fontSize: 14
  },
  categoryScroll: {
    flexDirection: 'row',
    marginBottom: 10
  },
  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '600'
  },
  filterMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4
  },
  productCount: {
    fontSize: 12
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  sortText: {
    fontSize: 12,
    fontWeight: '700'
  },
  wholesaleNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fef3c7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#fde68a'
  },
  wholesaleNoticeText: {
    color: '#92400e',
    fontSize: 11,
    fontWeight: '600',
    flex: 1
  },
  listContent: {
    padding: 16
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12
  },
  emptySubtitle: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
    maxWidth: 240
  }
});
