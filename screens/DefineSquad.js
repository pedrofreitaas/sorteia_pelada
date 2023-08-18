import { useState, useEffect } from "react";
import { Text, StyleSheet, View, Pressable, ImageBackground } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import {getPlayers} from '../extra_modules/DataStorage'

import { Player } from "./Player";
import { AdScreen } from "./AdScreen";

import { useNavigation } from '@react-navigation/native';

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
    const mediumRating = squad.reduce( (sum, item) => sum+item[1].rating, 0) / 6;

    const getID = (str) => {
        return Number( str.replace("player", "") );
    }

    return (
        <View 
        style={{
            flex: 1/1.5,
            flexDirection: upper ? 'column' : 'column-reverse',
        }}>
            <View style={styles.position}><Player id={getID(squad[0][0])}/></View>

            <View style={styles.position}><Player id={getID(squad[1][0])}/><Player id={getID(squad[2][0])}/></View>

            <View style={styles.position}><Player id={getID(squad[3][0])}/><Player id={getID(squad[4][0])}/></View>
            
            <View style={styles.team_end}>
                <View style={styles.team_rating}>
                    <MaterialIcons name="star" size={30} color="rgba(255,255,0,.96)" />
                    <Text style={styles.team_rating_text}>{mediumRating.toFixed(2)}</Text>
                </View>

                <Player id={getID(squad[5][0])}/>                
            </View>
        </View>
    );
};

export const Squads = ( {navigation, route} ) => {
    const [squads, setSquads] = useState(undefined);

    const nav = useNavigation();

    useEffect( () => {
        const rafflePlayers = async () => {
            try {
                nav.navigate( "Ads", {} );

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
                <Text
                style={styles.raffle_button_text}>
                    Sortear
                </Text>
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
        position: 'absolute', top: '50%',

        backgroundColor: 'rgba(255,255,255,.85)',

        alignItems: 'center', justifyContent: 'center',

        borderWidth: 5, borderColor: 'rgba(0,0,0,.3)', borderRadius: 20,

        marginLeft: 20, marginRight: 10, padding: 10,

        alignSelf: 'flex-end',
    },

    raffle_button_text: {
        fontSize: 16, fontWeight: 'bold',
    },

    position: {
        flex: 1/2,
        flexDirection: 'row',
        alignSelf: 'center',
    },

    team_end: {    
        flex: 1/2,
        flexDirection: 'row',
    },

    team_rating: {       
        height: 50, 
        flexDirection: 'row',

        marginRight: '10%',

        backgroundColor: 'rgba(255,255,255, .3)', padding: 5,

        borderWidth: 5, borderColor: 'rgba(0,0,0,.3)', borderRadius: 20,

        alignSelf: 'flex-start',
    },

    team_rating_text: {
        fontSize: 20, fontWeight: 'bold',
    },
} );