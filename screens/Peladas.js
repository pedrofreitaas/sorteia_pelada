import { useState, useEffect } from "react";
import { Text, StyleSheet, View, Pressable, ImageBackground } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';

export const Peladas = ( {navigation, route} ) => {
    const nav = useNavigation();

    useEffect( () => {
    }, []);

    return (
        <View
        style={styles.container}>
            <Text> Tela de PELADAS. </Text>
        </View>
    );
}

const styles = StyleSheet.create( {
    container: {
        flex: 1,
    }
} );