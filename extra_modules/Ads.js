import {BannerAd, BannerAdSize, InterstitialAd, TestIds, AdEventType} from 'react-native-google-mobile-ads';
import { View } from "react-native";
import { useState } from 'react';

import * as ids from '../IDs.json'

const bannerID = ids.bannerAdID!=="" ? ids.bannerAdID : TestIds.BANNER;
const intersticialID = ids.intersticialAdID!=="" ? ids.intersticialAdID : TestIds.INTERSTITIAL;

const interstitial = InterstitialAd.createForAdRequest(intersticialID, {
    requestNonPersonalizedAdsOnly: false,
    keywords: ['soccer', 'sports', 'football'],
});
interstitial.load();

export const showInterstitial = (onCloseProcedure) => {
    //shows already loaded add.
    if(interstitial.loaded)
        interstitial.show({
            immersiveModeEnabled: true,
        });

    // if there wasn't a add loaded, create a request and show it.
    else {
        interstitial.load();
        interstitial.addAdEventListener(AdEventType.LOADED, () => {
            interstitial.show({
                immersiveModeEnabled: true,
            });
        });
    }
        
    // removing listeners, loading the possible next add and calling the parameter procedure. 
    interstitial.addAdEventListener(AdEventType.CLOSED, () => {
        onCloseProcedure();
        interstitial.load();

        interstitial.removeAllListeners();
    });

    interstitial.addAdEventListener(AdEventType.ERROR, () => {
        onCloseProcedure();
        interstitial.load();

        interstitial.removeAllListeners();
    });
};

export const BannerAdReady = ( {props} ) => {
    // avoid constant retry to get add.
    const [failed, setFailed] = useState(false);

    if(failed)
        return <View></View>;

    return (
        <View
        style={props.style}>
            <BannerAd
            unitId={bannerID}
            size={BannerAdSize.BANNER}
            requestOptions={{
                requestNonPersonalizedAdsOnly: false,
                keywords: ['sports', 'soccer', 'football'],
            }}
            onAdFailedToLoad={ () => setFailed(true) }
            />
        </View>
    );
};