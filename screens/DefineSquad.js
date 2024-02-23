import { useState, useEffect } from "react";
import { Text, StyleSheet, View, Pressable, ImageBackground } from "react-native";
import { Spinner } from '@gluestack-ui/themed';
import { MaterialIcons } from '@expo/vector-icons';

import { Alert, AlertIcon, AlertText, InfoIcon } from '@gluestack-ui/themed';

import { Player } from "./Player";

import {PlayersList, NotSufficientPlayers} from "../extra_modules/PlayerRaffleList.ts";

import { useNavigation } from '@react-navigation/native';

import {showInterstitial} from '../extra_modules/Ads';

import * as RealmScheme from '../extra_modules/RealmScheme';

const MyAlert = ( {text, icon} ) => {
    return (
        <Alert mx='$2.5'  action="info" variant="solid" style={styles.alert}>
            {icon}
            <AlertText>{text} </AlertText>
        </Alert>
    );
}

const Team = ( {squad, upper} ) => {
    let sum = 0;
    for(const item of squad)
        for(const pl of item[1])
            sum += pl.rating;
    const mediumRating = sum/6; //squad.reduce( (sum, item) => sum+item.rating, 0) / 6;

    return (
        <View 
        style={{
            flex: 1/1.5,
            flexDirection: upper ? 'column' : 'column-reverse',
        }}>
            <View style={styles.position}>
                {squad.get("GOL").map( item => <Player playerInfo={item}/> )}
            </View>

            <View style={styles.position}>
                {squad.get("ZAG").map( item => <Player playerInfo={item}/> )}
            </View>

            <View style={styles.position}>
                {squad.get("MEI").map( item => <Player playerInfo={item}/> )}
            </View>
            
            <View style={styles.team_end}>
                <View style={styles.team_rating}>
                    <MaterialIcons name="star" size={30} color="rgba(255,255,0,.96)" />
                    <Text style={styles.team_rating_text}>{mediumRating.toFixed(2)}</Text>
                </View>

                {squad.get("ATA").map( item => <Player playerInfo={item}/> )}
            </View>
        </View>
    );
};

export const Squads = ( {navigation, route} ) => {
    const [squads, setSquads] = useState(undefined);
    const [_lackPlayers, setLackPlayers] = useState(false);
    const [_unexpectedError, setUnexpectedError] = useState(false);
    const [_outOfPosRaffle, setOutOfPosRaffle] = useState(false);
    const alert_timer = 4 * 1000;

    const nav = useNavigation();

    const players = RealmScheme.useQuery(RealmScheme.Player);

    useEffect( () => {
        const rafflePlayers = () => {
            try {
                const playersList = new PlayersList(players);
                
                const result = playersList.sortSquads();

                if(result.usedExtraPlayers)
                    setOutOfPosRaffle(true);
                
                setSquads(result.squads);
                
            } catch(error){
                if(error instanceof NotSufficientPlayers)
                    setLackPlayers(true);
                else
                    setUnexpectedError(true);
            }
        };

        if(squads===undefined) showInterstitial( rafflePlayers );
    }, [squads]);

    useEffect( () => {
        if(_lackPlayers)
            setTimeout( () => {setLackPlayers(false);}, alert_timer)

        else if(_outOfPosRaffle)
            setTimeout( () => {setOutOfPosRaffle(false);}, alert_timer)

        else if(_unexpectedError)
            setTimeout( () => {setUnexpectedError(false);}, alert_timer)

    }, [_lackPlayers, _unexpectedError, _outOfPosRaffle]);

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

            {_lackPlayers && 
                <MyAlert 
                text="Não existem jogadores suficientes cadastrados no sistema."
                icon={<AlertIcon as={InfoIcon} mr="$3"/>}/>
            }

            {_outOfPosRaffle && 
                <MyAlert 
                text="Foram usados jogadores fora de posição."
                icon={<AlertIcon as={InfoIcon} mr="$3"/>}/>
            }

            {_unexpectedError && 
                <MyAlert 
                text="Erro inesperado ocorreu."
                icon={<AlertIcon as={InfoIcon} mr="$3"/>}/>
            }

            {squads && <Team {...{squad: squads[1], upper: false} } />}

            {!squads && 
                <Spinner 
                color="$amber600"
                size="xl" 
                style={styles.loading_spinner}/>}

        </ImageBackground>
    );
};

const styles = StyleSheet.create( {
    container: {
        flex: 1,
    },

    alert: {
        alignSelf: 'center',
        justifyContent: 'center'
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

    loading_spinner: {
        alignSelf: 'center',
        alignContent: 'center',
        margin: '50%'
    }
} );