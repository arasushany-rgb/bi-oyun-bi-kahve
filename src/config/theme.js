import { StyleSheet } from 'react-native';
import colors from './colors';

// Gradyan helper - LinearGradient için
export const createGradient = (gradientColors) => ({
  colors: gradientColors,
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
});

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  // Başlıklar - Yumuşak Renkler
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  
  // Kartlar - Yumuşak Gölgeler, Yuvarlak Köşeler
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 15,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  
  cardSubtle: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 18,
    padding: 18,
    marginVertical: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 1,
  },
  
  // Butonlar - Gradyan için base stil
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  
  buttonText: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  
  // Input - Yumuşak Kenarlıklar
  input: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginVertical: 8,
    color: colors.text,
  },
  
  // Badge - Yumuşak
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  
  badgeText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Separator - Yumuşak
  separator: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 15,
  },
  
  // Center
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Yuvarlak Köşe Varyasyonları
  roundedSmall: {
    borderRadius: 12,
  },
  
  roundedMedium: {
    borderRadius: 18,
  },
  
  roundedLarge: {
    borderRadius: 24,
  },
  
  roundedXLarge: {
    borderRadius: 30,
  },
});

export default globalStyles;
