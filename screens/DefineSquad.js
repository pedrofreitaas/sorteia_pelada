import { useState, useEffect } from "react";
import { Text, StyleSheet, View, Pressable, ImageBackground } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import {getPlayers} from '../extra_modules/DataStorage'

import { Player } from "./Player";

import {PlayersList, NotSufficientPlayers} from "../extra_modules/PlayerRaffleList.ts";

import { useNavigation } from '@react-navigation/native';

import {showInterstitial} from '../extra_modules/Ads';

function Team( {squad, upper} ) {
    let sum = 0;
    for(const item of squad)
        for(const pl of item[1])
            sum += pl.rating;
    const mediumRating = sum/6; //squad.reduce( (sum, item) => sum+item.rating, 0) / 6;

    const getID = (str) => {
        return Number( str.replace("player", "") );
    }

    return (
        <View 
        style={{
            flex: 1/1.5,
            flexDirection: upper ? 'column' : 'column-reverse',
        }}>
            <View style={styles.position}>
                {squad.get("GOL").map( item => <Player key={item.id} id={getID(item.id)}/> )}
            </View>

            <View style={styles.position}>
                {squad.get("ZAG").map( item => <Player key={item.id} id={getID(item.id)}/> )}
            </View>

            <View style={styles.position}>
                {squad.get("MEI").map( item => <Player key={item.id} id={getID(item.id)}/> )}
            </View>
            
            <View style={styles.team_end}>
                <View style={styles.team_rating}>
                    <MaterialIcons name="star" size={30} color="rgba(255,255,0,.96)" />
                    <Text style={styles.team_rating_text}>{mediumRating.toFixed(2)}</Text>
                </View>

                {squad.get("ATA").map( item => <Player key={item.id} id={getID(item.id)}/> )}
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
                const data = await getPlayers();

                const players = Object.entries(data.result);

                const playersList = new PlayersList(players);
                
                const result = playersList.sortSquads();

                if(result.usedExtraPlayers)
                    alert("Foram utilizados jogadores fora de posição, por causa de falta de jogadores.");
                
                setSquads(result.squads);
                
            } catch(error){
                if(error instanceof NotSufficientPlayers)
                    alert(error);
                else
                    alert(error, 'Algum erro inesperado ocorreu.');
            }
        };

        if(squads===undefined) showInterstitial( rafflePlayers );
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