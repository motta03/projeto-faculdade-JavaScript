import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, Image, ScrollView } from 'react-native';

export default function CadastroUsuario() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);

   const FIREBASE_URL = 'https://firestore.googleapis.com/v1/projects/appconsultorio-d86ca/databases/(default)/documents/usuarios';

  const cadastrarUsuario = async () => {
    if (!nome || !cpf || !telefone || !email || !senha || !confirmarSenha) {
      Alert.alert('Preencha todos os campos!');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('As senhas não coincidem!');
      return;
    }

    setLoading(true);

    const novoUsuario = {
      fields: {
        nome: { stringValue: nome },
        cpf: { stringValue: cpf },
        telefone: { stringValue: telefone },
        email: { stringValue: email },
        senha: { stringValue: senha },
        confirmarsenha: { stringValue: senha },
        tipo: { stringValue: "usuario" }
      },
    };

    try {
      const resposta = await fetch(FIREBASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoUsuario),
      });

      if (resposta.ok) {
        Alert.alert('Usuário cadastrado com sucesso!');
        limparFormulario();
      } else {
        Alert.alert('Erro ao cadastrar usuário.');
      }
    } catch (erro) {
      console.error('Erro ao cadastrar usuário:', erro);
      Alert.alert('Erro na requisição');
    } finally {
      setLoading(false);
    }
  };

  const limparFormulario = () => {
    setNome('');
    setCpf('');
    setTelefone('');
    setEmail('');
    setSenha('');
    setConfirmarSenha('');
  };

  return (
     <ScrollView contentContainerStyle={styles.container}>

      <Image 
          style={styles.logo}
          source={{ uri: 'https://img.freepik.com/vetores-premium/sorriso-icone-simples-vector-design-de-modelo-icone-de-sorriso-isolado-no-fundo-branco-rosto-feliz_549897-2812.jpg' }} 
        />

      <Text style={styles.titulo}>Construindo o sorriso perfeito para você!</Text>
      <Text style={styles.subtitulo}></Text>

      <TextInput
        placeholder="Nome"
        style={styles.input}
        
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        placeholder="CPF"
        style={styles.input}
        
        value={cpf}
        onChangeText={setCpf}
      />

      <TextInput
        placeholder="Telefone"
        style={styles.input}
        
        value={telefone}
        onChangeText={setTelefone}
      />

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

      <TextInput
        placeholder="Confirmar Senha"
        style={styles.input}
        secureTextEntry
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
      />

      <TouchableOpacity style={styles.button} onPress={cadastrarUsuario} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" />
        ) : (
          <Text style={styles.buttonText}>Cadastre-se</Text>
        )}
      </TouchableOpacity>
     </ScrollView>
  );
}

const styles = StyleSheet.create({
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },

  subtitulo: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 14,
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
    color: "#000",
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
  },
});