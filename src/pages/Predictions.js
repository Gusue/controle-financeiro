import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Predictions() {
  const [averageIncome, setAverageIncome] = useState(0);
  const [averageExpense, setAverageExpense] = useState(0);

  useEffect(() => {
    calculateAverages();
  }, []);

  const calculateAverages = async () => {
    try {
      const storedData = await AsyncStorage.getItem("transactions");
      const allTransactions = storedData ? JSON.parse(storedData) : [];
      const incomes = allTransactions.filter((t) => t.type === "Receita").map((t) => t.amount);
      const expenses = allTransactions.filter((t) => t.type === "Despesa").map((t) => t.amount);

      const incomeAverage = incomes.length ? incomes.reduce((a, b) => a + b, 0) / incomes.length : 0;
      const expenseAverage = expenses.length ? expenses.reduce((a, b) => a + b, 0) / expenses.length : 0;

      setAverageIncome(incomeAverage);
      setAverageExpense(expenseAverage);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível calcular as médias.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Próximo Mes</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Receita Prevista</Text>
        <Text style={styles.cardValue}>R$ {averageIncome.toFixed(2)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Despesa Prevista</Text>
        <Text style={styles.cardValue}>R$ {averageExpense.toFixed(2)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Saldo Previsto</Text>
        <Text style={styles.cardValue}>R$ {(averageIncome - averageExpense).toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "rgba(0, 0, 0, 0.8)" // Adicionando fundo transparente,
    
  },
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    color: "#fff", 
    marginBottom: 20, 
    textAlign: "center" 

  },
  card: {
    width: "90%",
    backgroundColor: "#fff", 
    padding: 20, 
    marginVertical: 10, 
    borderRadius: 10, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, 
  },
  cardTitle: {
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#333", 
    textAlign: "center",
  },
  cardValue: {
    fontSize: 22, 
    color: "#007BFF", 
    marginTop: 5, 
    textAlign: "center",
  },
});
