import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { NativeEventEmitter } from 'react-native';
const evHandler = new NativeEventEmitter();

export const Player = ( {playerInfo} ) => {
    const nav = useNavigation();

    useEffect( () => {}, []);

    return (
        <Pressable 
        style={styles.player}
        onPress={ () => nav.navigate('AlterPlayer', playerInfo) }>

            <View>
                <Image
                style={styles.img}
                source={ (playerInfo.imgURI !== "") ? {uri: playerInfo.imgURI} : require('../assets/imgs/generic_player.jpg') }/>

                <View style={ playerInfo.available ? styles.available : styles.unavailable }></View>
            </View>

            <View
            style={styles.rating}>
                <MaterialIcons
                    name="star" size={20} color="rgba(200,200,0,.8)" />
                <Text> {Number(playerInfo.rating).toFixed(2)} </Text>
            </View>

            <Text style={styles.text}>
                {playerInfo.pos}{'\n'}{playerInfo.name}
            </Text>
        </Pressable>
    );
};

const styles = StyleSheet.create( {
    player: {
        width: '27%',

        margin: 5, padding: 5,
        backgroundColor: 'rgba(255,255,255, .7)',

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
        fontSize: 10, fontWeight: 'bold',
        textAlign: 'center',
    },
});