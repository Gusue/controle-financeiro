import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ImageBackground } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TransactionTable() {
  const [transactions, setTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Mês inicial
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Ano inicial
  const [showReceitas, setShowReceitas] = useState(false); // visibilidade das receitas
  const [showDespesas, setShowDespesas] = useState(false); // visibilidade das despesas

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const storedTransactions = await AsyncStorage.getItem("transactions");
        if (storedTransactions) {
          const parsedTransactions = JSON.parse(storedTransactions);
          setTransactions(parsedTransactions);
        }
      } catch (error) {
        console.log("Erro ao recuperar transações", error);
      }
    };

    getTransactions();
  }, []);

  const deleteTransaction = async (index) => {
    const updatedTransactions = [...transactions];
    updatedTransactions.splice(index, 1);

    setTransactions(updatedTransactions);
    await AsyncStorage.setItem("transactions", JSON.stringify(updatedTransactions));
  };

  const confirmDelete = (index) => {
    Alert.alert(
      "Confirmação",
      "Tem certeza que deseja excluir esta transação?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", onPress: () => deleteTransaction(index), style: "destructive" },
      ]
    );
  };

  const calculateTotals = (type) => {
    const filteredTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return (
        transaction.type === type &&
        transactionDate.getMonth() + 1 === selectedMonth &&
        transactionDate.getFullYear() === selectedYear
      );
    });

    return filteredTransactions.reduce((total, transaction) => total + transaction.amount, 0);
  };

  const filterTransactionsByType = (type) => {
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getMonth() + 1 === selectedMonth &&
        transactionDate.getFullYear() === selectedYear &&
        transaction.type === type
      );
    });
  };

  const getMonthYearString = () => {
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    return `${monthNames[selectedMonth - 1]} ${selectedYear}`;
  };

  const changeMonth = (direction) => {
    let newMonth = selectedMonth + direction;
    let newYear = selectedYear;

    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    } else if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }

    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  };

  const renderTransactionItem = (item, index) => {
    const transactionDate = new Date(item.date);
    const formattedDate = `${transactionDate.getDate().toString().padStart(2, "0")}/${(transactionDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${transactionDate.getFullYear()}`;

    return (
      <View style={styles.transactionRow}>
        <Text style={styles.transactionText}>
          {formattedDate} - {item.category} - {item.type} - R$ {item.amount.toFixed(2)}
        </Text>
        <TouchableOpacity
          onPress={() => confirmDelete(index)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>X</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ImageBackground source={require('../img/preto.png')} style={styles.container}>
      <Text style={styles.title}></Text>

      <View style={styles.monthYearContainer}>
        <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.arrowButton}>
          <Text style={styles.arrowText}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.monthYearText}>{getMonthYearString()}</Text>
        <TouchableOpacity onPress={() => changeMonth(1)} style={styles.arrowButton}>
          <Text style={styles.arrowText}>{">"}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>
        Receitas Totais: R$ {calculateTotals("Receita").toFixed(2)}
      </Text>
      <TouchableOpacity onPress={() => setShowReceitas(!showReceitas)}>
        <Text style={styles.toggleText}>{showReceitas ? "Fechar Detalhes" : "Ver Detalhes"}</Text>
      </TouchableOpacity>

      {showReceitas && (
        <FlatList
          data={filterTransactionsByType("Receita")}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => renderTransactionItem(item, index)}
        />
      )}

      <Text style={styles.sectionTitle}>
        Despesas Totais: R$ {calculateTotals("Despesa").toFixed(2)}
      </Text>
      <TouchableOpacity onPress={() => setShowDespesas(!showDespesas)}>
        <Text style={styles.toggleText}>{showDespesas ? "Fechar Detalhes" : "Ver Detalhes"}</Text>
      </TouchableOpacity>

      {showDespesas && (
        <FlatList
          data={filterTransactionsByType("Despesa")}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => renderTransactionItem(item, index)}
        />
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    justifyContent: "flex-start", 
    backgroundColor: "rgba(0, 0, 0, 0.5)" // Adicionando semitransparência ao fundo
  },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 10,textAlign: "center",paddingBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#fff", marginTop: 10 ,textAlign: "center",},
  monthYearContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  arrowButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  arrowText: { color: "#fff", fontSize: 18 },
  monthYearText: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "rgba(255, 255, 255, 0.7)", // Translucente para contraste
    borderRadius: 8,
  },
  transactionText: { fontSize: 16, color: "#333" },
  deleteButton: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: { color: "#fff", fontWeight: "bold" },
  toggleText: { color: "#007BFF", fontSize: 16, marginBottom: 10, fontWeight: "bold",textAlign: "center" },
});
