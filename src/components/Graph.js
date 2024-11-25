import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView, Alert } from "react-native";
import { LineChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/Header";

export default function Charts() {
  const [data, setData] = useState({ labels: [], income: [], expense: [], balance: [] });

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("transactions");
      const allTransactions = storedData ? JSON.parse(storedData) : [];
      const grouped = {};

      allTransactions.forEach((t) => {
        const date = new Date(t.date);
        const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
        if (!grouped[key]) grouped[key] = { income: 0, expense: 0 };
        grouped[key][t.type === "Receita" ? "income" : "expense"] += t.amount;
      });

      const sortedKeys = Object.keys(grouped).sort();
      const labels = sortedKeys;
      const income = sortedKeys.map((key) => grouped[key].income);
      const expense = sortedKeys.map((key) => grouped[key].expense);
      const balance = sortedKeys.map((key) => grouped[key].income - grouped[key].expense);

      setData({ labels, income, expense, balance });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os dados dos gráficos.");
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Gráficos" />
      <ScrollView>
        <Text style={styles.chartTitle}>Receitas</Text>
        <LineChart
          data={{
            labels: data.labels,
            datasets: [{ data: data.income, color: () => "green" }],
          }}
          width={Dimensions.get("window").width - 20}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
        />
        <Text style={styles.chartTitle}>Despesas</Text>
        <LineChart
          data={{
            labels: data.labels,
            datasets: [{ data: data.expense, color: () => "red" }],
          }}
          width={Dimensions.get("window").width - 20}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
        />
        <Text style={styles.chartTitle}>Saldo</Text>
        <LineChart
          data={{
            labels: data.labels,
            datasets: [{ data: data.balance, color: () => "blue" }],
          }}
          width={Dimensions.get("window").width - 20}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
        />
      </ScrollView>
    </View>
  );
}

const chartConfig = {
  backgroundColor: "#f8f8f8",
  backgroundGradientFrom: "#f8f8f8",
  backgroundGradientTo: "#e8e8e8",
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: { borderRadius: 8 },
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  chartTitle: { fontSize: 18, fontWeight: "bold", marginLeft: 10, marginTop: 20 },
  chart: { marginVertical: 10, borderRadius: 8, alignSelf: "center" },
});
