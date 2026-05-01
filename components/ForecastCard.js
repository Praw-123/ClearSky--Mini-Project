import { View, Text, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import styles from '../styles/globalStyles';
import { getEmoji } from '../constants/weatherConfig';

export default function ForecastCard({ forecast }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    // หน่วงเวลา 200ms ให้ WeatherCard ขึ้นก่อน แล้ว ForecastCard ค่อยตาม
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      delay: 200,
      useNativeDriver: true,
    }).start();
  }, [forecast]);

  return (
    <Animated.View style={[styles.forecastCard, { opacity: fadeAnim }]}>
      <Text style={styles.forecastTitle}>พยากรณ์ 5 วัน</Text>
      {forecast.map((item, index) => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString('th-TH', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        });
        return (
          <View key={index} style={styles.forecastRow}>
            <Text style={styles.forecastDay}>{day}</Text>
            <Text style={styles.forecastEmoji}>{getEmoji(item.weather[0].main)}</Text>
            <Text style={styles.forecastDesc}>{item.weather[0].description}</Text>
            <Text style={styles.forecastTemp}>{Math.round(item.main.temp)}°C</Text>
          </View>
        );
      })}
    </Animated.View>
  );
}