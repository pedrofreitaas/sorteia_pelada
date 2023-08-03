import { useState } from "react";
import { View, Image, FlatList, Text, TextInput, StyleSheet, ImageBackground, Pressable } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import {Slider} from '@miblanchard/react-native-slider';
import * as SecureStore from 'expo-secure-store';

const key = 'players';

const savePlayer = async ( name, rating, imgURI ) => {
    let players = await SecureStore.getItemAsync(key);

    players = JSON.parse(players);

    if(players === null)
        players = {}

    if(players[name] !== undefined) {
        alert('Jogador já existe no sistema.')
        return;
    }

    players[name] = {
        rating: rating,
        imgURI: imgURI,
    };

    players = JSON.stringify(players);

    await SecureStore.setItemAsync(key, players);

    alert('Jogador cadastrado com sucesso.');
}

function Form ( props ) {
    const [name, setName] = useState(undefined);
    const [rating, setRating] = useState(undefined);

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
        if(name===null || rating===null || image === undefined ){
            alert('Faltam campos a serem preenchidos. Consulte o ícone acima para mais informações.')
            return;
        }   
        
        await savePlayer(name, rating[0], image);
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

                <Text style={styles.rating_text}> Nota </Text>
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
        </View>
    );
}

function Info ( props ) {
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
            data={
            ["Clique na interrogação para escolher uma imagem para representar o jogador.",
             "Preencha o nome do respectivo jogador.",
             "Dê uma nota de 0 a 5 para o jogador movendo a estrela. Quanto mais a direita maior a nota.",
             "Por fim, crie o jogador com o botão Criar."
            ]}
            renderItem={({ item }) => (
                <Text style={styles.text}>{item}</Text>
            )}
            keyExtractor={item => item}
            style={styles.infos}
            />
        </View>}

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
            <Info/>
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

    info_pressable: {
        backgroundColor: '#fffff1',

        maxWidth: '95%',

        position: 'absolute', right: '3%', top: '3%',

        borderRadius: 10,
        borderColor: '#004',

        borderStartWidth: 5,
    },

    infos: {
        padding: 10,
        
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
} );