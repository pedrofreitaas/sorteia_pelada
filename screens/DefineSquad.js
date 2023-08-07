import { useState } from "react";
import { Text, StyleSheet, View, Pressable, ImageBackground, Image, FlatList, ScrollView } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import {getPlayers, invertPlayerAvailability, getPlayer, displayPlayers, delAllPlayers} from '../extra_modules/DataStorage'

function PlayerContainer( {name} ) {
    const [player, setPlayer] = useState();

    const definePlayer = async () => {
        const value = await getPlayer(name);
        setPlayer(value);
    };

    definePlayer();

    return (
        <View>
            { player && <Pressable 
            style={styles.player_container}
            onPress={() => {
                invertPlayerAvailability(name);
                definePlayer();
            }}>
                <Image style={styles.player_container_img} source={ {uri: player.imgURI} }/>
                {player.available && <View style={styles.player_available}/> || <View style={styles.player_unavailable}/>}

                <Text 
                style={styles.player_container_text}>
                    {name}
                </Text>

            </Pressable>}
        </View>
    );
}

function PlayersDisplay() {
    const playerNames = []
    
    const getPlayersNameListFromStorage = async () => {
        const value = await getPlayers();
        
        for(const player in value) playerNames.push(player);
    };

    getPlayersNameListFromStorage();

    return (
        <View style={styles.players_display}>
            <FlatList
            data={ playerNames }
            horizontal= {true}
            renderItem={ (playerName) =>  <PlayerContainer name={playerName.item}/> }
            />
        </View>
    );
}

function raffledPlayers () {
    return [];
}

function Squad( props ) {
    const players = raffledPlayers();

    return (
        <Text style={ {top: '40%', left: '10%' } } > DEFINED SQUAD </Text>
    );
}

export function DefineSquadScreen( {nav} ) {
    nav.goBackHardwareEventTrigger();

    const [display, setDisplay] = useState(false);
    const [raffled, setRaffled] = useState(false);

    const rafflePlayers = () => {
        setRaffled(true);
    }

    return (
        <ImageBackground
        style={styles.container}
        source={require('../assets/imgs/soccer_field2.jpg')}
        opacity={.88}>

            {raffled ? <Squad/> :

            <View style={styles.header}>
                <View style={styles.buttons}>
                    <Pressable 
                    onPress={ ()=> setDisplay(!display)}
                    style={styles.show_players_pressable}> 
                        <MaterialIcons
                        name="person-search" size={20} color="rgba(0,100,120,1)" />
                    </Pressable>

                    <Pressable 
                    style={styles.raffle_button}
                    onPress={rafflePlayers}>
                        <Text style={ { fontWeight: "bold"} }> Sortear </Text>
                    </Pressable>
                </View>

            {display && <PlayersDisplay/>}
            </View>
            }

        </ImageBackground>
    );
};

const styles = StyleSheet.create( {
    container: {
        flex: 1,
    },

    header: {
        flexDirection: 'column',

        top: '10%',
        marginLeft: 20, marginRight: 20,
    },

    buttons: {
        flexDirection: 'row',
    },

    show_players_pressable: {
        backgroundColor: '#fff',
        alignItems: 'center', justifyContent: 'center',
        width: 35, height: 35,
        borderRadius: 10,

        borderWidth: 2, borderColor: '#eff',
    },

    raffle_button: {
        backgroundColor: '#fff',
        alignItems: 'center', justifyContent: 'center',
        width: 80, height: 35,
        borderRadius: 10,

        borderWidth: 2, borderColor: '#eff',

        marginLeft: 20,
    },

    players_display: {        
        alignSelf: 'center',

        backgroundColor: 100,
        padding: 10,

        width: 420, height: 120,
    },

    player_container: {
        margin: 5, padding: 10,

        backgroundColor: '#fff',
    },

    player_container_img: {
        backgroundColor: '#f0f',
        width: 50, height: 50, borderRadius: 50,

        alignSelf: 'center',
    },

    player_container_text: {
        fontSize: 15, fontWeight: 'bold',

        alignSelf: "center",
        marginTop: 5,
    },

    player_available: {
        position: 'absolute',
        top: '10%', left: '10%',
        backgroundColor: 'rgba(0, 255, 0, 1)',
        width: 20, height: 20, borderRadius: 20,
    },

    player_unavailable: {
        position: 'absolute',
        top: '10%', left: '10%',
        backgroundColor: 'rgba(255, 0, 0, 1)',
        width: 20, height: 20, borderRadius: 20,
    },
} );