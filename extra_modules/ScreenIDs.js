import { useEffect, useState } from "react";
import { BackHandler } from 'react-native'

export class ScreenIDs{
    constructor() {
        const [IDS, updMethod] = useState([]);

        this._IDS = IDS;
        this._updMethod = (value) => {updMethod(value)};
    };

    get currID() {
        return this._IDS[this._IDS.length-1];
    };

    set currID(id) {
        this._updMethod( [...this._IDS, id] );
    };

    allIDs() {
        return this._IDS.copyWithin();
    };

    goBack() {
        this._updMethod( this._IDS.slice(0, this._IDS.length-2) );
    };

    goBackHardwareEventTrigger(){
        useEffect(() => {
            const backHandler = BackHandler.addEventListener(
              'hardwareBackPress',
              () => {
                this.goBack();
                return true;
              },
            );
            return () => backHandler.remove();
          }, []);
    };
}