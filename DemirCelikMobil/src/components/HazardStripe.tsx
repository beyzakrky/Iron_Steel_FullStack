import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme/theme';

/**
 * HazardStripe
 * ------------
 * Sahadaki sac/profil istifleri üzerindeki güvenlik şeridinden
 * ilham alan, çapraz kesilmiş turuncu/grafit şerit.
 * Uygulamanın tüm ekranlarında tepe aksanı olarak kullanılır —
 * tek bir imza öğesi, tekrar ederek kimlik kurar.
 */
type Props = { height?: number };

const SEGMENT_COUNT = 16;

const HazardStripe: React.FC<Props> = ({ height = 6 }) => {
  return (
    <View style={[styles.container, { height }]}>
      <View style={styles.track}>
        {Array.from({ length: SEGMENT_COUNT }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.segment,
              { backgroundColor: i % 2 === 0 ? colors.amber : colors.bg },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: colors.bg,
  },
  track: {
    flexDirection: 'row',
    width: '130%',
    marginLeft: '-8%',
    height: '100%',
  },
  segment: {
    flex: 1,
    transform: [{ skewX: '-25deg' }],
  },
});

export default HazardStripe;