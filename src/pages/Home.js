import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";

export default function Home({ navigation }) {
  return (
    <ImageBackground 
      source={require('../img/financeiro.png')} 
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Controle Financeiro</Text>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate("AddTransaction")}
        >
          <Text style={styles.buttonText}>Adicionar Receita/Despesa</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate("Table")}
        >
          <Text style={styles.buttonText}>Ver Tabela Mensal</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate("Predictions")}
        >
          <Text style={styles.buttonText}>Previsões</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate("Charts")}
        >
          <Text style={styles.buttonText}>Gráficos</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.6)", 
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#1E90FF",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
