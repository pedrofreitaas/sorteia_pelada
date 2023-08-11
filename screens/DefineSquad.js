import { useState, useEffect } from "react";
import { Text, StyleSheet, View, Pressable, ImageBackground } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import {getPlayers} from '../extra_modules/DataStorage'

import { Player } from "./Player";

function getRandomIntFromAtoB(A, B) { // does not include B
    return Math.round( A + Math.random()*(B-A) );
}

class NotSufficientPlayers extends Error{
    constructor(pos, need, have) {
        super(`Faltam ${need-have} ${pos}'s disponíveis no sistema.`);
    }
}

async function sortPlayersByPos(configs) {
    const data = await getPlayers();

    const players = Object.entries( data.result );

    let playersSortedByPos = {
        'GOL': [], 'ZAG': [], 'MEI': [], 'ATA': [],
    };

    // separating players by pos.
    for(const idx in players) {
        var infos = players[idx][1];

        if(infos.available)
            playersSortedByPos[infos.pos].push(players[idx]); 
    }

    // ordering and verifying if there are the mininum amount of players.
    for(const pos in playersSortedByPos) {
        playersSortedByPos[pos].sort( (item1, item2) => item1[1].rating - item2[1].rating );

        if(playersSortedByPos[pos].length < configs[pos]*2)
            throw new NotSufficientPlayers(pos, configs[pos]*2, playersSortedByPos[pos].length);
    }

    return playersSortedByPos;
}

async function raffledPlayers() {
    const configs = {GOL: 1, ZAG: 2, MEI: 2, ATA: 1};

    let playersByPos = await sortPlayersByPos(configs);

    let squads = [[], []];

    // sorting players distribuition for each squad.
    for( const item in playersByPos )
        for( let a=0; a<configs[item]; a++ ) {
            let whichSquad = getRandomIntFromAtoB(0, 1);
            let index = getRandomIntFromAtoB(0, playersByPos[item].length-2);

            squads[whichSquad].push(playersByPos[item][index]);
            squads[Number(!whichSquad)].push(playersByPos[item][index+1]);

            //avoid repeat.
            playersByPos[item].splice(index, index+1);
        }
        
    return squads;
}

function Team( {squad, upper} ) {
    const position = {
        flex: 1/2, 
        flexDirection: 'row', 
        alignSelf: 'center',
    }

    const mediumRating = squad.reduce( (sum, item) => sum+item[1].rating, 0) / 6;

    return (
        <View style={{flex:1/2, flexDirection: upper ? 'column' : 'column-reverse'}}>
            <View style={position}><Player name={squad[0][0]}/></View>

            <View style={position}><Player name={squad[1][0]}/><Player name={squad[2][0]}/></View>

            <View style={position}><Player name={squad[3][0]}/><Player name={squad[4][0]}/></View>
            
            <View style={position}><Player name={squad[5][0]}/></View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MaterialIcons name="star" size={30} color="rgba(255,255,0,.8)" />

                <Text style={{fontSize: 20, fontWeight: 'bold'}}>{mediumRating.toFixed(2)}</Text>
            </View>
        </View>
    );
};

export const Squads = ( {props} ) => {
    const [squads, setSquads] = useState(undefined);

    useEffect( () => {
        const rafflePlayers = async () => {
            if(squads !== undefined) return

            try {
                const value = await raffledPlayers();
                
                setSquads(value);
            } catch(error){
                if(error instanceof NotSufficientPlayers)
                    alert(error);
                else
                    alert(error, 'Algum erro inesperado ocorreu.');
            }
        };

        if(squads===undefined) rafflePlayers();
    }, [squads]);

    return (
        <ImageBackground
        style={styles.container}
        source={require('../assets/imgs/soccer_field2.jpg')}
        opacity={.88}>
            {squads && <Team {...{squad: squads[0], upper: true} } />}
            
            <Pressable
            onPress={() => setSquads(undefined)}
            style={styles.raffle_button}>
                <Text>Sortear</Text>
            </Pressable>

            {squads && <Team {...{squad: squads[1], upper: false} } />}
        </ImageBackground>
    );
}

const styles = StyleSheet.create( {
    container: {
        flex: 1,
    },

    raffle_button: {
        backgroundColor: '#fff',
        alignItems: 'center', justifyContent: 'center',
        width: 80, height: 35,
        borderRadius: 10,

        borderWidth: 2, borderColor: '#eff',

        marginLeft: 20, marginRight: 10,

        alignSelf: 'flex-end',
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