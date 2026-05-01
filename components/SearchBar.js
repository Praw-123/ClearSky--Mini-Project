import { View, TextInput, TouchableOpacity, Text } from 'react-native';
// import styles จาก globalStyles แทนการเขียน style ใหม่
import styles from '../styles/globalStyles';

// SearchBar component รับ props มาจาก App.js
// city = ข้อความที่พิมพ์อยู่
// setCity = ฟังก์ชันอัปเดตข้อความ
// onSearch = ฟังก์ชันเรียก API ตอนกดค้นหา
export default function SearchBar({ city, setCity, onSearch }) {
  return (
    <View style={styles.searchRow}>
      <TextInput
        style={styles.input}
        placeholder="พิมพ์ชื่อเมือง เช่น Bangkok"
        placeholderTextColor="#aaa"
        value={city}
        onChangeText={setCity}           // อัปเดตทุกครั้งที่พิมพ์
        onSubmitEditing={onSearch}       // กด Enter ก็ค้นหาได้
      />
      <TouchableOpacity style={styles.button} onPress={onSearch}>
        <Text style={styles.buttonText}>ค้นหา</Text>
      </TouchableOpacity>
    </View>
  );
}