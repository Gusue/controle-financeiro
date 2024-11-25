import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, Alert, Button, ScrollView } from "react-native";
import { LineChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function IncomeExpenseChart() {
    const [data, setData] = useState({
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        income: Array(12).fill(0),
        expense: Array(12).fill(0),
        categoryIncome: {},
        categoryExpense: {},
        cumulativeBalance: Array(12).fill(0), // Saldo acumulado
    });

    const [activeChart, setActiveChart] = useState("cumulativeBalance"); // Começa com o gráfico de saldo acumulado

    useEffect(() => {
        fetchChartData();
    }, []);

    const fetchChartData = async () => {
        try {
            const storedData = await AsyncStorage.getItem("transactions");
            const allTransactions = storedData ? JSON.parse(storedData) : [];

            const monthlyIncome = Array(12).fill(0);
            const monthlyExpense = Array(12).fill(0);

            const categoryIncome = {};
            const categoryExpense = {};

            allTransactions.forEach((transaction) => {
                const date = new Date(transaction.date);
                const month = date.getMonth();

                if (transaction.type === "Receita") {
                    monthlyIncome[month] += transaction.amount;

                    const category = transaction.category;
                    if (!categoryIncome[category]) {
                        categoryIncome[category] = Array(12).fill(0);
                    }
                    categoryIncome[category][month] += transaction.amount;
                } else if (transaction.type === "Despesa") {
                    monthlyExpense[month] += transaction.amount;

                    const category = transaction.category;
                    if (!categoryExpense[category]) {
                        categoryExpense[category] = Array(12).fill(0);
                    }
                    categoryExpense[category][month] += transaction.amount;
                }
            });

            // Calculando saldo acumulado
            let cumulativeBalance = [];
            let runningTotal = 0;
            monthlyIncome.forEach((income, index) => {
                const balance = income - monthlyExpense[index];
                runningTotal += balance;
                cumulativeBalance.push(runningTotal);
            });

            setData({
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                income: monthlyIncome,
                expense: monthlyExpense,
                categoryIncome: categoryIncome,
                categoryExpense: categoryExpense,
                cumulativeBalance: cumulativeBalance, // Atualiza o saldo acumulado
            });
        } catch (error) {
            console.error("Erro ao carregar os dados:", error);
            Alert.alert("Erro", "Não foi possível carregar os dados dos gráficos.");
        }
    };

    const categoryIncomeDatasets = Object.keys(data.categoryIncome).map((category) => {
        let color = "";
        switch (category) {
            case "Salário":
                color = "#0000FF"; // Azul
                break;
            case "Investimento":
                color = "#800080"; // Roxo
                break;
            case "Vendas de serviços":
                color = "#FF1493"; // Rosa
                break;
            default:
                color = "#000000";
        }

        return {
            data: data.categoryIncome[category],
            color: () => color,
            label: category,
        };
    });

    const categoryExpenseDatasets = Object.keys(data.categoryExpense).map((category) => {
        let color = "";
        switch (category) {
            case "Alimentação":
                color = "#FFD700"; 
                break;
            case "Cuidados Pessoais":
                color = "#FF6347"; 
                break;
            case "Educação":
                color = "#4682B4"; 
                break;
            case "Investimento":
                color = "#800080"; 
                break;
            case "Habitação":
                color = "#32CD32"; 
                break;
            case "Impostos":
                color = "#FF4500"; 
                break;
            case "Lazer":
                color = "#9370DB"; 
                break;
            case "Transporte":
                color = "#00BFFF"; 
                break;
            case "Vestuário":
                color = "#FF69B4"; 
                break;
            case "Outros":
                color = "#A9A9A9"; 
                break;
            default:
                color = "#000000";
        }

        return {
            data: data.categoryExpense[category],
            color: () => color,
            label: category,
        };
    });

    const renderLegend = (datasets) => {
        return datasets.map((dataset, index) => (
            <View key={index} style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: dataset.color() }]} />
                <Text style={styles.legendText}>{dataset.label}</Text>
            </View>
        ));
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Receitas e Despesas por Mês</Text>

            <View style={styles.buttonsContainer}>

                <Button
                    title="Saldo Acumulado"
                    onPress={() => setActiveChart("cumulativeBalance")}
                    color={activeChart === "cumulativeBalance" ? "#32CD32" : "#2196F3"}
                />
                <Button
                    title="Receitas"
                    onPress={() => setActiveChart("income")}
                    color={activeChart === "income" ? "#4CAF50" : "#2196F3"}
                />

                <Button
                    title="Receitas por Categoria"
                    onPress={() => setActiveChart("categoryIncome")}
                    color={activeChart === "categoryIncome" ? "#4CAF50" : "#2196F3"}
                />
                <Button
                    title="Despesas"
                    onPress={() => setActiveChart("expense")}
                    color={activeChart === "expense" ? "#FF6347" : "#FF5722"}
                />

                <Button
                    title="Despesas por Categoria"
                    onPress={() => setActiveChart("categoryExpense")}
                    color={activeChart === "categoryExpense" ? "#FF6347" : "#FF5722"}
                />


            </View>

            {activeChart === "income" && (
                <>
                    <LineChart
                        data={{
                            labels: data.labels,
                            datasets: [
                                {
                                    data: data.income, // Receitas mensais
                                    color: () => "green",
                                    label: "Receitas",
                                },
                                {
                                    data: data.expense, // Despesas mensais
                                    color: () => "red",
                                    label: "Despesas",
                                },
                            ],
                        }}
                        width={Dimensions.get("window").width - 20}
                        height={220}
                        chartConfig={{
                            backgroundColor: "#000", 
                            backgroundGradientFrom: "#000",
                            backgroundGradientTo: "#333",
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, 
                            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        }}
                    />
                    {renderLegend([
                        { color: () => "green", label: "Receitas" },
                        { color: () => "red", label: "Despesas" },
                    ])}
                </>
            )}

            {activeChart === "expense" && (
                <>
                    <LineChart
                        data={{
                            labels: data.labels,
                            datasets: [
                                {
                                    data: data.expense, // Despesas mensais
                                    color: () => "red",
                                    label: "Despesas",
                                },
                            ],
                        }}
                        width={Dimensions.get("window").width - 20}
                        height={220}
                        chartConfig={{
                            backgroundColor: "#000", 
                            backgroundGradientFrom: "#000",
                            backgroundGradientTo: "#333",
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, 
                            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        }}
                    />
                    {renderLegend([{ color: () => "red", label: "Despesas" }])}
                </>
            )}

            {activeChart === "categoryIncome" && (
                <>
                    <LineChart
                        data={{
                            labels: data.labels,
                            datasets: categoryIncomeDatasets, // Receitas categoria
                        }}
                        width={Dimensions.get("window").width - 20}
                        height={220}
                        chartConfig={{
                            backgroundColor: "#000", 
                            backgroundGradientFrom: "#000",
                            backgroundGradientTo: "#333",
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        }}
                    />
                    {renderLegend(categoryIncomeDatasets)}
                </>
            )}

            {activeChart === "categoryExpense" && (
                <>
                    <LineChart
                        data={{
                            labels: data.labels,
                            datasets: categoryExpenseDatasets, // Despesas categoria
                        }}
                        width={Dimensions.get("window").width - 20}
                        height={220}
                        chartConfig={{
                            backgroundColor: "#000", 
                            backgroundGradientFrom: "#000",
                            backgroundGradientTo: "#333",
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, 
                            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        }}
                    />
                    {renderLegend(categoryExpenseDatasets)}
                </>
            )}

            {activeChart === "cumulativeBalance" && (
                <>
                    <LineChart
                        data={{
                            labels: data.labels,
                            datasets: [
                                {
                                    data: data.cumulativeBalance, // Saldo acumulado
                                    color: () => "#32CD32", 
                                    label: "Saldo Acumulado",
                                },
                            ],
                        }}
                        width={Dimensions.get("window").width - 20}
                        height={220}
                        chartConfig={{
                            backgroundColor: "#000", 
                            backgroundGradientFrom: "#000",
                            backgroundGradientTo: "#333",
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        }}
                    />
                    {renderLegend([
                        { color: () => "#32CD32", label: "Saldo Acumulado" },
                    ])}
                </>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#000" }, 
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#fff" }, 
    buttonsContainer: {
        flexDirection: "column",
        justifyContent: "center",
        marginBottom: 20,
    },
    legendItem: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 5,
    },
    legendColor: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    legendText: {
        fontSize: 14,
        color: "#fff", 
    },
});
