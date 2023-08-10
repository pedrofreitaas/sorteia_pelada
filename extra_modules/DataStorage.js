import AsyncStorage from '@react-native-async-storage/async-storage';

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
        alert('Jogador já existe no sistema.')
        return;
    }

    try {
        await _savePlayer(name, rating, pos, imgURI, available);
        alert('Jogador cadastrado com sucesso.');
    } catch(error) {
        alert('Algum erro ocorreu.');
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

    await _savePlayer(newName, newRating, newPos, newImgURI, newAvailable);

    return true;
}

export const invertPlayerAvailability = async ( name ) => {
    const data = await getPlayer(name);

    const player = data.result;
    
    return await _savePlayer(name, player.rating, player.pos, player.imgURI, !player.available);
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