import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./src/pages/Home"; // Tela Home
import AddTransaction from "./src/pages/AddTransaction"; // Tela para adicionar transações
import Table from "./src/pages/Table"; // Tela para ver as transações
import Predictions from "./src/pages/Predictions"; // Tela de previsões
import Charts from "./src/pages/Charts"; // Tela de gráficos

const Stack = createNativeStackNavigator();


// // Função para limpar todos os dados do AsyncStorage
// import AsyncStorage from "@react-native-async-storage/async-storage";
// const clearAsyncStorage = async () => {
//   try {
//     await AsyncStorage.clear(); // Limpa todos os dados
//     console.log("Todos os dados foram excluídos do AsyncStorage.");
//   } catch (error) {
//     console.error("Erro ao excluir dados do AsyncStorage:", error);
//   }
// };

// // Chama a função para limpar os dados
// clearAsyncStorage();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#000", // header
          },
          headerTintColor: "#fff", // texto do header
          headerTitleStyle: {
            fontWeight: "bold", 
            fontSize: 20, 
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: '' }}
        />
        <Stack.Screen
          name="AddTransaction"
          component={AddTransaction}
          options={{ title: 'Adicionar Transações' }}
        />
        <Stack.Screen
          name="Table"
          component={Table}
          options={{ title: 'Tabela Mensal' }}
        />
        <Stack.Screen
          name="Predictions"
          component={Predictions}
          options={{ title: 'Previsões' }}
        />
        <Stack.Screen
          name="Charts"
          component={Charts}
          options={{ title: 'Gráficos' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
