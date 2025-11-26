import { StyleSheet, Text, View, VirtualizedList, StatusBar, Image, Pressable, Alert, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';

const DATA_SOURCE = [
  { id: "1", title: "Extração", image: "https://engelodontologia.com.br/blog/wp-content/uploads/2024/10/As-vantagens-e-cuidados-na-extracao-dentaria-o-que-voce-precisa-saber.jpg" },
  { id: "2", title: "Implante", image: "https://supremaodontologia.com.br/wp-content/uploads/2024/08/implante-dentario-mal-feito-2.jpg" },
  { id: "3", title: "Limpeza", image: "https://adrianalanger.com.br/media/resize/1920x1080/tratamento/11/5c81372c04808.jpg" },
  { id: "4", title: "Prótese", image: "https://www.idealconsulta.com.br/public/informacoes/assets/img/img-mpi/protese-dentaria-de-porcelana-3.jpg" },
  { id: "5", title: "Enxerto", image: "https://luisgustavoleite.com.br/blog/wp-content/uploads/2018/11/cirurgia-sem-cortes-implantes-dent%C3%A1rios-enxerto-%C3%B3sseo.jpg" }
];

const getItem = ( data, index) => DATA_SOURCE[index];
const getItemCount = () => DATA_SOURCE.length;

export default function TabelaProcedimentos({ route }) {
  const { email } = route.params || {}; 
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);

  const FIREBASE_USUARIOS =
    'https://firestore.googleapis.com/v1/projects/appconsultorio-d86ca/databases/(default)/documents/usuarios';

  const FIREBASE_AGENDAMENTO =
    'https://firestore.googleapis.com/v1/projects/appconsultorio-d86ca/databases/(default)/documents/agendamentos';

  

  const carregarUsuario = async () => {
    try {
      const resp = await fetch(FIREBASE_USUARIOS);
      const dados = await resp.json();

      const lista = dados.documents?.map(doc => {
        const f = doc.fields || {};
        return {
          id: doc.name.split('/').pop(),
          nome: f.nome?.stringValue ?? '',
          email: f.email?.stringValue ?? '',
          cpf: f.cpf?.stringValue ?? '',
          senha: f.senha?.stringValue ?? '',
        };
      }) || [];

      const encontrado = lista.find(u => u.email === email);

      if (!encontrado) {
        Alert.alert("Erro", "Não foi possível carregar seus dados.");
      } else {
        setUsuario(encontrado);
      }
    } catch (erro) {
      console.error("Erro ao buscar usuário:", erro);
    } finally {
      setLoading(false);
    }
  };

  const carregarConsulta = async () => {
  try {
    const resp = await fetch(FIREBASE_AGENDAMENTO);
    const dados = await resp.json();

    const lista = dados.documents?.map(doc => {
      const f = doc.fields || {};
      return {
        nome: f.nome?.stringValue,
        email: f.email?.stringValue,
        procedimento: f.procedimento?.stringValue,
        data: f.data?.stringValue,
      };
    }) || [];

    const consulta = lista.find(c => c.email === email);
    if (consulta) {
      setUsuario(prev => ({ ...prev, data: consulta.data }));
    }
  } catch (err) {
    console.log("Erro ao carregar consulta:", err);
  }
};

  useEffect(() => {
    carregarUsuario();
    carregarConsulta();
  }, []);

  const pedirConsulta = async (procedimento) => {
    if (!usuario) {
      Alert.alert("Erro", "Usuário não carregado.");
      return;
    }

    setEnviando(true);

    const novaConsulta = {
      fields: {
        nome: { stringValue: usuario.nome },
        email: { stringValue: usuario.email },
        cpf: { stringValue: usuario.cpf },
        telefone: { stringValue: "Não informado" },
        procedimento: { stringValue: procedimento },
        data: { stringValue: "Pendente" },
      }
    };

    try {
      const resp = await fetch(FIREBASE_AGENDAMENTO, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaConsulta)
      });

      if (resp.ok) {
        Alert.alert("Consulta marcada!", `Procedimento "${procedimento}" solicitado.`);
      } else {
        Alert.alert("Erro", "Não foi possível registrar a consulta.");
      }
    } catch (erro) {
      console.error("Erro ao registrar consulta:", erro);
    } finally {
      setEnviando(false);
    }
  };


  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#006cc" />
        <Text>Carregando usuário...</Text>
      </View>
    );
  }

  return (

    
    <View style={styles.informacao_usuario}>
      <View>
      <Text style={styles.titulo}>Bem-vindo(a), {usuario?.nome}</Text>

      <View style={styles.boxInfo}>
        <Text style={styles.info}>📧 Email: {usuario?.email}</Text>
        <Text style={styles.info}>🧾 CPF: {usuario?.cpf}</Text>
        <Text style={styles.info}>📅 Próxima consulta: {usuario?.data || "Nenhuma marcada"} </Text>
      </View>
      </View>
      <VirtualizedList
        data={DATA_SOURCE}
        initialNumToRender={4}
        renderItem={({ item }) => (
          <View style={styles.item}>

            <Pressable onPress={() => !enviando && pedirConsulta(item.title)}>
              <Image source={{ uri: item.image }} style={styles.image} />
            </Pressable>

            <Text style={styles.title}>{item.title}</Text>

          </View>
        )}
        keyExtractor={(item) => item.id}
        getItem={getItem}
        getItemCount={getItemCount}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  informacao_usuario: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },

  item: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    marginHorizontal: 56,
    borderRadius: 10,
    paddingTop: 10,
  },

  image: {
    width: 300,
    height: 120,
    borderRadius: 8,
  },

  title: {
    marginTop: 10,
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
});
