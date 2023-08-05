import * as SecureStore from 'expo-secure-store';

function _removeWhiteSpaces( str ) {
    if(typeof str !== typeof "") throw TypeError;

    while ( str[str.length-1] === " " )
        str = str.slice(0, -1)

    return str;
}

const _savePlayer = async ( name, rating, imgURI, available=true ) => {
    let players = await getPlayers();

    if(players === null) players = {};

    players[ _removeWhiteSpaces(name) ] = {
        rating: rating,
        imgURI: imgURI,
        available: available,
    };

    const key = 'players';

    await SecureStore.setItemAsync(key, JSON.stringify(players));
};

export const getPlayers = async () => {
    const key = 'players';

    const value = await SecureStore.getItemAsync(key);
    return JSON.parse(value);
}

export const getPlayer = async (name) => {
    let players = await getPlayers();

    if(players === null) return undefined;

    return players[name];
}

export const savePlayer = async ( name, rating, imgURI, available=true ) => {
    if(await getPlayer(name) !== undefined) {
        alert('Jogador já existe no sistema.')
        return;
    }

    try {
        await _savePlayer(name, rating, imgURI, available);
        alert('Jogador cadastrado com sucesso.');
    } catch(error) {
        alert('Algum erro ocorreu.');
    }
}

export const displayPlayers = async () => {
    console.log( await getPlayers() );
}

export const changePlayer = async ( name, rating, imgURI, available ) => {
    let players = await getPlayers();
    
    if( players[name] === undefined ) return false;

    await _savePlayer(name, rating, imgURI, available);

    return true;
}

export const invertPlayerAvailability = async ( name ) => {
    let player = await getPlayer(name);
    
    return await _savePlayer(name, player.rating, player.imgURI, !player.available);
}

export const delPlayer = async ( name ) => {
    let players = await getPlayers();

    if (players[name] === undefined) return false;
    
    delete players[name];

    const key = 'players';
    
    await SecureStore.setItemAsync( key, JSON.stringify(players) );

    return true;
}

export const delAllPlayers = async () => {
    const key = 'players'
    await SecureStore.deleteItemAsync(key);
}