import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TextInput, Button, Alert, TouchableOpacity, ScrollView} from 'react-native';
import { enviarSMS } from "./smsService";

export default function App() {
  const [ editandoId, setEditandoId ] = useState (null);  
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [procedimento, setProcedimento] = useState('');
  const [data, setData] = useState('');

  const FIREBASE_URL = 'https://firestore.googleapis.com/v1/projects/appconsultorio-d86ca/databases/(default)/documents/agendamentos';

  useEffect(() => {
    buscarClientes();
  }, []);

const excluirCliente = async (id) => {
  try {
    const url = `${FIREBASE_URL}/${id}`;
    const resposta = await fetch(url, { method: 'DELETE' });

    if (resposta.ok) {
      buscarClientes();
      Alert.alert('Cliente excluído com sucesso!');
    } else {
      Alert.alert('Erro ao excluir cliente.');
    }
  } catch (erro) {
    console.error('Erro ao excluir cliente:', erro);
  }
};

const iniciarEdicao = (cliente) => {
  setNome(cliente.nome);
  setEmail(cliente.email);
  setCpf(cliente.cpf);
  setTelefone(cliente.telefone);
  setProcedimento(cliente.procedimento);
  setData(cliente.data);
  setEditandoId(cliente.id);
};

const atualizarCliente = async () => {
  if (!nome || !email || !cpf || !telefone || !procedimento || !data) {
    Alert.alert('Preencha todos os campos!');
    return;
  }

  const clienteAtualizado = {
    fields: {
      nome: { stringValue: nome },
      email: { stringValue: email },
      cpf: { stringValue: cpf },
      telefone: { stringValue: telefone },
      procedimento: { stringValue: procedimento },
      data: { stringValue: data },
    },
  };

  try {
    const url = `${FIREBASE_URL}/${editandoId}`;
    const resposta = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clienteAtualizado),
    });

if (resposta.ok) {
    
     await enviarSMS(
      telefone,
      `Olá! Sua consulta foi agendada para o dia ${data}.`
    );
    
        limparFormulario();
        buscarClientes();
        Alert.alert('Cliente atualizado com sucesso!');
      } else {
        Alert.alert('Erro ao atualizar cliente.');
      }
    } catch (erro) {
      console.error('Erro ao atualizar cliente:', erro);
    }
  };

const buscarClientes = async () => {
  try {
    const resposta = await fetch(FIREBASE_URL);
    const dados = await resposta.json();

    const lista = dados.documents?.map((doc) => {
      const fields = doc.fields ?? {};
      return {
          id: doc.name.split('/').pop(),
          nome: fields.nome?.stringValue ?? "",
          email: fields.email?.stringValue ?? "",
          cpf: fields.cpf?.stringValue ?? "",
          telefone: fields.telefone?.stringValue ?? "",
          procedimento: fields.procedimento?.stringValue ?? "",
          data: fields.data?.stringValue ?? "",
        };
      }) || [];

    setClientes(lista);
  } catch (erro) {
    console.error('Erro ao buscar clientes:', erro);
  } finally {
    setLoading(false);
  }
};
 
const adicionarCliente = async () => {
  if (!nome || !email || !cpf || !telefone || !procedimento || !data) {
    Alert.alert('Preencha todos os campos!');
    return;
  }

  const novoCliente = {
    fields: {
      nome: { stringValue: nome },
      email: { stringValue: email },
      cpf: { stringValue: cpf },
      telefone: { stringValue: telefone },
      procedimento: { stringValue: procedimento },
      data: { stringValue: data },
    },
  };

  try {
    const resposta = await fetch(FIREBASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoCliente),
    });

  if (resposta.ok) {
      limparFormulario();
      buscarClientes();
        Alert.alert('Cliente cadastrado com sucesso!');
      } else {
        Alert.alert('Erro ao cadastrar cliente.');
      }
    } catch (erro) {
      console.error('Erro ao adicionar cliente:', erro);
      Alert.alert('Erro na requisição');
    }
  };

  const limparFormulario = () => {
    setNome('');
    setEmail('');
    setCpf('');
    setTelefone('');
    setProcedimento('');
    setData('');
    setEditandoId(null);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text>Carregando dados...</Text>
      </View>
    );
  }

  return (
     <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}> Lista de Agendamento </Text>

      <View style={styles.form}>
        <TextInput
          placeholder="Nome"
          style={styles.input}
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          placeholder="E-mail"
          style={styles.input}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="CPF"
          style={styles.input}
          value={cpf}
          onChangeText={setCpf}
        />
        <TextInput
          placeholder="Telefone ex: +55 11 99999-8888"
          style={styles.input}
          value={telefone}
          onChangeText={setTelefone}
        />
        <TextInput
          placeholder="Procedimento"
          style={styles.input}
          value={procedimento}
          onChangeText={setProcedimento}
        />
        <TextInput
          placeholder="Data do Agendamento"
          style={styles.input}
          value={data}
          onChangeText={setData}
        />
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={editandoId ? atualizarCliente : adicionarCliente}
        >
        <Text style={styles.buttonText}>
          {editandoId ? 'Atualizar Cliente' : 'Adicionar Cliente'}
        </Text>
        </TouchableOpacity>

    </View>
    <View style={{ flex: 1 }}>
      <FlatList
        data={clientes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
        
          <View style={styles.card}>
            <View style={{ paddingRight: 40 }}>
              <Text> Nome: {item.nome}</Text>
              <Text> Email: {item.email}</Text>
              <Text> CPF: {item.cpf}</Text>
              <Text> Telefone: {item.telefone}</Text>
              <Text> Procedimento: {item.procedimento}</Text>
              <Text> Data: {item.data}</Text>
            </View>

            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => iniciarEdicao(item)} style={styles.iconButton}>
                <Ionicons name="create-outline" size={24} color="#0066cc" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => excluirCliente(item.id)} style={styles.iconButton}>
                <Ionicons name="trash-outline" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
     </ScrollView>

  );
}

const styles = StyleSheet.create({
  container: {
    padding: 35,
    marginTop: 80,
  },

  titulo: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },

  input: {
    borderWidth: 1,
    borderColor: "#101010",
    padding: 10,
    borderRadius: 8, 
    marginBottom: 12,
    backgroundColor: "#1111",
  },

  button: {
  backgroundColor: '#0066cc',
  paddingVertical: 12,
  borderRadius: 12,
  alignItems: 'center',
  marginTop: 6,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 3,
  elevation: 3,
},

  buttonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
  letterSpacing: 0.5,
},

  form: {
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#f0f0f0', 
    marginBottom: 10,
    padding: 15,
    borderRadius: 10,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
  },

});