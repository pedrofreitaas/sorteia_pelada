import { useEffect, useState } from 'react';
import { Text, StyleSheet, View, ImageBackground, FlatList, Image, TextInput, Pressable } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

import { getPlayers, getPlayer } from "../extra_modules/DataStorage";

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

function Player( {name} ) {
    const [player, setPlayer] = useState();

    const nav = useNavigation();

    useEffect( () => {
        const fetchData = async () => {
            const data = await getPlayer(name);
            setPlayer(data);
        };
        
        if (player === undefined) fetchData();
    }, []);

    if(player === undefined) return (<Text>Loading...</Text>);

    return (
        <Pressable 
        style={styles.player}
        onPress={ () => nav.navigate('Alter', {name, player}) }>
            <Image
            style={styles.player_img}
            source={ {uri: player.imgURI} }/>

            <Text style={styles.player_text}>
                {player.pos}{'\n'}{name}
            </Text>
        </Pressable>
    );
};

export function Players( {props} ) {
    const [playerNames, setPlayerNames] = useState();
    const [searchPlayer, setSearchPlayer] = useState('');

    useEffect( () => {
        const _getPlayers = async () => {
            const value = await getPlayers();
            const names = Object.entries(value).map( (item) => item[0] );
            
            if(searchPlayer === '') 
                setPlayerNames(names);
            
            else{
                const filteredNames = names.filter( (name) => name.slice(0, searchPlayer.length).toLowerCase() === searchPlayer.toLowerCase());
                setPlayerNames(filteredNames);
            }
        };
    
        _getPlayers();

    }, [searchPlayer]);

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

    players_view: {
        flex: 1, margin: '10%',
        alignItems: 'center', justifyContent: 'center',

        width: '81%',

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

    player: {
        margin: 5, padding: 5,
        backgroundColor: '#fff',

        borderRadius: 5,

        width: '27%', height: 80,

        alignItems: 'center',
    },

    player_img: {
        width: 30, height: 30,
        borderRadius: 30,
    },

    player_text: {
        margin: 3,
        fontSize: 10,
        textAlign: 'center',
    },

    go_back_button: {
        margin: '10%',
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#fff', 
        width: 40, height: 40, 
        padding: 3, 
        borderRadius: 10,
    },

} );