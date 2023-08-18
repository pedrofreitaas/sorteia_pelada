import { StyleSheet, View, Text } from "react-native";

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import { useNavigation } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

export const AdScreen = ( {navigation, route} ) => {
    return (
        <View
        style={styles.container}>
            <Text style={styles.main_text}> TELA DE ADD </Text>
        </View>
    );
}

const styles = StyleSheet.create( {
    container: {
        flex: 1,
    },

    main_text: {
        top: '50%',
    }
} );