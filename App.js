import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState } from 'react';

const API_KEY = 'ad044ee78deb31ddecbccf79c9af4d07';

export default function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=th`
      );
      const data = await res.json();
      if (data.cod !== 200) {
        setError('ไม่พบเมืองนี้ ลองใหม่นะ');
        setWeather(null);
      } else {
        setWeather(data);
      }
    } catch (e) {
      setError('เกิดข้อผิดพลาด ลองใหม่อีกครั้ง');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌤 ClearSky</Text>

      <TextInput
        style={styles.input}
        placeholder="พิมพ์ชื่อเมือง เช่น Bangkok"
        placeholderTextColor="#aaa"
        value={city}
        onChangeText={setCity}
      />

      <TouchableOpacity style={styles.button} onPress={fetchWeather}>
        <Text style={styles.buttonText}>ค้นหา</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="white" style={{ marginTop: 20 }} />}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {weather && (
        <View style={styles.card}>
          <Text style={styles.cityName}>{weather.name}</Text>
          <Text style={styles.temp}>{Math.round(weather.main.temp)}°C</Text>
          <Text style={styles.desc}>{weather.weather[0].description}</Text>
          <Text style={styles.detail}>ความชื้น: {weather.main.humidity}%</Text>
          <Text style={styles.detail}>ลม: {weather.wind.speed} m/s</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a56a0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#f0a500',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    color: '#ffcccc',
    fontSize: 16,
    marginTop: 10,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  cityName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  temp: {
    fontSize: 64,
    fontWeight: 'bold',
    color: 'white',
  },
  desc: {
    fontSize: 20,
    color: 'white',
    marginBottom: 12,
    textTransform: 'capitalize',
  },
  detail: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
});