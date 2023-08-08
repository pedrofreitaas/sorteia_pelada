import { useState } from "react";
import { Text, StyleSheet, View, Pressable, ImageBackground, Image, FlatList, ScrollView } from "react-native";
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import {getPlayers, invertPlayerAvailability, getPlayer} from '../extra_modules/DataStorage'

function getRandomIntFromAtoB(A, B) { // does not include B
    return Math.round( A + Math.random()*(B-A) );
}

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
                    {player.pos} {"->"} {name}
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

class NotSufficientPlayers extends Error{
    constructor(pos, need, have) {
        super(`Faltam ${need-have} ${pos}'s disponíveis no sistema.`);
    }
}

async function sortPlayersByPos(configs) {
    const players = Object.entries( await getPlayers()); 

    const positions = ['GOL', 'ZAG', 'MEI', 'ATA'];

    let playersSortedByPos = {}

    for(const pos of positions) {
        playersSortedByPos[pos] = players.filter( (item) => item[1].pos === pos && item[1].available );
        playersSortedByPos[pos].sort( (item1, item2) => item1[1].rating - item2[1].rating );

        if(playersSortedByPos[pos].length < configs[pos]*2)
            throw new NotSufficientPlayers(pos, configs[pos]*2, playersSortedByPos[pos].length);
    }

    return playersSortedByPos;
}

async function raffledPlayers() {
    const configs = {GOL: 1, ZAG: 2, MEI: 2, ATA: 1};

    let players = await sortPlayersByPos(configs);

    let squads = [[], []];

    for( const item in players )
        for( let a=0; a<configs[item]; a++ ) {
            let whichSquad = getRandomIntFromAtoB(0, 1);
            let index = getRandomIntFromAtoB(0, players[item].length-2);

            squads[whichSquad].push(players[item][index]);
            squads[Number(!whichSquad)].push(players[item][index+1]);

            //avoid repeat.
            players[item].splice(index, index+1);
        }
        
    return squads;
}

function DraftedPlayer( {name} ) {
    const [player, setPlayer] = useState();

    const definePlayer = async () => {
        const value = await getPlayer(name);
        setPlayer(value);
    };

    definePlayer();

    return (
        <View style={styles.drafted_player}>
            {player &&
            <Image style={styles.player_container_img} source={ {uri: player.imgURI} }/>}
            <Text 
            style={styles.drafted_player_text}>
                {name}
            </Text>
        </View>
    );
};

function Team( {squad, upper} ) {
    const position = {
        flex: 1/2, 
        flexDirection: 'row', 
        alignSelf: 'center',
    }

    const mediumRating = squad.reduce( (sum, item) => sum+item[1].rating, 0)/5;

    return (
        <View style={{flex:1/2, flexDirection: upper ? 'column' : 'column-reverse'}}>
        <View style={position}>
            <DraftedPlayer { ...{name: squad[0][0]} }/>
        </View>

        <View style={position}>
            <DraftedPlayer { ...{name: squad[1][0]} }/>
            <DraftedPlayer { ...{name: squad[2][0]} }/>
        </View>

        <View style={position}>
            <DraftedPlayer { ...{name: squad[3][0]} }/>
            <DraftedPlayer { ...{name: squad[4][0]} }/>
        </View>
        
        <View style={position}>
            <DraftedPlayer { ...{name: squad[5][0], left: 120, top: 300} }/>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <MaterialIcons
                name="star" size={30} color="rgba(255,255,0,.8)" />
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                {mediumRating.toFixed(2)}
            </Text>
        </View>

        </View>
    );
};

function Squads( {squads} ) {
    const [_squads, setSquads] = useState(squads);

    return (
        <View style={ {flex: 1} }>
            {squads &&
                <Team {...{squad: _squads[0], upper: true} } />}
            {squads &&
                <Team {...{squad: _squads[1], upper: false} } />}
        </View>
    );
}

export function DefineSquadScreen( {nav} ) {
    nav.goBackHardwareEventTrigger();

    const [display, setDisplay] = useState(false);
    const [raffled, setRaffled] = useState(false);
    const [squads, setSquads] = useState(undefined);

    const rafflePlayers = async () => {
        if(squads !== undefined) return

        try {
            const value = await raffledPlayers();
            
            setSquads(value);

            setRaffled(true);

        } catch(error ){
            if(error instanceof NotSufficientPlayers)
                alert(error);
            else
                alert('Algum erro inesperado ocorreu.');
        }
    };

    return (
        <ImageBackground
        style={styles.container}
        source={require('../assets/imgs/soccer_field2.jpg')}
        opacity={.88}>

            {raffled ? <Squads squads={squads}/> :

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

            </View>}
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

    drafted_player: {
        alignSelf: 'center',
        
        padding: 3, margin: 10, borderRadius: 100,

        justifyContent: 'center', alignItems: 'center',
    },

    drafted_player_text: {
        fontWeight: 'bold', fontSize: 13,

        alignSelf: 'center',

        backgroundColor: '#fff', 
        padding: 5, borderRadius: 5,
    }
} );