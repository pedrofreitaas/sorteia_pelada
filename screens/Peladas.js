import { useState, useEffect } from "react";
import { Text, StyleSheet, View, Pressable, ImageBackground } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';

import * as gl from '@gluestack-ui/themed';

export const Peladas = ( {navigation, route} ) => {
    const nav = useNavigation();

    useEffect( () => {
    }, []);

    return (
        <View
        style={styles.container}>
            <Text> Tela de PELADAS. </Text>

            
            <gl.Input 
            variant="rounded" size="xl"
            style={styles.input}>
                <gl.InputField
                placeholder='Enter Text here'
                />
            </gl.Input>
        
        </View>
    );
}

const styles = StyleSheet.create( {
    container: {
        flex: 1,
    },

    input: {
    }
} );