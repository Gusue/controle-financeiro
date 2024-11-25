import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AddTransaction({ navigation }) {
    const [type, setType] = useState("Receita");
    const [category, setCategory] = useState("Salário");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (type === "Receita") {
            setCategories(["Salário", "Investimentos", "Vendas de serviços"]);
            setCategory("Salário");
        } else if (type === "Despesa") {
            setCategories(["Alimentação","Cuidados Pessoais", "Educação", "Investimento", "Habitação", "Impostos", "Lazer", "Transporte","Vestuário","Outros"]);
            setCategory("Alimentação");
        }
    }, [type]);

    const handleSubmit = async () => {
        if (amount && date) {
            const dateParts = date.split("/");
            const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

            const newTransaction = {
                type,
                category,
                amount: parseFloat(amount),
                date: formattedDate,
            };

            try {
                const storedTransactions = await AsyncStorage.getItem("transactions");
                const transactions = storedTransactions ? JSON.parse(storedTransactions) : [];

                transactions.push(newTransaction);
                await AsyncStorage.setItem("transactions", JSON.stringify(transactions));

                console.log("Transação salva:", newTransaction);
                navigation.navigate("Table");
            } catch (error) {
                console.log("Erro ao salvar transação", error);
            }
        } else {
            console.log("Por favor, preencha todos os campos.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Tipo de transação</Text>
            <Picker selectedValue={type} onValueChange={(itemValue) => setType(itemValue)} style={styles.picker}>
                <Picker.Item label="Receita" value="Receita" />
                <Picker.Item label="Despesa" value="Despesa" />
            </Picker>

            <Text style={styles.label}>Categoria</Text>
            <Picker selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)} style={styles.picker}>
                {categories.map((cat, index) => (
                    <Picker.Item key={index} label={cat} value={cat} />
                ))}
            </Picker>

            <TextInput
                style={styles.input}
                placeholder="Valor"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                placeholderTextColor="#d3d3d3" 
            />

            <TextInput
                style={styles.input}
                placeholder="Data (DD/MM/AAAA)"
                value={date}
                onChangeText={setDate}
                placeholderTextColor="#d3d3d3" 
            />


            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#000", 
        justifyContent: "center",
    },
    label: {
        fontSize: 18,
        marginVertical: 10,
        color: "#fff", 
    },
    picker: {
        backgroundColor: "#333", 
        color: "#fff", 
        borderRadius: 5,
        padding: 0,
        marginBottom: 15,
    },
    input: {
        height: 40,
        borderColor: "#fff", 
        borderWidth: 1,
        marginBottom: 20,
        paddingLeft: 10,
        borderRadius: 5,
        color: "#fff", 



    },
    button: {
        backgroundColor: "#28a745", 
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "#fff", 
        fontSize: 16,
        fontWeight: "bold",
    },
});
