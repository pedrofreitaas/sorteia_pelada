import * as config from '../config.json';
import * as RealmScheme from './RealmScheme';

function getRandomIntFromAtoB(A: number, B: number) { // does not include B
    return Math.round( A + Math.random()*(B-A) );
}

export class NotSufficientPlayers extends Error{
    constructor() {
        super(`Não existem jogadores suficientes registrados no sistema.`)
    }
}

export class PlayersList {
    private players_ordered_by_pos: Map<string, Array<RealmScheme.Player>> = new Map();

    constructor(playersList: Array<RealmScheme.Player>) {
        // filtering available players.
        playersList = playersList.filter( (item) => item.available );

        // filling the positions of the Map with the players.
        for(const item of playersList)
            if (this.players_ordered_by_pos.get(item.pos) === undefined)
                this.players_ordered_by_pos.set(item.pos, [item])
            else 
                this.players_ordered_by_pos.set(item.pos, this.players_ordered_by_pos.get(item.pos).concat([item]));
        
        // ordering each position by players rating.
        for (const item of this.players_ordered_by_pos.keys()) {
            const ordered_players = this.players_ordered_by_pos.get(item).sort( (i1, i2) => i1.rating - i2.rating );
            this.players_ordered_by_pos.set(item, ordered_players);
        }

        for(const pos of config.availablePOS)
            if(this.players_ordered_by_pos.get(pos) === undefined)
            this.players_ordered_by_pos.set(pos, []);
    }

    // gets the positions that can fill the position parameter.
    // Ex: the ZAG position can be filled by a ZAG, a CORINGA and a LINHA.
    getPossibleCategories(pos: string): Array<string> {
        if(["ZAG", "MEI", "ATA"].includes(pos))
            return ["LINHA", "CORINGA", pos];

        return ["GOL", "CORINGA"];
    }

    // gets the positions that can't fill the position parameter.
    // Ex: the ZAG position can't be filled by a GOL, MEI, ATA.
    getNotPossibleCategorias(pos: string): Array<string> {
        let values = ["GOL","ZAG", "MEI", "ATA"];
        
        values.splice(values.indexOf(pos),1);

        return values;
    }

    // get all the players registered in the instance that can fill the position in the parameter.
    getPossiblePlayersByPos(pos: string): Array<RealmScheme.Player> {
        if(! ["GOL", "ZAG", "MEI", "ATA"].includes(pos) ) throw new Error();

        const categories = this.getPossibleCategories(pos);

        let possiblePlayers: Array<RealmScheme.Player> = [];
        
        for(const cat of categories)
            possiblePlayers = possiblePlayers.concat(this.players_ordered_by_pos.get(cat));

        return possiblePlayers;
    }

    // retrieve other position players if there isn't the amount needed.
    fillWithExtraPlayers(pos: string, possiblePlayers: Array<RealmScheme.Player>): {possiblePlayers: Array<RealmScheme.Player>, usedExtraPlayers: boolean} {
        let usedExtraPlayers = false;

        for(const item of this.getNotPossibleCategorias(pos)) {
            if(possiblePlayers.length >= 2) break;

            usedExtraPlayers = true;

            let extraPlayers = this.getPossiblePlayersByPos(item);

            const amount_needed = 2 - possiblePlayers.length;

            // reducing the extra players to the sufficient.
            extraPlayers = extraPlayers.slice(0, extraPlayers.length < amount_needed ? extraPlayers.length-1 : amount_needed)

            possiblePlayers = possiblePlayers.concat( extraPlayers );
        }

        return {
            possiblePlayers: possiblePlayers,
            usedExtraPlayers: usedExtraPlayers,
        };
    }

    getTwoBalancedPlayersByPos(pos: string): {players: Array<RealmScheme.Player>, usedExtraPlayers: boolean} {
        let possiblePlayers = this.getPossiblePlayersByPos(pos);
        
        const result = this.fillWithExtraPlayers(pos, possiblePlayers);

        possiblePlayers = result.possiblePlayers;
        const usedExtraPlayers = result.usedExtraPlayers;

        if(possiblePlayers.length < 2) throw new NotSufficientPlayers();

        let chosenPlayers: Array<RealmScheme.Player> = [];

        let whichSquad = getRandomIntFromAtoB(0, 1);
        var index = getRandomIntFromAtoB(0, possiblePlayers.length-2);

        chosenPlayers[ whichSquad ] = possiblePlayers[index];
        chosenPlayers[ Number(!whichSquad) ] = possiblePlayers[index+1];

        // removing chosen players to avoid repetition.
        for( const item of [possiblePlayers[index], possiblePlayers[index+1]] ) {
            for( const category of config.availablePOS ) {
                index = this.players_ordered_by_pos.get(category).indexOf(item);
                
                if(index != -1) {
                    let players = this.players_ordered_by_pos.get(category);
                    players.splice(index, 1);

                    this.players_ordered_by_pos.set(category, players);
                    
                    break;
                }
            }
        }

        return {
            players: chosenPlayers,
            usedExtraPlayers: usedExtraPlayers
        }            
    }

    sortSquads(): {squads: Array<Map<string,RealmScheme.Player>>, usedExtraPlayers: boolean} {
        const squads = [new Map(), new Map()];
        
        const sequenceOfSort = config.hasToSort.sort( () => Math.random() - .9 ); // mixed but no aleatory order of sorting
        //const sequenceOfSort = config.hasToSort;

        let usedExtraPlayers = false;

        for(const pos of sequenceOfSort) {
            const result = this.getTwoBalancedPlayersByPos(pos);
            let players = result.players;

            usedExtraPlayers = usedExtraPlayers || result.usedExtraPlayers;

            for(const index in players)
                if(squads[index].get(pos) == undefined)
                    squads[index].set( pos, [players[index]] );
                else
                    squads[index].set( pos, squads[index].get(pos).concat( [players[index]] ) );
        }

        return {
            squads: squads,
            usedExtraPlayers: usedExtraPlayers,
        }
    }
};