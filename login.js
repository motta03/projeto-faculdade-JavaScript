import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, Image, Button  } from 'react-native';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const FIREBASE_URL = 'https://firestore.googleapis.com/v1/projects/appconsultorio-d86ca/databases/(default)/documents/usuarios';

  const fazerLogin = async () => {
  if (!email || !senha) {
    Alert.alert('Preencha todos os campos!');
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(FIREBASE_URL);
    const data = await response.json();

    const listaUsuarios = data.documents?.map((doc) => {
      const f = doc.fields ?? {};
      return {
        id: doc.name.split('/').pop(),
        email: f.email?.stringValue ?? '',
        senha: f.senha?.stringValue ?? '',
        tipo: f.tipo?.stringValue ?? 'usuario'
      };
    }) || [];

    const usuarioEncontrado = listaUsuarios.find(u => u.email === email);

    if (!usuarioEncontrado) {
      Alert.alert('Usuário não encontrado!');
    } 
    else if (usuarioEncontrado.senha !== senha) {
      Alert.alert('Senha incorreta!');
    } 
    else {
      
      if (usuarioEncontrado.tipo === "admin") {
        navigation.navigate("admin");
      } else {
        navigation.navigate("usuario", { email });
      }
    }

  } catch (erro) {
    console.error('Erro no login:', erro);
    Alert.alert('Erro ao realizar login');
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={styles.container}>

    <Image 
          style={styles.logo}
          source={{ uri: 'https://static.vecteezy.com/system/resources/previews/019/879/186/original/user-icon-on-transparent-background-free-png.png' }} 
        />

      <Text style={styles.titulo}>Faça o Login</Text>

      <TextInput
        placeholder="E-mail"
        style={styles.input}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Senha"
        style={styles.input}
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity style={styles.button} onPress={fazerLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" />
        ) : (
          <Text style={styles.buttonText}>Entrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonCadastro} onPress={() => navigation.navigate     ('cadastro')}>
        <Text style={styles.cadastroText}>Cadastre-se agora</Text>
      </TouchableOpacity>
    </View>

  
      

    
  );
}


const styles = StyleSheet.create({
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  input: {
    borderWidth: 1,
    borderColor: "#101010",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    width: "70%",
    backgroundColor: "#1111",
  },

  button: {
    backgroundColor: "#0066cc",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 4,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  logo: {
    width: 100,
    height: 90,
    marginBottom: 8,
  },
});