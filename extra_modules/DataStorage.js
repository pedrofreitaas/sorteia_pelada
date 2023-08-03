import * as SecureStore from 'expo-secure-store';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const key = 'players';

function removeWhiteSpaces( str ) {
    if(typeof str !== typeof "") throw TypeError;

    while ( str[str.length-1] === " " )
        str = str.slice(0, -1)

    return str;
}

export const savePlayer = async ( name, rating, imgURI ) => {
    let players = await SecureStore.getItemAsync(key);

    players = JSON.parse(players);

    if(players === null)
        players = {}

    if(players[name] !== undefined) {
        alert('Jogador já existe no sistema.')
        return;
    }

    players[ removeWhiteSpaces(name) ] = {
        rating: rating,
        imgURI: imgURI,
        available: true,
    };

    await SecureStore.setItemAsync(key, JSON.stringify(players));

    alert('Jogador cadastrado com sucesso.');
}

export const getPlayers = async () => {
    const value = await SecureStore.getItemAsync(key);
    return JSON.parse(value);
}

export const getPlayer = async (name) => {
    let players = await getPlayers();

    return players[name];
}

export const displayPlayers = async () => {
    console.log( await SecureStore.getItemAsync(key) );
}

export const changePlayer = async ( name, rating, imgURI, available ) => {
    let players = await getPlayers();

    players = JSON.parse(players);
    
    if( players[name] === undefined ) return false;

    players[name].imgURI = imgURI
    players[name].rating = rating;
    players[name].available = available;

    await SecureStore.setItemAsync( key, JSON.stringify(players) );

    return true;
}

export const invertPlayerAvailability = async ( name ) => {
    let players = await getPlayers();

    players = JSON.parse(players);
    
    return changePlayer(name, players[name].rating, players[name].imgURI, !players[name].available);
}

export const delPlayer = async ( name ) => {
    let players = await getPlayers();

    players = JSON.parse(players);

    if (players[name] === undefined) return false;
    
    delete players[name];
    
    await SecureStore.setItemAsync( key, JSON.stringify(players) );

    return true;
}

export const delAllPlayers = async () => {
    await SecureStore.deleteItemAsync(key);
}