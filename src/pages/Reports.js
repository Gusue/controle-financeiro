import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LineChart } from "react-native-chart-kit";

export default function Reports() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadTransactions = async () => {
      const storedData = await AsyncStorage.getItem("transactions");
      setData(storedData ? JSON.parse(storedData) : []);
    };
    loadTransactions();
  }, []);

  const generateChartData = () => {
    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const chartData = labels.map((_, index) => {
      const month = new Date().getMonth() - 5 + index;
      const filtered = data.filter(
        (item) => new Date(item.date).getMonth() === month
      );
      return filtered.reduce((sum, item) => sum + item.amount, 0);
    });
    return chartData;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Relatórios</Text>
      <LineChart
        data={{
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [{ data: generateChartData() }],
        }}
        width={Dimensions.get("window").width - 40}
        height={220}
        chartConfig={{
          backgroundColor: "#e26a00",
          backgroundGradientFrom: "#fb8c00",
          backgroundGradientTo: "#ffa726",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        style={{ marginVertical: 8, borderRadius: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});
