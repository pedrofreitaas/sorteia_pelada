import {useState} from 'react';
import {Text, StyleSheet, View, Image, TextInput, Pressable, ImageBackground} from "react-native";
import {Slider} from '@miblanchard/react-native-slider';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {OptionsContainer} from '../extra_modules/OptionsContainer';
import {PlayerAlreadyExists, SavedPlayerWithGenericImage, changePlayer, delPlayer} from '../extra_modules/DataStorage';
import { useNavigation } from '@react-navigation/native';

import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { Info } from '../extra_modules/Info';

const Stack = createNativeStackNavigator();

export const AlterPlayerScreen = ( {navigation, route} ) => {
    const [name, setName] = useState(route.params.name);
    const [pos, setPos] = useState(route.params.pos);
    const [rating, setRating] = useState(route.params.rating);
    const [imgURI, setImgURI] = useState(route.params.imgURI);
    const [available, setAvailable] = useState(route.params.available);

    const nav = useNavigation();

    const setPlayerImg = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.image,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) setImgURI(result.assets[0].uri);
    };

    const deletePlayer = async () => {
        try {
            await delPlayer(route.params.id);
            alert('Jogador deletado com sucesso.');
            nav.goBack();
        } catch (err) {
            alert(err);
        }
    };

    const submit = async () => {
        try {
            await changePlayer(route.params.id, name, rating, pos, imgURI, available);
            alert('Jogador alterado com sucesso.');
            nav.goBack();
        } catch (err) {
            if(err instanceof PlayerAlreadyExists)
                alert('Jogador com mesmo nome já existe no sistema.');
            else if (err instanceof SavedPlayerWithGenericImage)
                alert('Jogador foi salvo com imagem genérica.');
            else 
                alert('Jogador não foi alterado por erro inesperado: ' + err);
        }
    };

    return (
        <ImageBackground 
        source={require("../assets/imgs/lockerroom.jpg")}
        style={styles.background}>
            <Info props={{
                info: ["Essa é a tela de edição de jogador.",
                       "Pressione o (X) vermelho para deletar o jogador imediatamente.",
                       "Pressione a imagem para alterar a imagem do jogador.",
                       "Pressione o ícone abaixo da imagem para tornar o jogador disponível/indisponível para sorteio.",
                       "Altere os outros campos da maneira que preferir.",
                       "Quando terminar, clique em Finalizar para alterar o jogador.",
                ],
            }}/>

            <View
            style={styles.container}>

                <Pressable
                style={styles.delete_button}
                onPress={() => deletePlayer(name)}>
                    <MaterialIcons name="cancel" size={45} color={"rgba(220,20,0,.99)"} />
                </Pressable>

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

    delete_button: {
        alignSelf: 'flex-end', marginRight: 30,
    },

    player_img: {
        marginBottom: 20,

        width: 130, height: 130,

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