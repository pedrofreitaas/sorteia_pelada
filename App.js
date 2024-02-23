import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import {NotDefinedScreen} from './screens/ErrorScreen.js'
import {AlterPlayerScreen} from './screens/AlterPlayer.js'
import {Squads} from './screens/DefineSquad.js'
import {CreatePlayerScreen} from './screens/CreatePlayer.js';
import {Players} from './screens/DisplayPlayers.js';

import {BannerAdReady} from './extra_modules/Ads.js';

import { ImageBackground, Text, View, StyleSheet, Pressable } from 'react-native';

import { FontAwesome } from '@expo/vector-icons';

import { RealmProvider } from './extra_modules/RealmScheme';

import { GluestackUIProvider, config } from "@gluestack-ui/themed"
 
const Stack = createNativeStackNavigator(); 

const MainScreenButton = ( {icon, text, nav, destinyScreenStr} ) => {
  return (
    <Pressable 
      style={styles.main_button}
      onPress={ () => {
      nav.navigate(destinyScreenStr, {});
      } }>

        {icon}

        <Text
        style={styles.main_button_text}> 
          {text} 
        </Text>

    </Pressable>
  )
}

const MainScreen = ( {navigation, route} ) => {
  const backImg = require('./assets/imgs/soccer_field.jpg');

  const nav = useNavigation();

  return (
    <ImageBackground source={backImg} style={styles.backImg}>
      <View
      style={styles.title_view}>
        <Text style={styles.main_title}> Sorteia pelada </Text>
        <FontAwesome name="soccer-ball-o" size={30} color="rgba(0,0,0,.7)"/>
      </View>
      
      <View style={styles.container}>

        <MainScreenButton
          nav={nav}
          destinyScreenStr="CreatePlayer"
          icon={<FontAwesome name="user" size={20} color="rgba(0,0,0,.7)"/>}
          text="Cadastrar jogador"
        />

        <MainScreenButton
          nav={nav}
          destinyScreenStr="Squads"
          icon={<FontAwesome name="group" size={20} color="rgba(0,0,0,.7)"/>}
          text="Sortear"
        />

        <MainScreenButton
          nav={nav}
          destinyScreenStr="DisplayPlayers"
          icon={<FontAwesome name="edit" size={20} color="rgba(0,0,0,.7)"/>}
          text="Alterar jogador"
        />

      </View>

      <BannerAdReady props={{
        style: {alignSelf: 'center'}
      }}/>
    </ImageBackground>
  );
}

export default function App() {
  try {
    return (
      <GluestackUIProvider config={config.theme}>
        <RealmProvider>
          <NavigationContainer>
            <Stack.Navigator>

              <Stack.Screen
                name="Main"
                component={MainScreen}
                options={ {
                  title: 'Tela Inicial'
                } }
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
                options={ {
                  title: 'Escolha de jogador.'
                } }/>

              <Stack.Screen
                name="AlterPlayer"
                component={AlterPlayerScreen}
                options={ {title: 'Alteração de jogador.'} }/>

            </Stack.Navigator>
          </NavigationContainer>
        </RealmProvider>
      </GluestackUIProvider>);
  }

  catch(error) {
    return (<NotDefinedScreen></NotDefinedScreen>);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', alignItems: 'flex-start',
  },

  title_view: {
    alignItems: 'center',
  },

  main_title: {
    marginTop: 60, marginBottom: 10,
    fontSize: 40, fontWeight: 'bold',
  },

  main_button: {
    margin: 25, padding: 10, marginLeft: 30,
    backgroundColor: 'rgba(255,255,255, .8)', 

    borderWidth: 3, borderColor: 'rgba(0,0,0,.4)', borderRadius: 20,

    alignItems: 'center', justifyContent: 'center',

    flexDirection: 'row',
  },

  main_button_text: {
    marginLeft: 5,
    fontSize: 20, fontWeight: 'bold',
  },

  backImg: {
    flex: 1,
  }
});
