import { StyleSheet } from 'react-native';

// รวม styles ทั้งหมดไว้ที่นี่ที่เดียว
// ทำให้แก้ไข design ได้ง่าย ไม่ต้องไล่หาใน component ต่างๆ
const styles = StyleSheet.create({
  // container หลักของทั้งแอป
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 60,       // เว้นด้านบนหนีกล้องหน้า
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  // ชื่อแอปด้านบน
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  // แถวค้นหา (ช่องพิมพ์ + ปุ่ม)
  searchRow: {
    flexDirection: 'row', // เรียงแนวนอน
    width: '100%',
    marginBottom: 20,
    gap: 8,
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
  // ข้อความ error
  error: {
    color: '#ffcccc',
    fontSize: 16,
    marginTop: 10,
  },
  // การ์ดอากาศปัจจุบัน
  card: {
    backgroundColor: 'rgba(255,255,255,0.2)', // ขาวโปร่งใส
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
    textTransform: 'capitalize', // ตัวอักษรแรกใหญ่
  },
  // แถวรายละเอียด (ความชื้น, ลม, รู้สึกเหมือน)
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
  // การ์ดพยากรณ์ 5 วัน
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
  // แถวแต่ละวันใน forecast
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

export default styles;