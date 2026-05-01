// import component ที่จำเป็นจาก React Native
// Image = สำหรับแสดงรูปภาพ
import { Text, View, ScrollView, ActivityIndicator, Image } from 'react-native';

// useState = เก็บข้อมูลที่เปลี่ยนแปลงได้
// useEffect = ทำงานตอน component โหลดครั้งแรก
// useCallback = สร้างฟังก์ชันที่ไม่ถูกสร้างใหม่ทุก render
import { useState, useEffect, useCallback } from 'react';

// import expo-splash-screen สำหรับทำ Splash Screen
import * as SplashScreen from 'expo-splash-screen';

// import ค่า config และฟังก์ชันจากไฟล์ constants
import { API_KEY, getBackground } from './constants/weatherConfig';

// import components ที่แยกออกมา
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import ForecastCard from './components/ForecastCard';

// import styles ทั้งหมดจากไฟล์ globalStyles
import styles from './styles/globalStyles';

// บอกให้ Splash Screen ค้างไว้ก่อน ยังไม่ให้ซ่อนอัตโนมัติ
SplashScreen.preventAutoHideAsync();

export default function App() {
  // เก็บชื่อเมืองที่ผู้ใช้พิมพ์
  const [city, setCity] = useState('');

  // เก็บข้อมูลอากาศปัจจุบัน (null = ยังไม่ได้ค้นหา)
  const [weather, setWeather] = useState(null);

  // เก็บข้อมูลพยากรณ์ 5 วัน
  const [forecast, setForecast] = useState([]);

  // true = กำลังโหลดข้อมูลอยู่ → แสดง loading spinner
  const [loading, setLoading] = useState(false);

  // เก็บข้อความ error ถ้าค้นหาไม่เจอหรือมีปัญหา
  const [error, setError] = useState('');

  // appIsReady = true เมื่อแอปโหลดเสร็จพร้อมแสดงผล
  const [appIsReady, setAppIsReady] = useState(false);

  // useEffect ทำงานครั้งเดียวตอน component โหลด ([] = ไม่มี dependency)
  useEffect(() => {
    async function prepare() {
      try {
        // หน่วงเวลา 2 วินาทีให้เห็น Splash Screen ก่อน
        // ถ้ามีอะไรต้องโหลดล่วงหน้า เช่น font ให้ทำตรงนี้
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // โหลดเสร็จแล้ว พร้อมแสดงแอป
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  // useCallback = ฟังก์ชันนี้จะถูกสร้างใหม่เฉพาะตอน appIsReady เปลี่ยน
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // ซ่อน Splash Screen เมื่อ layout พร้อมแล้ว
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  // ถ้ายังไม่พร้อม ไม่แสดงอะไรเลย (Splash Screen จะค้างอยู่)
  if (!appIsReady) return null;

  // ฟังก์ชันหลัก: เรียก API ดึงข้อมูลอากาศ
  const fetchWeather = async () => {
    if (!city) return; // ถ้าไม่ได้พิมพ์ชื่อเมือง ไม่ต้องทำอะไร
    setLoading(true);  // เริ่มโหลด
    setError('');      // ล้าง error เก่าออก

    try {
      // เรียก API 2 ตัวพร้อมกัน (ไวกว่าเรียกทีละตัว)
      const [weatherRes, forecastRes] = await Promise.all([
        // API ที่ 1: อากาศปัจจุบัน
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=th`),
        // API ที่ 2: พยากรณ์ล่วงหน้า
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=th`)
      ]);

      // แปลง response เป็น JSON
      const weatherData = await weatherRes.json();
      const forecastData = await forecastRes.json();

      if (weatherData.cod !== 200) {
        // cod !== 200 แปลว่าไม่เจอเมือง
        setError('ไม่พบเมืองนี้ ลองใหม่นะ');
        setWeather(null);
        setForecast([]);
      } else {
        // ค้นหาสำเร็จ → เก็บข้อมูลไว้ใน state
        setWeather(weatherData);

        // filter เอาทุก index ที่ 8 = ทุก 24 ชม. = วันละ 1 รายการ
        // slice(0, 5) = เอาแค่ 5 วันแรก
        const daily = forecastData.list.filter((_, i) => i % 8 === 0).slice(0, 5);
        setForecast(daily);
      }
    } catch (e) {
      // ถ้า internet มีปัญหา หรือ fetch ล้มเหลว
      setError('เกิดข้อผิดพลาด ลองใหม่อีกครั้ง');
    }

    setLoading(false); // โหลดเสร็จแล้ว
  };

  // กำหนดสีพื้นหลังตามสภาพอากาศ ถ้ายังไม่ได้ค้นหาใช้สีน้ำเงินเริ่มต้น
  const bgColors = weather ? getBackground(weather.weather[0].main) : ['#1a56a0', '#0d3b73'];

  return (
    // ScrollView ทำให้ scroll ได้เวลาเนื้อหายาวเกินหน้าจอ
    // onLayout ทำงานตอน View render ครั้งแรก → ซ่อน Splash Screen
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: bgColors[0] }]}
      onLayout={onLayoutRootView}
    >
      {/* แถวโลโก้ + ชื่อแอป */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
        {/* รูปโลโก้จากโฟลเดอร์ assets */}
        <Image
          source={require('./assets/icon.png')}
          style={{ width: 50, height: 50, marginRight: 10, borderRadius: 12 }}
        />
        {/* ชื่อแอป */}
        <Text style={styles.title}>ClearSky</Text>
      </View>

      {/* component ช่องค้นหา รับ props 3 ตัว */}
      <SearchBar city={city} setCity={setCity} onSearch={fetchWeather} />

      {/* แสดง loading spinner ตอนกำลังดึงข้อมูล */}
      {loading && <ActivityIndicator size="large" color="white" style={{ marginTop: 20 }} />}

      {/* แสดง error ถ้ามี */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* การ์ดอากาศปัจจุบัน แสดงเมื่อมีข้อมูลแล้ว */}
      {weather && <WeatherCard weather={weather} />}

      {/* การ์ดพยากรณ์ 5 วัน แสดงเมื่อมีข้อมูลแล้ว */}
      {forecast.length > 0 && <ForecastCard forecast={forecast} />}
    </ScrollView>
  );
}