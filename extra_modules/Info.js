import { useState } from "react";
import { View, Image, FlatList, Text, StyleSheet, Pressable } from "react-native";

export const Info = ( {props} ) => {
    const giveInfo = () => {
        setRenderInfo(!renderInfo);
    };

    const [renderInfo, setRenderInfo] = useState(false);
    
    return (
        <View style={styles.info_pressable}> 
            <Pressable onPress={giveInfo}> 
                <Image source={require('../assets/imgs/info.png')} />
            </Pressable>

            {renderInfo &&
            <View>
                <FlatList
                data={props.info}
                renderItem={({ item }) => (
                    <Text style={styles.info_text}>{item}</Text>
                )}
                keyExtractor={item => item}
                style={styles.infos}
                />
            </View>}
        </View>
    );
}

const styles = StyleSheet.create( {
    info_pressable: {
        backgroundColor: '#fffff1',

        maxWidth: '95%',

        position: 'absolute', right: '3%', top: '3%',

        borderRadius: 10,
        borderColor: '#004',

        borderStartWidth: 5,

        zIndex: 1,
    },

    infos: {
        padding: 10,
        height: 280,
    },

    info_text: {
        fontSize: 15,
        marginVertical: 3,
        textAlign: 'justify',
    },
} );