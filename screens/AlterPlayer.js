import {useState} from 'react';
import {Text, StyleSheet, View, Image, TextInput, Pressable, ImageBackground} from "react-native";
import {Slider} from '@miblanchard/react-native-slider';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {OptionsContainer} from '../extra_modules/OptionsContainer';
import {changePlayer} from '../extra_modules/DataStorage';
import { useNavigation } from '@react-navigation/native';

import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const Stack = createNativeStackNavigator();

export const AlterPlayerScreen = ( {nav, route} ) => {
    const [name, setName] = useState(route.params.name);
    const [pos, setPos] = useState(route.params.pos);
    const [rating, setRating] = useState(route.params.rating);
    const [imgURI, setImgURI] = useState(route.params.imgURI);
    const [available, setAvailable] = useState(route.params.available);

    const setPlayerImg = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.image,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) setImgURI(result.assets[0].uri);
    };

    const submit = async () => {
        const success = await changePlayer(route.params.name, name, rating, pos, imgURI, available);

        if(success) alert('Jogador alterado com sucesso.');
        else alert('Erro: Jogador não foi alterado.')
    };

    return (
        <ImageBackground 
        source={require("../assets/imgs/lockerroom.jpg")}
        style={styles.background}>

            <View
            style={styles.container}>
                <Pressable
                onPress={setPlayerImg}>
                    <Image
                    style={styles.player_img}
                    source={ imgURI === undefined ? require('../assets/imgs/generic_player.jpg') : {uri: imgURI} }/>
                </Pressable>

                <Pressable
                onPress={() => setAvailable(!available)}
                style={{alignSelf: 'flex-end'}}>
                    <MaterialIcons name="check-circle-outline" size={45} color={available ? "rgba(0,180,0,.99)" : "rgba(220,0,0,.99)"} />
                </Pressable>

                <View>
                    <View style={styles.player_name_input_view}>
                        <TextInput 
                        style={styles.player_name_input}
                        value={name}
                        onChangeText={setName}
                        placeholder={"Nome"}/>
                    </View>

                    <OptionsContainer
                    props={ {
                        options: ['GOL', 'ZAG', 'MEI', 'ATA'],
                        setValue: (value) => setPos(value),
                        selected: pos 
                    } }/>

                    <Text style={styles.rating_text}> Nota: {Number(rating).toFixed(2)} </Text>
                    <Slider
                    value={rating} onValueChange={ (e)=> {setRating(e[0])} }
                    minimumValue={0} maximumValue={5}

                    trackStyle={styles.track}

                    minimumTrackTintColor="rgba(255, 255, 0, .88)"

                    thumbStyle={styles.thumb}
                    thumbImage={require('../assets/imgs/star.png')}
                    />

                    <Pressable 
                    style={styles.submit_pressable}
                    onPress={submit}>
                        <Text style={styles.submit_text}> Finalizar. </Text>
                    </Pressable>
                </View>

            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create( {
    background: {
        flex: 1,
    },

    container: {
        flex: 1, margin: '10%', padding: '5%',

        backgroundColor: 'rgba(255,255,255, .4)',

        borderWidth: 5, borderColor: 'rgba(0,0,0,.3)', borderRadius: 100,
    },

    player_img: {
        marginVertical: 30,

        width: 150, height: 150,

        borderRadius: 90, borderWidth: 5, borderColor: 'rgba(0,0,0,.4)',

        alignSelf: 'center',
    },

    player_name_input_view: {
        margin: 5, padding: 5, marginVertical: 30,

        backgroundColor: '#fff',
        width: '80%',

        alignSelf: 'center',

        borderWidth: 1, borderColor: 'rgba(0,0,0,.4)', borderRadius: 5,
    },

    player_name_input: {
        alignSelf: 'center',
    },

    rating_text: {
        fontWeight: 'bold', fontSize: 20,
        alignSelf: 'center',

        marginVertical: 30,
    },

    thumb: {
        width: 25, height: 25, borderRadius: 30,

        backgroundColor: 'transparent'
    },

    track: {
        height: 10,

        backgroundColor: "rgba(0, 0, 0, .55)",

        borderRadius: 10,
    },

    submit_pressable: {
        backgroundColor: 'rgba(0,100, 255, .9)',
        padding: 5, borderRadius: 50,

        marginVertical: 30,

        alignSelf: 'flex-end',
    },

    submit_text: {
        fontSize: 20, fontWeight: 'bold',
    },
} );