import Realm from "realm";
 Realm.flags.THROW_ON_GLOBAL_REALM = true;
import {createRealmContext} from '@realm/react';

// Define your object model
export class Player extends Realm.Object<Player> {
  _id!: Realm.BSON.ObjectId;
  name!: string;

  static schema = {
    name: 'Player',
    properties: {
      _id: 'objectId',
      name: 'string',
      pos: 'string',
      rating: 'float',
      imgURI: 'string',
      available: 'bool',
      presences: 'int', gols: 'int', assists: 'int',
    },
    primaryKey: '_id',
  };
}

// Create a configuration object
const realmConfig: Realm.Configuration = {
  schema: [Player],
};

// Create a realm context
export const {RealmProvider, useRealm, useObject, useQuery} = createRealmContext(realmConfig);

export const getPlayer = (name: string) => {
    const players = useQuery(Player);

    return players.filter( pl => pl.name === name );
};
