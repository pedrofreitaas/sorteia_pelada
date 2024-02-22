import { useEffect, useState } from 'react';
import { Text, StyleSheet, View, ImageBackground, FlatList, TextInput, Pressable } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import {Player} from './Player';

import { Info } from '../extra_modules/Info';

import {BannerAdReady} from '../extra_modules/Ads';

import * as RealmScheme from '../extra_modules/RealmScheme';

export const Players = ( {navigation, route} ) => {
    const [players, setPlayers] = useState(RealmScheme.useQuery(RealmScheme.Player));
    const [search, setSearch] = useState("");

    const nav = useNavigation();

    const updateSearch = (name) => {
        setPlayers( players.filter( (pl) => pl.name.slice(0, name.length).toLowerCase() === name.toLowerCase()) );
    };

    useEffect( () => {
        players.addListener( (changes) => {
            setPlayers(changes);
        });

        return () => {
            players.removeAllListeners();
        };
        
    }, []);

    useEffect( () => {    
        updateSearch(search);
    }, [search]);

    return (
        <ImageBackground
        source={require('../assets/imgs/lockerroom.jpg')}
        style={styles.container}>
            <View style={styles.players_view}>

                <View
                style={styles.search_bar_view}>  
                    <TextInput
                    style={styles.search_bar} 
                    placeholder='Pesquise por jogador'
                    value={search}
                    onChangeText={ (newText) => {setSearch(newText)} }/>

                    <MaterialIcons name="search" size={30} color="rgba(0,0,0,1)" />
                </View>

                <FlatList
                horizontal={false} numColumns={3}
                data={players}
                renderItem={ (data) => <Player playerInfo={data.item}/> }/>
            </View>
            
            <BannerAdReady props={{
                style: {alignSelf: 'center'}
            }}/>

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

        marginLeft: 20, marginRight: 70,

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