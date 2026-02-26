import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../config/colors';
import config from '../config/config';
import { useImages } from '../context/ImageContext';

export default function CafeScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const { images } = useImages();

  const menuItems = config.cafe.menu;

  const categories = [
    'Tümü',
    'Sıcak İçecek',
    'Soğuk İçecek',
    'Kahvaltı',
    'Tost',
    'Börek',
    'Tatlı',
    'Yemek',
    'Makarna',
  ];

  const filteredItems =
    selectedCategory === 'Tümü'
      ? menuItems
      : menuItems.filter(item => item.category === selectedCategory);

  return (
    <LinearGradient
      colors={['#F5F0E8', '#F5F0E8']}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* HEADER - En Üstte */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>‹ Geri</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Kafe Menüsü</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Kapak Görseli */}
        <View style={styles.coverImageContainer}>
          <Image 
            source={images.cafeImage} 
            style={{width: '100%', height: 200, borderRadius: 28}} 
          />
        </View>

        {/* Slogan Banner */}
        <View style={styles.sloganContainer}>
          <LinearGradient
            colors={['#FFF9C4', '#FFFDE7']}
            style={styles.sloganBanner}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.sloganText}>
              {config?.cafe?.description}
            </Text>
          </LinearGradient>
        </View>

        {/* KATEGORİ BAR - Sabit */}
        <View style={styles.categoriesWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map(category => {
              const isActive = selectedCategory === category;

              return (
                <TouchableOpacity
                  key={category}
                  activeOpacity={0.85}
                  onPress={() => setSelectedCategory(category)}
                >
                  <LinearGradient
                    colors={
                      isActive
                        ? ['#43A047', '#66BB6A']
                        : ['#FFFFFF', '#FFFFFF']
                    }
                    style={styles.categoryButton}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        isActive && styles.categoryTextActive,
                      ]}
                    >
                      {category}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* MENU */}
        <ScrollView contentContainerStyle={styles.menuList}>
          {filteredItems.map(item => (
            <View key={item.id} style={styles.menuItem}>
              <Text style={styles.menuName}>{item.name}</Text>
              <Text style={styles.menuPrice}>{item.price}</Text>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  coverImageContainer: {
    margin: 20,
    marginBottom: 10,
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  sloganContainer: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
  },
  sloganBanner: {
    padding: 18,
    borderRadius: 20,
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  sloganText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },

  /* 🔥 ASIL DÜZELTİLEN KISIM */
  categoriesWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 12,
    marginBottom: 8,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  categoryButton: {
    minHeight: 42,
    minWidth: 90,
    paddingHorizontal: 18,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    elevation: 2,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E2E2E', // 🔥 ARTIK KAYBOLMAZ
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },

  menuList: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  menuItem: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  menuName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  menuPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#66BB6A',
  },
});
