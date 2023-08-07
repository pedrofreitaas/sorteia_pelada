import { Text, View, Pressable, ImageBackground, StyleSheet } from 'react-native';
import {AlterPlayerScreen} from './AlterPlayer'
import {DefineSquadScreen} from './DefineSquad'
import {CreatePlayerScreen} from './CreatePlayer'
import {ScreenIDs} from '../extra_modules/ScreenIDs';
import * as screens_map from './screens_map.json'
import { delAllPlayers, displayPlayers } from '../extra_modules/DataStorage';

function DefaultScreen( {nav} ) {
    const backImg = require('../assets/imgs/soccer_field.jpg');

    return (
        <ImageBackground source={backImg} style={styles.backImg}>
            <View style={styles.container}>
                <Text style={styles.main_title}> Sorteia pelada </Text>
                
                <Pressable 
                style={styles.main_button}
                onPress={ () => {
                    nav.currID = 1;
                } }> 
                    <Text> Cadastrar jogador. </Text>
                </Pressable>
                
                <Pressable 
                style={styles.main_button}
                onPress={ () => {
                    nav.currID = 2;
                } }> 
                    <Text> Sortear. </Text>
                </Pressable>
                
                <Pressable 
                style={styles.main_button}
                onPress={ () => {
                    nav.currID = 3;
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

export function MainScreen() {
    const Navigator = new ScreenIDs();

    switch(Navigator.currID) {
        case screens_map.createPlayerScreen.id:
            return ( <CreatePlayerScreen nav={Navigator}/> );

        case screens_map.DefineSquadScreen.id:
            return (<DefineSquadScreen nav={Navigator}/>);

        case screens_map.AlterPlayerScreen.id:
            return (<AlterPlayerScreen nav={Navigator}/>);

        default:
            return (<DefaultScreen nav={Navigator}/>);
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
  