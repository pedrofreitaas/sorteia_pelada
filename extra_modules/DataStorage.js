import AsyncStorage from '@react-native-async-storage/async-storage';

function _removeWhiteSpaces( str ) {
    if(typeof str !== typeof "") throw TypeError;

    while ( str[str.length-1] === " " )
        str = str.slice(0, -1)

    return str;
}

export const getPlayers = async () => {
    const key = 'players';

    const value = await AsyncStorage.getItem(key);

    return JSON.parse(value);
}

const _savePlayer = async ( name, rating, pos, imgURI, available=false ) => {
    let players = await getPlayers();

    if(players === null) players = {};

    players[ _removeWhiteSpaces(name) ] = {
        rating: rating,
        pos: pos,
        imgURI: imgURI,
        available: available,
    };

    const key = 'players';
    await AsyncStorage.setItem(key, JSON.stringify(players));
};

export const getPlayer = async (name) => {
    let players = await getPlayers();

    if(players === null) return undefined;

    return players[name];
}

export const savePlayer = async ( name, rating, pos, imgURI, available ) => {
    if(await getPlayer(name) !== undefined) {
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
    console.log( await getPlayers() );
}

export const changePlayer = async ( name, rating, pos, imgURI, available=false ) => {
    let players = await getPlayers();
    
    if( players[name] === undefined ) return false;

    await _savePlayer(name, rating, pos, imgURI, available);

    return true;
}

export const invertPlayerAvailability = async ( name ) => {
    let player = await getPlayer(name);
    
    return await _savePlayer(name, player.rating, player.pos, player.imgURI, !player.available);
}

export const delPlayer = async ( name ) => {
    let players = await getPlayers();

    if (players[name] === undefined) return false;
    
    delete players[name];

    const key = 'players';
    await AsyncStorage.setItem(key, JSON.stringify(players));

    return true;
}

export const delAllPlayers = async () => {
    const key = 'players';

    await AsyncStorage.removeItem(key);
}