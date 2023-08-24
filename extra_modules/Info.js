import { useState } from "react";
import { View, Image, FlatList, Text, StyleSheet, Pressable } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

export const Info = ( {props} ) => {
    const giveInfo = () => {
        setRenderInfo(!renderInfo);
    };

    const [renderInfo, setRenderInfo] = useState(false);
    
    return (
        <View style={styles.info_pressable}> 

            {renderInfo ?
            
            <View>
                <FlatList
                showsVerticalScrollIndicator={true}
                ListHeaderComponent={
                    <Pressable
                    onPress={() => setRenderInfo(false)}>
                        <MaterialIcons 
                        style={{margin: 10, alignSelf: 'center'}}
                        name="cancel" size={25} color={"rgba(220,20,0,.99)"} />
                    </Pressable>
                }
                data={props.info}
                renderItem={({ item }) => (
                    <Text style={styles.info_text}>{item}</Text>
                )}
                keyExtractor={item => item}
                style={styles.infos}
                />
            </View>

            :

            <Pressable onPress={giveInfo}> 
                <Image source={require('../assets/imgs/info.png')} />
            </Pressable>}
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
        paddingHorizontal: 10,
        height: 170,
    },

    info_text: {
        fontSize: 15,
        marginVertical: 5,
        textAlign: 'justify',
        fontWeight: 'bold',
    },
} );