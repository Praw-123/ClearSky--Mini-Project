// import component ที่จำเป็นจาก React Native
// ScrollView = ทำให้หน้าจอ scroll ได้, Image = แสดงรูป
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Image } from 'react-native';

// useState = hook สำหรับเก็บข้อมูลที่เปลี่ยนแปลงได้ใน component
import { useState } from 'react';

// API Key จาก OpenWeatherMap สำหรับเรียกข้อมูลอากาศ
const API_KEY = 'ad044ee78deb31ddecbccf79c9af4d07';

// ฟังก์ชันคืนค่าสีพื้นหลังตามสภาพอากาศ
// weatherMain คือค่าที่ได้จาก API เช่น 'Clear', 'Rain', 'Clouds'
const getBackground = (weatherMain) => {
  switch (weatherMain) {
    case 'Clear': return ['#f7b733', '#fc4a1a'];       // แดด → สีส้ม
    case 'Clouds': return ['#606c88', '#3f3c6e'];      // เมฆ → สีเทา
    case 'Rain': return ['#373b44', '#4286f4'];        // ฝน → สีน้ำเงินเข้ม
    case 'Thunderstorm': return ['#232526', '#414345'];// พายุ → สีดำ
    case 'Snow': return ['#e0eafc', '#cfdef3'];        // หิมะ → สีขาว
    default: return ['#1a56a0', '#0d3b73'];            // ค่าเริ่มต้น → สีน้ำเงิน
  }
};

// ฟังก์ชันคืนค่า emoji ตามสภาพอากาศ
const getEmoji = (weatherMain) => {
  switch (weatherMain) {
    case 'Clear': return '☀️';
    case 'Clouds': return '☁️';
    case 'Rain': return '🌧️';
    case 'Thunderstorm': return '⛈️';
    case 'Snow': return '❄️';
    default: return '🌤️';
  }
};

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

  // ฟังก์ชันหลัก: เรียก API ดึงข้อมูลอากาศ
  const fetchWeather = async () => {
    if (!city) return; // ถ้าไม่ได้พิมพ์ชื่อเมือง ไม่ต้องทำอะไร
    setLoading(true);  // เริ่มโหลด
    setError('');      // ล้าง error เก่าออก

    try {
      // เรียก API 2 ตัวพร้อมกันเลย (ไวกว่าเรียกทีละตัว)
      // Promise.all = รอให้ทั้งคู่เสร็จก่อนค่อยไปต่อ
      const [weatherRes, forecastRes] = await Promise.all([
        // API ที่ 1: อากาศปัจจุบัน
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=th`),
        // API ที่ 2: พยากรณ์ล่วงหน้า (ให้ข้อมูลทุก 3 ชม. รวม 5 วัน)
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=th`)
      ]);

      // แปลง response เป็น JSON เพื่อนำไปใช้งาน
      const weatherData = await weatherRes.json();
      const forecastData = await forecastRes.json();

      if (weatherData.cod !== 200) {
        // cod !== 200 แปลว่า API คืน error เช่น ไม่เจอเมือง
        setError('ไม่พบเมืองนี้ ลองใหม่นะ');
        setWeather(null);
        setForecast([]);
      } else {
        // ค้นหาสำเร็จ → เก็บข้อมูลไว้ใน state
        setWeather(weatherData);

        // forecastData.list มีข้อมูลทุก 3 ชม.
        // filter เอาแค่ทุก index ที่ 8 = ทุก 24 ชม. = วันละ 1 รายการ
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
    // contentContainerStyle = style ของ content ข้างใน
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: bgColors[0] }]}>

      {/* ชื่อแอป */}
      <Text style={styles.title}>🌤 ClearSky </Text>

      {/* แถวค้นหา: ช่องพิมพ์ + ปุ่มค้นหา */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="พิมพ์ชื่อเมือง เช่น Bangkok"
          placeholderTextColor="#aaa"
          value={city}
          onChangeText={setCity}          // อัปเดต state ทุกครั้งที่พิมพ์
          onSubmitEditing={fetchWeather}  // กด Enter บน keyboard ก็ค้นหาได้
        />
        <TouchableOpacity style={styles.button} onPress={fetchWeather}>
          <Text style={styles.buttonText}>ค้นหา</Text>
        </TouchableOpacity>
      </View>

      {/* แสดง loading spinner ตอนกำลังดึงข้อมูล */}
      {loading && <ActivityIndicator size="large" color="white" style={{ marginTop: 20 }} />}

      {/* แสดง error ถ้ามี */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* การ์ดอากาศปัจจุบัน แสดงเฉพาะตอนมีข้อมูลแล้ว */}
      {weather && (
        <View style={styles.card}>
          {/* emoji สภาพอากาศ */}
          <Text style={styles.emoji}>{getEmoji(weather.weather[0].main)}</Text>

          {/* ชื่อเมืองและประเทศ */}
          <Text style={styles.cityName}>{weather.name}, {weather.sys.country}</Text>

          {/* อุณหภูมิ Math.round = ปัดเศษให้เป็นจำนวนเต็ม */}
          <Text style={styles.temp}>{Math.round(weather.main.temp)}°C</Text>

          {/* คำอธิบายสภาพอากาศ เช่น "เมฆเป็นส่วนมาก" */}
          <Text style={styles.desc}>{weather.weather[0].description}</Text>

          {/* กล่องรายละเอียดเพิ่มเติม 3 กล่อง */}
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
              <Text style={styles.detailLabel}>🌡 รู้สึกเหมือน</Text>
              {/* feels_like = อุณหภูมิที่รู้สึกจริงๆ รวม humidity และลม */}
              <Text style={styles.detailValue}>{Math.round(weather.main.feels_like)}°C</Text>
            </View>
          </View>
        </View>
      )}

      {/* การ์ดพยากรณ์ 5 วัน แสดงเฉพาะตอนมีข้อมูลแล้ว */}
      {forecast.length > 0 && (
        <View style={styles.forecastCard}>
          <Text style={styles.forecastTitle}>พยากรณ์ 5 วัน</Text>

          {/* วนลูปแสดงข้อมูลแต่ละวัน */}
          {forecast.map((item, index) => {
            // แปลง timestamp (วินาที) เป็น Date object
            // ต้อง x 1000 เพราะ JavaScript ใช้ millisecond
            const date = new Date(item.dt * 1000);

            // แปลงเป็นข้อความวันที่ภาษาไทย
            const day = date.toLocaleDateString('th-TH', { weekday: 'short', month: 'short', day: 'numeric' });

            return (
              <View key={index} style={styles.forecastRow}>
                <Text style={styles.forecastDay}>{day}</Text>
                <Text style={styles.forecastEmoji}>{getEmoji(item.weather[0].main)}</Text>
                <Text style={styles.forecastDesc}>{item.weather[0].description}</Text>
                <Text style={styles.forecastTemp}>{Math.round(item.main.temp)}°C</Text>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

// StyleSheet.create = สร้าง style สำหรับ component
// คล้าย CSS แต่ใช้ camelCase เช่น backgroundColor แทน background-color
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,          // ขยายให้เต็มหน้าจอ
    alignItems: 'center', // จัดกึ่งกลางแนวนอน
    paddingTop: 60,       // เว้นด้านบน (หนีกล้องหน้า)
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 24,
  },
  searchRow: {
    flexDirection: 'row', // จัด element เรียงแนวนอน
    width: '100%',
    marginBottom: 20,
    gap: 8,               // ระยะห่างระหว่าง element
  },
  input: {
    flex: 1,              // ขยายเต็มพื้นที่ที่เหลือ
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#f0a500',
    borderRadius: 12,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: '#ffcccc',
    fontSize: 16,
    marginTop: 10,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.2)', // สีขาวโปร่งใส 20%
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  emoji: {
    fontSize: 72,
    marginBottom: 8,
  },
  cityName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  temp: {
    fontSize: 72,
    fontWeight: 'bold',
    color: 'white',
  },
  desc: {
    fontSize: 20,
    color: 'white',
    marginBottom: 16,
    textTransform: 'capitalize', // ทำให้ตัวอักษรแรกเป็นตัวใหญ่
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 8,
  },
  detailBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  detailLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginBottom: 4,
  },
  detailValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forecastCard: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 20,
    width: '100%',
  },
  forecastTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  forecastRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.15)', // เส้นคั่นโปร่งใส
  },
  forecastDay: {
    color: 'white',
    fontSize: 14,
    flex: 2,
  },
  forecastEmoji: {
    fontSize: 20,
    flex: 1,
    textAlign: 'center',
  },
  forecastDesc: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    flex: 2,
    textAlign: 'center',
  },
  forecastTemp: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
});