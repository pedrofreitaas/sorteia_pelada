import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import {NotDefinedScreen} from './screens/ErrorScreen.js'
import {AlterPlayerScreen} from './screens/AlterPlayer.js'
import {DefineSquadScreen} from './screens/DefineSquad'
import {CreatePlayerScreen} from './screens/CreatePlayer'

import { ImageBackground, Text, View, StyleSheet, Pressable } from 'react-native';
import { displayPlayers, delAllPlayers } from './extra_modules/DataStorage.js';

const Stack = createNativeStackNavigator();

const MainScreen = () => {
  const backImg = require('./assets/imgs/soccer_field.jpg');

  const nav = useNavigation();

  return (
    <ImageBackground source={backImg} style={styles.backImg}>
      <View style={styles.container}>
        <Text style={styles.main_title}> Sorteia pelada </Text>
        
        <Pressable 
        style={styles.main_button}
        onPress={ () => {
          nav.navigate('CreatePlayer', {});
        } }> 
          <Text> Cadastrar jogador. </Text>
        </Pressable>
        
        <Pressable 
        style={styles.main_button}
        onPress={ () => {
          nav.navigate('RaffleSquad', {});
        } }> 
          <Text> Sortear. </Text>
        </Pressable>
        
        <Pressable 
        style={styles.main_button}
        onPress={ () => {
          nav.navigate('AlterPlayer', {});
        } }> 
          <Text> Alterar jogador. </Text>
        </Pressable>

        <Pressable
        onPress={displayPlayers}>
          <Text style={{backgroundColor: '#fff', fontWeight: 'bold'}}> PRESS TO DISPLAY ALL PLAYERS </Text>
        </Pressable>

        <Pressable
        onPress={delAllPlayers}>
          <Text style={{backgroundColor: '#fff', fontWeight: 'bold', marginTop: 20}}> PRESS TO DELETE ALL PLAYERS </Text>
        </Pressable>

      </View>
    </ImageBackground>
  );
}

export default function App() {
  try {
    return (
    <NavigationContainer>
      <Stack.Navigator>

        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={ {title: 'Tela Inicial'} }
        />

        <Stack.Screen
          name="CreatePlayer"
          component={CreatePlayerScreen}
          options={ {title: 'Tela de criação de jogador'} }
        />

        <Stack.Screen
          name="RaffleSquad"
          component={DefineSquadScreen}
          options={ {title: 'Tela de sorteio de times'} }
        />

        <Stack.Screen
          name="AlterPlayer"
          component={AlterPlayerScreen}
          options={ {title: 'Tela de alteração de jogador.'} }
        />

      </Stack.Navigator>
    </NavigationContainer>);
  }

  catch(error) {
    return (<NotDefinedScreen></NotDefinedScreen>);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', alignItems: 'center',
  },

  main_title: {
    position: 'absolute',
    
    left: 20, top: 150,

    width: 'auto',
    fontSize: 40,
    marginBottom: 40,
  },

  main_button: {
    margin: 10, padding: 5,
    backgroundColor: '#4ec',
    alignItems: 'center', justifyContent: 'center',
    borderRadius: 10,
  },

  backImg: {
    width: '100%', height: '100%',
  }
});
