import * as React from 'react';
import { Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './login';
import CadastroUsuario from './cadastro';
import Usuario from './Usuario';
import Admin from './Admin';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="login">
        <Stack.Screen name="login" component={Login} />
        <Stack.Screen name="cadastro" component={CadastroUsuario} />
        <Stack.Screen name="usuario" component={Usuario} />
        <Stack.Screen name="admin" component={Admin} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}