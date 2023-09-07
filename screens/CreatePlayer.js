import { useState } from "react";
import { View, Image, Text, TextInput, StyleSheet, ImageBackground, Pressable } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import {Slider} from '@miblanchard/react-native-slider';
import {PlayerAlreadyExists, SavedPlayerWithGenericImage, savePlayer} from '../extra_modules/DataStorage'
import { OptionsContainer } from "../extra_modules/OptionsContainer";

import { Info } from "../extra_modules/Info";

import * as config from "../config.json";

import {BannerAdReady} from '../extra_modules/Ads';

import {useRealm, useQuery, Player} from '../extra_modules/RealmScheme';

function Form ( props ) {
    const [name, setName] = useState(undefined);
    const [rating, setRating] = useState(false);
    const [pos, setPos] = useState(undefined);

    const question_mark = require('../assets/imgs/question_mark.jpg');
    const [image, setImage] = useState(undefined);

    const setPlayerImg = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.image,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) setImage(result.assets[0].uri);
    };

    const submit = async () => {
        if(name===null || rating===false || pos === undefined){
            alert('Faltam campos a serem preenchidos. Consulte o ícone acima para mais informações.')
            return;
        }
        
        try {
            await savePlayer(name, rating[0], pos, image);
            alert('Jogador foi salvo no sistema.');
        } catch (err) {
            if (err instanceof SavedPlayerWithGenericImage)
                alert('Jogador salvo com imagem genérica.');
            if (err instanceof PlayerAlreadyExists)
                alert('Jogador não foi salvo, pois jogador com mesmo nome já existe no sistema.');
        }
    };

    return (
        <View styles={styles.full_form}>
            <Pressable onPress={setPlayerImg}>
                {image && <Image source={{uri: image}} style={styles.player_img} opacity={1}/> || <Image source={question_mark} style={styles.player_img}/>}
            </Pressable>

            <View style={styles.form}>
                <TextInput 
                name="nome" placeholder={"Nome"} style={styles.input}
                value={name}
                onChangeText={setName}></TextInput>

                <OptionsContainer
                props={ {
                    options: config.availablePOS,
                    setValue: (value) => setPos(value) 
                } }/>

                <Text style={styles.rating_text}> Nota: {Number(rating).toFixed(2)} </Text>
                <Slider
                value={rating} onValueChange={setRating}
                minimumValue={0} maximumValue={5}

                trackStyle={styles.track}

                minimumTrackTintColor="rgba(255, 255, 0, .88)"

                thumbStyle={styles.thumb}
                thumbImage={require('../assets/imgs/star.png')}
                />

                <Pressable onPress={submit} style={styles.submit_button}>
                    <Text> Criar </Text>
                </Pressable>

            </View>

            <BannerAdReady props={{
                style: {
                    alignSelf: 'center',
                    marginTop: 100,
                }
            }}/>
        </View>
    );
};

export function CreatePlayerScreen( {navigation, route} ) {
    const backImg = require('../assets/imgs/create_player_backg.jpg');

    return (
        <ImageBackground
        source={backImg}
        style={styles.container}>
            <Info 
            props={{info: [
                "Clique na interrogação para escolher uma imagem para representar o jogador.",
                "Você pode não escolher nenhuma imagem para usar uma imagem genérica.",
                "Preencha o nome do respectivo jogador.",
                "Selecione a posição do jogador.",
                "Posição LINHA: jogador que joga em todas as posições exceto goleiro.",
                "Posição CORINGA: jogador LINHA que também joga como goleiro.",
                "Dê uma nota de 0 a 5 para o jogador movendo a estrela. Quanto mais a direita maior a nota.",
                "Por fim, crie o jogador com o botão Criar."
            ]}}/>
            <Form/>
        </ImageBackground>
    );
};

const styles = StyleSheet.create( {
    container: {
        width: '100%', height: '100%',

        flex: 1,
        alignItems: 'center', justifyContent: 'center',
    },

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
        height: 240, 
    },

    info_text: {
        fontSize: 15,
        marginVertical: 3,
        textAlign: 'justify',
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
        fontSize: 20,
    },

    submit_button: {
        width: 60,
        padding: 10,

        alignSelf: 'flex-end',

        backgroundColor: 'rgba(50, 120, 220, .90)',
        alignItems: "center",
        borderRadius: 10
    },

    rating_text: {
        fontSize: 20, fontWeight: 'bold',

        alignSelf: "center",
    },

    thumb: {
        width: 25, height: 25, borderRadius: 30,

        backgroundColor: 'transparent'
    },

    track: {
        height: 10,

        backgroundColor: "rgba(0, 0, 0, .55)",

        borderRadius: 10,
    }
});