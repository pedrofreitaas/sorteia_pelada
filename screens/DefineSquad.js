import { useState } from "react";
import { Text, StyleSheet, View, Pressable, ImageBackground, Image, FlatList } from "react-native";
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

function AvailablePlayersDisplay() {
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
            renderItem={ (playerName) =>  <PlayerContainer name={playerName.item}/> }
            />
        </View>
    );
}

function AllPlayers() {
    const [display, setDisplay] = useState(false);

    return (
        <Pressable onPress={ ()=> setDisplay(!display)}> 
            <MaterialIcons 
            style={styles.show_players_pressable}
            name="person-search" size={40} color="rgba(0,100,120,1)" />

            {display && <AvailablePlayersDisplay/>}
        </Pressable>
    );
}

export function DefineSquadScreen( {nav} ) {
    nav.goBackHardwareEventTrigger();

    return (
        <ImageBackground
        style={styles.container}
        source={require('../assets/imgs/soccer_field2.jpg')}
        opacity={.88}>
            <AllPlayers/>
        </ImageBackground>
    );
};

const styles = StyleSheet.create( {
    container: {
        flex: 1,
    },

    show_players_pressable: {
        backgroundColor: '#fff',
        padding: 5,

        width: 50, height: 'auto',

        top: 100, left: 20,

        borderRadius: 10,
    },

    players_display: {
        top: 300, left: 20,
        
        backgroundColor: 100,
    },

    player_container: {
        padding: 10,

        borderTopLeftRadius: 60, borderTopRightRadius: 60,
        borderBottomLeftRadius: 20, borderBottomRightRadius: 20,

        backgroundColor: '#fff',
        width: 80, height: 'auto',
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
    }

} );