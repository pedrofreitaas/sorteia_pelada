import {useState} from 'react';
import {Text, StyleSheet, View, Image, TextInput, Pressable, ImageBackground} from "react-native";

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {OptionsContainer} from '../extra_modules/OptionsContainer';
import { useNavigation } from '@react-navigation/native';

import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import * as config from '../config.json';

import { Info } from '../extra_modules/Info';

import * as RealmScheme from '../extra_modules/RealmScheme';
import {BSON} from "realm";

import { Switch, Heading, Slider, SliderThumb, SliderTrack, SliderFilledTrack, HStack, VStack } from '@gluestack-ui/themed';

import { FontAwesome } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();

export const AlterPlayerScreen = ( {navigation, route} ) => {
    const OBJid = new BSON.ObjectID(route.params._id.toHexString());
    const player = RealmScheme.useObject(RealmScheme.Player, OBJid);

    const [name, setName] = useState(player.name);
    const [pos, setPos] = useState(player.pos);
    const [rating, setRating] = useState(player.rating);
    const [imgURI, setImgURI] = useState(player.imgURI);
    const [available, setAvailable] = useState(player.available);

    const nav = useNavigation();

    const realm = RealmScheme.useRealm();

    const setPlayerImg = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.image,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) setImgURI(result.assets[0].uri);
    };

    const deletePlayer = () => {
        try {
            realm.write( () => realm.delete(player) );
            alert('Jogador deletado com sucesso.');
            nav.goBack();
        } catch (err) {
            alert(err);
        }
    };

    const updatePlayer = () => {
        try {
            if(player){
                realm.write( () => {
                    player.name = name;
                    player.pos = pos;
                    player.rating = rating;
                    player.imgURI = imgURI;
                    player.available = available;
                })
            }

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
                info: 
`Essa é a tela de edição de jogador.
Pressione o (X) vermelho para deletar o jogador imediatamente.
Pressione a imagem para alterar a imagem do jogador.
Pressione o ícone abaixo da imagem para tornar o jogador disponível/indisponível para sorteio.
Altere os outros campos da maneira que preferir.
A posição LINHA, refere-se ao jogador que pode jogar em qualquer posição, exceto goleiro.
A posição CORINGA, refere-se ao jogador que pode jogar em qualquer posição, incluindo goleiro.
Quando terminar, clique em Finalizar para alterar o jogador.`,
                title: 'Alteração de jogador.'
            }}/>

            <View
            style={styles.container}>

                <Pressable
                style={styles.delete_button}
                onPress={deletePlayer}>
                    <MaterialIcons name="cancel" size={45} color={"rgba(220,20,0,.99)"} />
                </Pressable>

                <Pressable
                onPress={setPlayerImg}>
                    <Image
                    style={styles.player_img}
                    source={ imgURI === "" ? require('../assets/imgs/generic_player.jpg') : {uri: imgURI} }/>
                </Pressable>

                <HStack space="lg" style={styles.switch_container}>
                    <Text size="md" style={styles.switch_text}>
                        {available ? "Disponível." : "Indisponível."} 
                    </Text>
                    
                    <Switch
                    style={styles.switch}
                    size="lg"
                    value={available}
                    onValueChange={() => setAvailable(!available)}/>
                </HStack>

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
                        options: config.availablePOS,
                        setValue: (value) => setPos(value),
                        selected: pos 
                    } }/>

                    <VStack w={250} h={50}>
                        <Heading size="g" color='rgba(0,0,0,.72)' textAlign='left'> Nota {Number(rating).toFixed(2)} </Heading>
                        <Slider
                            step={.25}
                            value={rating}
                            onChange={ (e)=> {setRating(e)} }
                            minValue={0} maxValue={5}
                            defaultValue={50}
                            size="lg"
                            orientation="horizontal"
                            isDisabled={false}
                            isReversed={false}
                        >
                            <SliderTrack>
                                <SliderFilledTrack bg="$amber500"/>
                            </SliderTrack>

                            <SliderThumb
                            bg="$transparent">
                                <FontAwesome name="star" size={25} color="yellow"/>
                            </SliderThumb>
                        </Slider>
                    </VStack>

                    <Pressable 
                    style={styles.submit_pressable}
                    onPress={updatePlayer}>
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

        borderWidth: 1, borderColor: 'rgba(0,0,0,.4)', borderRadius: 10,
    },

    player_name_input: {
        alignSelf: 'center',

        fontWeight: 'bold', fontStyle: 'italic', fontSize: 18,
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

    switch_container: {
        justifyContent: 'flex-end',
        alignItems: 'center'
    },

    switch: {
        marginLeft: -10,
    },

    switch_text: {
        marginLeft: 0,
        fontSize: 14,
        fontWeight: '300'
    },
} );