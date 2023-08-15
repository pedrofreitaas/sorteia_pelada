import AsyncStorage from '@react-native-async-storage/async-storage';

import { NativeEventEmitter } from 'react-native';
const evHandler = new NativeEventEmitter();

let lastUpdate = undefined;
const updateLastUpdate = () => {
    lastUpdate = Date.now().toLocaleString();
}

function _removeWhiteSpaces( str ) {
    if(typeof str !== typeof "") throw TypeError;

    while ( str[str.length-1] === " " )
        str = str.slice(0, -1)

    return str;
}

export const isUpToDate = ( lastGetTime ) => {
    return (lastGetTime === lastUpdate || lastUpdate === undefined);
}

export const getPlayers = async () => {
    const key = 'players';

    const value = await AsyncStorage.getItem(key);

    return {
        lastUpd_timestamp: lastUpdate,
        result: JSON.parse(value),
    };
}

export class SavedPlayerWithGenericImage extends Error {
    constructor() {
        super('Player was saved with generic image.');
    }
};

export class PlayerAlreadyExists extends Error {
    constructor(name) {
        super(`Player with the name: ${name} already exists in the system.`);
    }
};

const _savePlayer = async ( name, rating, pos, imgURI, available=false ) => {
    let data = await getPlayers();

    let players = data.result;

    if(players === null) players = {};

    players[ _removeWhiteSpaces(name) ] = {
        rating: rating,
        pos: pos,
        imgURI: imgURI,
        available: available,
    };

    const key = 'players';

    await AsyncStorage.setItem(key, JSON.stringify(players));
    updateLastUpdate();

    if(imgURI === undefined)
        throw new SavedPlayerWithGenericImage();
};

export const getPlayer = async (name) => {
    const data = await getPlayers();
    const players = data.result;

    if(players === null) return undefined;

    return {
        lastUpd_timestamp: lastUpdate,
        result: players[name],
    };
}

export const savePlayer = async ( name, rating, pos, imgURI, available=false ) => {
    const data = await getPlayer(name);

    const player = data.result;
    
    if(player !== undefined) {
        throw new PlayerAlreadyExists(name);
    }

    try {
        await _savePlayer(name, rating, pos, imgURI, available);
    } catch(error) {
        throw error;
    }
}

export const displayPlayers = async () => {
    const players = await getPlayers(); 
    console.log( 'Last update ->', players.lastUpd_timestamp, ": ", players.result );
}

class CouldntDeletePlayer extends Error {
    constructor(player){
        super(`Couldn't delete player: ${player}.`)
    }
}

export const changePlayer = async ( oldName, newName, newRating, newPos, newImgURI, newAvailable=false ) => {
    const data = await getPlayers();

    const players = data.result;
    
    if( players[oldName] === undefined ) return false;
    
    const deleted = await delPlayer(oldName);

    if(!deleted) throw new CouldntDeletePlayer(oldName);

    try {
        await _savePlayer(newName, newRating, newPos, newImgURI, newAvailable);
        return true;
    } catch (err) {
        throw err;
    }
}

export const delPlayer = async ( name ) => {
    const data = await getPlayers();

    let players = data.result;

    if (players[name] === undefined) return false;
    
    delete players[name];

    const key = 'players';
    await AsyncStorage.setItem(key, JSON.stringify(players));

    updateLastUpdate();

    return true;
}

export const delAllPlayers = async () => {
    const key = 'players';

    await AsyncStorage.removeItem(key);

    updateLastUpdate();
}

export const getPlayerNames = async () => {
    const data = await getPlayers();
    const players = data.result;

    return {
        lastUpd_timestamp: lastUpdate,
        result: Object.entries(players).map( (item) => item[0] ),
    };
}