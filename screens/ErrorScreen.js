import { View, Text, StyleSheet } from 'react-native';

export function NotDefinedScreen(){
    return (
        <View style={styles.main}>
            <Text> Error, reached not defined screen. </Text>
        </View>
    );
}

const styles = StyleSheet.create( {
    main: {
        width: '100%', height: '100%',

        justifyContent: 'center',
        alignItems: 'center',
    }
});