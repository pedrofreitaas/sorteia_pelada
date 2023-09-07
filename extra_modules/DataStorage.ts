import AsyncStorage from '@react-native-async-storage/async-storage';

// exceptions.
export class SavedPlayerWithGenericImage extends Error {
    constructor() {
        super('Player was saved with generic image.');
    }
};

export class PlayerAlreadyExists extends Error {
    constructor(name: string) {
        super(`Player with the name: ${name} already exists in the system.`);
    }
};

export class PlayerDoesNotExist extends Error {
    constructor(id: number) {
        super(`Player ${id} doesn't exist.`)
    }
}
//

const storageKeys = {
    nextID: "nextID", freeIDs: "freeIDs", filledIDs: "filledIDs",
}

/* Async Storage scheme:
player{id}:
    name: string,
    rating: float(0,5),
    imgURI: string or undefined,
    pos: string,
    available: bool,

nextID:
    int

freeIDs:
    array[int]
*/

import { NativeEventEmitter } from 'react-native';
const evHandler = new NativeEventEmitter();

let lastUpdate: string = "";
const updateLastUpdate = () => {
    lastUpdate = Date.now().toLocaleString();

    evHandler.emit('updated_DB');
};

function _removeWhiteSpaces( str: string ): string {
    if(typeof str !== typeof "") throw TypeError;

    while ( str[str.length-1] === " " )
        str = str.slice(0, -1)

    return str;
};

export const isUpToDate = ( lastGetTime: string ): boolean => {
    return (lastGetTime === lastUpdate || lastUpdate === "");
};

export const getPlayers = async () => {
    const allKeys = await AsyncStorage.getAllKeys();
    const value = await AsyncStorage.multiGet(allKeys);

    let players = {};

    for(const item of value)
        if(item[0].substring(0,6) === 'player')
            players[item[0]] = JSON.parse(item[1]);

    return {
        lastUpd_timestamp: lastUpdate,
        result: players,
    };
};

// get player single methods.
export const getPlayerByName = async (name: string) => {
    const data = await getPlayers();

    let results = {};

    for(const key in data.result)
        if(data.result[key].name === name)
            results[key] = data.result[key];

    return {
        lastUpd_timestamp: lastUpdate,
        result: results,
    }
};

export const getPlayerByID = async (id: number) => {
    return {
        lastUpd_timestamp: lastUpdate,
        result: JSON.parse( await AsyncStorage.getItem('player'+String(id)) ),
    }
};
//

export const getAvailableID = async () => {
    let id = await AsyncStorage.getItem(storageKeys.nextID);
    id = JSON.parse(id);

    id = id===null ? "0" : id;

    await AsyncStorage.setItem(storageKeys.nextID, JSON.stringify(Number(id)+1));

    return id;
};

export const savePlayer = async (name: string, rating: number, pos:string, imgURI:string, available:boolean=true) => {
    const newPlayer = {
        name: _removeWhiteSpaces(name),
        rating: rating,
        pos: pos,
        imgURI: imgURI,
        available: available,
    };

    const playerKey = 'player'+ await getAvailableID();

    await AsyncStorage.setItem(playerKey, JSON.stringify(newPlayer));
    
    updateLastUpdate();

    if(imgURI === undefined) throw new SavedPlayerWithGenericImage();
};

export const changePlayer = async ( id: number, newName: string, newRating: number, newPos: string, newImgURI: string, newAvailable: boolean=false ) => {
    const data = await getPlayerByID(id);
    
    if( !data.result ) throw new PlayerDoesNotExist(id);

    const player = {
        name: _removeWhiteSpaces(newName),
        rating: newRating,
        pos: newPos,
        imgURI: newImgURI,
        available: newAvailable,
    };

    await AsyncStorage.setItem('player'+String(id), JSON.stringify(player));
    updateLastUpdate();
}

export const delPlayer = async ( id: number ) => {
    await AsyncStorage.removeItem('player'+String(id));
    updateLastUpdate();
}

export const delAllPlayers = async () => {
    const data = await getPlayers();

    for(const key in data.result) 
        await delPlayer(Number(key.replace("player", "")));

    updateLastUpdate();
}

export const getPlayerIDsWhoseNameMatch = async (name: string) => {
    const data = await getPlayers();
    
    const players = data.result;

    const namesWhoseMatch = Object.entries(players).filter( (el) => el[1].name.slice(0, name.length).toLowerCase() === name.toLowerCase());

    const ids = namesWhoseMatch.map( (el) => Number( el[0].replace('player', "") ) );

    return {
        lastUpd_timestamp: lastUpdate,
        result: ids,
    };
}