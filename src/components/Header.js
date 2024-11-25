import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

export default function Header({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Controle Financeiro</Text>
      <View style={styles.buttonContainer}>
        <Button title="Adicionar Transação" onPress={() => navigation.navigate("AddTransaction")} />
        <Button title="Ver Transações" onPress={() => navigation.navigate("TransactionTable")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold" },
  buttonContainer: { flexDirection: "row", marginTop: 20 },
});
