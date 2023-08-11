import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

import { getPlayer, isUpToDate } from "../extra_modules/DataStorage";

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { NativeEventEmitter } from 'react-native';
const evHandler = new NativeEventEmitter();

export const Player = ( {name} ) => {
    const [player, setPlayer] = useState();

    const nav = useNavigation();
    
    useEffect( () => {
        const fetchData = async () => {
            const data = await getPlayer(name);
            const player = data.result;

            setPlayer(player);
        };
        
        if (player === undefined) {
            fetchData();
            evHandler.addListener( 'updated_DB', async ()=> await fetchData() );
        }

    }, [player]);

    if(player === undefined) return <Text>Loading...</Text>

    return (
        <Pressable 
        style={styles.player}
        onPress={ () => nav.navigate('AlterPlayer', Object.assign({name}, player) ) }>

            <View>
                <Image
                style={styles.img}
                source={ (player.imgURI !== undefined) ? {uri: player.imgURI} : require('../assets/imgs/generic_player.jpg') }/>

                <View style={ player.available ? styles.available : styles.unavailable }></View>
            </View>

            <View
            style={styles.rating}>
                <MaterialIcons
                    name="star" size={20} color="rgba(200,200,0,.8)" />
                <Text> {Number(player.rating).toFixed(2)} </Text>
            </View>

            <Text style={styles.text}>
                {player.pos}{'\n'}{name}
            </Text>
        </Pressable>
    );
};

const styles = StyleSheet.create( {
    player: {
        margin: 5, padding: 5,
        backgroundColor: '#fff',

        borderRadius: 5,

        alignItems: 'center',
    },

    img: {
        width: 30, height: 30,
        borderRadius: 30,

        left: '5%',
    },

    available: {
        position: 'absolute', left: '-5%',
        width: 15, height: 15,
        backgroundColor: 'rgba(0, 200, 0, .9)', borderRadius: 15,
    },

    unavailable: {
        position: 'absolute', left: '0%', top: '0%',
        width: 15, height: 15,
        backgroundColor: 'rgba(200, 0, 0, .9)', borderRadius: 15,
    },

    rating: {
        flexDirection: 'row',
    },

    text: {
        margin: 3,
        fontSize: 10,
        textAlign: 'center',
    },
} );