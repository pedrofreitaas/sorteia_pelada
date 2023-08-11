import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import {NotDefinedScreen} from './screens/ErrorScreen.js'
import {AlterPlayerScreen} from './screens/AlterPlayer.js'
import {Squads} from './screens/DefineSquad'
import {CreatePlayerScreen} from './screens/CreatePlayer';
import {Players} from './screens/DisplayPlayers.js';

import { ImageBackground, Text, View, StyleSheet, Pressable } from 'react-native';

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
          nav.navigate('DisplayPlayers', {sortButton: true});
        } }> 
          <Text> Sortear. </Text>
        </Pressable>
        
        <Pressable 
        style={styles.main_button}
        onPress={ () => {
          nav.navigate('DisplayPlayers', {});
        } }> 
          <Text> Alterar jogador. </Text>
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
          options={ {title: 'Criação de jogador'} }
        />

        <Stack.Screen
          name="Squads"
          component={Squads}
          options={ {title: 'Sorteio de times'} }
        />

        <Stack.Screen
          name="DisplayPlayers"
          component={Players}
          options={ {title: 'Escolha de jogador.'} }/>

        <Stack.Screen
          name="AlterPlayer"
          component={AlterPlayerScreen}
          options={ {title: 'Alteração de jogador.'} }/>

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
