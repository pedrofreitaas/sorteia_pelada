// raffling players.
import * as config from '../config.json';

class PlayerRedux {
    public id: string;
    public rating: number;
    public pos: string;

    constructor (id: string, rating: number, pos: string) {
        this.id = id; this.rating = rating; this.pos = pos;
    }
}

function getRandomIntFromAtoB(A: number, B: number) { // does not include B
    return Math.round( A + Math.random()*(B-A) );
}

export class NotSufficientPlayers extends Error{
    constructor(pos: string) {
        super(`Não existem jogadores suficientes para a posição: ${pos}.`)
    }
}

export class PlayersList {
    private players_ordered_by_pos: Map<string, Array<PlayerRedux>> = new Map();

    constructor(playersList: Array<[string, {pos:string, rating:number, available: boolean}]>) {
        // filtering available players.
        playersList = playersList.filter( (item) => item[1].available );

        // filling the positions of the Map with the players.
        for(const item of playersList)
            if (this.players_ordered_by_pos.get(item[1].pos) === undefined)
                this.players_ordered_by_pos.set(item[1].pos, [new PlayerRedux(item[0], item[1].rating, item[1].pos)])
            else 
                this.players_ordered_by_pos.set(item[1].pos, this.players_ordered_by_pos.get(item[1].pos).concat([new PlayerRedux(item[0], item[1].rating, item[1].pos)]));
        
        // ordering each position by players rating.
        for (const item of this.players_ordered_by_pos.keys()) {
            const ordered_players = this.players_ordered_by_pos.get(item).sort( (i1: PlayerRedux, i2: PlayerRedux) => i1.rating - i2.rating );
            this.players_ordered_by_pos.set(item, ordered_players);
        }

        for(const pos of config.availablePOS)
            if(this.players_ordered_by_pos.get(pos) === undefined)
            this.players_ordered_by_pos.set(pos, []);
    }

    // gets the positions that can fill the position parameters.
    // Ex: the ZAG position can be filled by a ZAG, a CORINGA and a LINHA.
    getPossibleCategories(pos: string): Array<string> {
        if(["ZAG", "MEI", "ATA"].includes(pos))
            return ["LINHA", "CORINGA", pos];

        return ["GOL", "CORINGA"];
    }

    // get all the players registered in the instance that can fill the position in the parameter.
    getPossiblePlayersByPos(pos: string): Array<PlayerRedux> {
        if(! ["GOL", "ZAG", "MEI", "ATA"].includes(pos) ) throw new Error();

        const categories = this.getPossibleCategories(pos);

        let possiblePlayers: Array<PlayerRedux> = [];
        
        for(const cat of categories)
            possiblePlayers = possiblePlayers.concat(this.players_ordered_by_pos.get(cat));

        return possiblePlayers;
    }

    getTwoBalancedPlayersByPos(pos: string): Array<PlayerRedux> {
        const possiblePlayers = this.getPossiblePlayersByPos(pos);

        if(possiblePlayers.length < 2) throw new NotSufficientPlayers(pos);

        let chosenPlayers: Array<PlayerRedux> = [];

        let whichSquad = getRandomIntFromAtoB(0, 1);
        var index = getRandomIntFromAtoB(0, possiblePlayers.length-2);

        chosenPlayers[ whichSquad ] = possiblePlayers[index];
        chosenPlayers[ Number(!whichSquad) ] = possiblePlayers[index+1];

        // removing chosen players to avoid repetition.
        const categories = this.getPossibleCategories(pos);
        for( const item of [possiblePlayers[index], possiblePlayers[index+1]] ) {
            for( const cat of categories ) {
                index = this.players_ordered_by_pos.get(cat).indexOf(item);
                
                if(index != -1) {
                    let players = this.players_ordered_by_pos.get(cat);
                    players.splice(index, 1);

                    this.players_ordered_by_pos.set(cat, players);
                    
                    break;
                }
            }
        }

        return chosenPlayers;
    }

    sortSquads(): Array<Map<string,PlayerRedux>> {
        const squads = [new Map(), new Map()];

        // mixed but no aleatory order of sorting.
        const sequenceOfSort = config.hasToSort.sort( () => Math.random() - .9 );

        for(const pos of sequenceOfSort) {
            let players = this.getTwoBalancedPlayersByPos(pos);

            for(const index in players)
                if(squads[index].get(pos) == undefined)
                    squads[index].set( pos, [players[index]] );
                else
                    squads[index].set( pos, squads[index].get(pos).concat( [players[index]] ) );
        }

        return squads;
    }
};