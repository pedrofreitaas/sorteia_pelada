import { useState } from "react";
import { View, Image, TextInput, StyleSheet, ImageBackground, Pressable } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Heading, Slider, SliderThumb, SliderTrack, SliderFilledTrack, VStack, Button, ButtonText } from '@gluestack-ui/themed';

import { FontAwesome } from '@expo/vector-icons';
import { OptionsContainer } from "../extra_modules/OptionsContainer";

import { Info } from "../extra_modules/Info";

import * as config from "../config.json";

import {BannerAdReady} from '../extra_modules/Ads';

import Realm from "realm";
import * as RealmScheme from '../extra_modules/RealmScheme';

import 'react-native-get-random-values';

class SavedPlayerWithGenericImage extends Error {
    constructor() {
        super('Player was saved with generic image.');
    }
}; 

const Form = ( {props} ) => {
    const [name, setName] = useState(undefined);
    const [rating, setRating] = useState(false);
    const [pos, setPos] = useState(undefined);

    const question_mark = require('../assets/imgs/question_mark.jpg');
    const [image, setImage] = useState("");

    const realm = RealmScheme.useRealm();

    const setPlayerImg = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.image,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) setImage(result.assets[0].uri);
    };
   
    const savePlayer = () => {
        realm.write(() => realm.create('Player', {
            _id: new Realm.BSON.ObjectId(),
            name: name, rating: rating, pos: pos, imgURI: image, available: true,
            presences: 0, gols: 0, assists: 0,
        }) );

        if(image === "")
            throw new SavedPlayerWithGenericImage();
    };

    const submit = async () => {
        if(name===null || rating===false || pos === undefined){
            alert('Faltam campos a serem preenchidos. Consulte o ícone acima para mais informações.')
            return;
        }
        
        try {
            savePlayer();
            alert('Jogador foi salvo no sistema.');
        } catch (err) {
            if (err instanceof SavedPlayerWithGenericImage)
                alert('Jogador salvo com imagem genérica.');
            else
                alert(err);
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

                <VStack w={260} h={50} style={styles.slider_component}>
                    <Heading size="g" color='rgba(0,0,0,.72)' textAlign='left'> Nota {Number(rating).toFixed(2)} </Heading>
                    
                    <Slider
                        style={styles.slider}
                        step={.25}
                        value={rating}
                        onChange={ (e)=> {setRating(e)} }
                        minValue={0} maxValue={5}
                        defaultValue={50}
                        size="xl"
                        orientation="horizontal"
                        isDisabled={false}
                        isReversed={false}
                    >
                        <SliderTrack>
                            <SliderFilledTrack bg="$amber500"/>
                        </SliderTrack>

                        <SliderThumb
                        bg="$transparent">
                            <FontAwesome name="star" size={40} color="yellow"/>
                        </SliderThumb>
                    </Slider>
                </VStack>

                <Button
                    style={styles.submit_button}
                    onPress={() => submit()}
                    size="md"
                    variant="solid"
                    action="primary"
                    isDisabled={false}
                    isFocusVisible={false}>
                    <ButtonText>Confirmar </ButtonText>
                    <FontAwesome name="check" size={25} color="white"/>
                </Button>

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

export const CreatePlayerScreen = ( {navigation, route} ) => {
    const backImg = require('../assets/imgs/create_player_backg.jpg');

    return (
        <ImageBackground
        source={backImg}
        style={styles.container}>
            <Info 
            props={{
                title: "Criação de jogador.",
                info: 
`Clique na interrogação para escolher uma imagem para representar o jogador.
Você pode não escolher nenhuma imagem para usar uma imagem genérica.
Preencha o nome do respectivo jogador.
Selecione a posição do jogador.
Posição LINHA: jogador que joga em todas as posições exceto goleiro.
Posição CORINGA: jogador LINHA que também joga como goleiro.
Dê uma nota de 0 a 5 para o jogador movendo a estrela. Quanto mais a direita maior a nota.
Por fim, crie o jogador com o botão Criar.`
            }}/>
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
        marginTop: 40,
        alignSelf: 'flex-end',

        backgroundColor: 'rgba(50, 120, 220, .90)',
        alignItems: "center",
    },

    slider: {
        width: 260,
        margin: 10,
    },

    slider_component: {
        marginVertical: 15,
        padding: 5
    }
});