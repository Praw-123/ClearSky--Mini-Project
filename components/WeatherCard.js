import { View, Text, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import styles from '../styles/globalStyles';
import { getEmoji } from '../constants/weatherConfig';

export default function WeatherCard({ weather }) {
  // useRef เก็บค่า opacity โดยไม่ทำให้ component re-render
  // ค่าเริ่มต้น 0 = โปร่งใสสมบูรณ์ (มองไม่เห็น)
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // useEffect ทำงานทุกครั้งที่ weather เปลี่ยน (ค้นหาเมืองใหม่)
  useEffect(() => {
    // reset opacity กลับเป็น 0 ก่อนทุกครั้ง
    fadeAnim.setValue(0);

    // Animated.timing = animation แบบเปลี่ยนค่าตามเวลา
    Animated.timing(fadeAnim, {
      toValue: 1,          // opacity สุดท้าย = 1 (มองเห็นเต็ม)
      duration: 600,       // ใช้เวลา 600ms
      useNativeDriver: true, // ให้ native handle animation (ลื่นกว่า)
    }).start();
  }, [weather]); // ทำงานใหม่ทุกครั้งที่ weather เปลี่ยน

  return (
    // Animated.View แทน View ธรรมดา เพื่อให้รองรับ animation ได้
    <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
      <Text style={styles.emoji}>{getEmoji(weather.weather[0].main)}</Text>
      <Text style={styles.cityName}>{weather.name}, {weather.sys.country}</Text>
      <Text style={styles.temp}>{Math.round(weather.main.temp)}°C</Text>
      <Text style={styles.desc}>{weather.weather[0].description}</Text>
      <View style={styles.detailRow}>
        <View style={styles.detailBox}>
          <Text style={styles.detailLabel}>💧 ความชื้น</Text>
          <Text style={styles.detailValue}>{weather.main.humidity}%</Text>
        </View>
        <View style={styles.detailBox}>
          <Text style={styles.detailLabel}>💨 ลม</Text>
          <Text style={styles.detailValue}>{weather.wind.speed} m/s</Text>
        </View>
        <View style={styles.detailBox}>
          <Text style={styles.detailLabel}>🌡 อุณหภูมิ</Text>
          <Text style={styles.detailValue}>{Math.round(weather.main.feels_like)}°C</Text>
        </View>
      </View>
    </Animated.View>
  );
}