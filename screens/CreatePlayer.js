import { useState } from "react";
import { View, Image, Text, TextInput, StyleSheet, ImageBackground, Pressable } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import Slider from '@react-native-community/slider';

function Form ( props ) {
    const [name, setName] = useState("Nome");
    const [rating, setRating] = useState(0);

    const question_mark = require('../assets/imgs/question_mark.jpg');
    const [image, setImage] = useState();

    const setPlayerImg = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.image,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) setImage(result.assets[0].uri);
    }

    const submit = () => {
        const submission = {
            name: name, rating: rating, image: image,
        }

        console.log('trying to submit with: ', submission);
    }

    return (
        <View styles={styles.full_form}>
            <Pressable onPress={setPlayerImg}>
                {image && <Image source={{uri: image}} style={styles.player_img} opacity={1}/> || <Image source={question_mark} style={styles.player_img}/>}
            </Pressable>

            <View style={styles.form}>
                <TextInput 
                name="nome" placeholder={name} style={styles.input}
                value={name}
                onChangeText={setName}></TextInput>

                <Slider
                trackStyle={ {height: 50} }

                value={rating} onValueChange={setRating}
                minimumValue={0} maximumValue={5}

                // minimumTrackTintColor="rgba(255, 255, 0, .9)"
                // maximumTrackTintColor="rgba(0, 0, 0, 1)"
                />

                <Pressable onPress={submit} style={styles.submit_button}>
                    <Text> Criar </Text>
                </Pressable>

            </View>
        </View>
    );
}

export function CreatePlayerScreen( {nav} ) {
    const backImg = require('../assets/imgs/create_player_backg.jpg');

    nav.goBackHardwareEventTrigger();

    return (
        <ImageBackground
        source={backImg}
        style={styles.container}>
            <Form/>
        </ImageBackground>
    );
}

const styles = StyleSheet.create( {
    container: {
        width: '100%', height: '100%',

        flex: 1,
        alignItems: 'center', justifyContent: 'center',
    },

    form: {
        width: '80%', height: 'fit-content',

        backgroundColor: 'rgba(255, 255, 255, .35)',
        padding: 15,

        borderRadius: 10,

        alignSelf: 'center',
    },

    full_form: {
        flex: 1, flexDirection: 'column',
    },

    player_img: {
        width: 200, height: 200,
        alignSelf: 'center',

        borderRadius: 300,
        marginBottom: 20,

        opacity: .7,
    },

    input: {
        marginBottom: 20,
        width: 200,

        fontWeight: 'bold',
    },

    submit_button: {
        width: 60,
        padding: 10,

        alignSelf: 'flex-end',

        backgroundColor: 'rgba(50, 120, 220, .90)',
        alignItems: "center",
        borderRadius: 10
    },

} );