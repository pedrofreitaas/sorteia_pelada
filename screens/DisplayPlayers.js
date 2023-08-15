import { useEffect, useState } from 'react';
import { Text, StyleSheet, View, ImageBackground, FlatList, TextInput, Pressable } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

import { getPlayers } from "../extra_modules/DataStorage";

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import {Player} from './Player';

export function Players( {navigation, route} ) {
    const [playerNames, setPlayerNames] = useState();
    const [searchPlayer, setSearchPlayer] = useState('');

    const nav = useNavigation();

    useEffect( () => {    
        const _getPlayers = async () => {
            const data = await getPlayers();
            const players = data.result;
    
            const names = Object.entries(players).map( (item) => item[0] );
            
            if(searchPlayer === '') 
                setPlayerNames(names);
            
            else{
                const filteredNames = names.filter( (name) => name.slice(0, searchPlayer.length).toLowerCase() === searchPlayer.toLowerCase());
                setPlayerNames(filteredNames);
            }
        };

        if(playerNames === undefined) {
            _getPlayers();
        }

    }, [searchPlayer]);

    return (
        <ImageBackground
        source={require('../assets/imgs/lockerroom.jpg')}
        style={styles.container}>
            <View style={styles.players_view}>

                {route.params.sortButton===true 
                ? <Pressable
                style={styles.raffle_button}
                onPress={ () => nav.navigate('Squads', {}) }>
                    <Text>Sortear</Text>
                </Pressable> 
                : <View></View>}

                <View
                style={styles.search_bar_view}>  
                    <TextInput
                    style={styles.search_bar} 
                    placeholder='Pesquise por jogador'
                    value={searchPlayer}
                    onChangeText={ (newText) => {setSearchPlayer(newText)} }/>

                    <MaterialIcons
                    name="search" size={30} color="rgba(0,0,0,1)" />
                </View>

                <FlatList
                horizontal={false} numColumns={3}
                data={playerNames}
                renderItem={ (data) => <Player name={data.item}/> }/>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create( {
    container: {
        flex: 1,
    },

    raffle_button: {
        backgroundColor: '#fff',
        alignItems: 'center', justifyContent: 'center',
        width: 80, height: 35,
        borderRadius: 10,

        borderWidth: 2, borderColor: '#eff',

        marginLeft: 20, marginRight: 10,

        alignSelf: 'flex-end',

        borderWidth: 3, borderColor: 'rgba(0,0,0, .99)',
    },

    players_view: {
        flex: 1, margin: '10%',
        justifyContent: 'center',

        alignSelf: 'center',
    },

    search_bar_view: {
        backgroundColor: 'rgba(255,255,255,.91)', marginVertical: 20, padding: 10,

        flexDirection: 'row',

        borderWidth: 6, borderColor: 'rgba(0,0,0,.3)', borderRadius: 30,
    },

    search_bar: {
        width: '80%', marginHorizontal: 10, alignSelf: 'center',
    },

} );