import { Text, StyleSheet, View } from "react-native";

export function AlterPlayerScreen( {nav} ) {
    nav.goBackHardwareEventTrigger();

    return (
        <View
        style={styles.container}>
            <Text
            style={styles.text}> 
            THIS SCREEN IS FOR PLAYER ALTER
            </Text>
        </View>
    );
}

const styles = StyleSheet.create( {
    container: {
        flex: 1,
        justifyContent: 'center', alignItems: 'center',
    },

    text: {
        justifyContent: 'center', alignItems: 'center',
    }
} );