import {BannerAd, BannerAdSize, InterstitialAd, TestIds, AdEventType} from 'react-native-google-mobile-ads';
import { View } from "react-native";

import * as ids from '../IDs.json'

const bannerID = ids.bannerAdID!=="" ? ids.bannerAdID : TestIds.BANNER;
const intersticialID = ids.intersticialAdID!=="" ? ids.intersticialAdID : TestIds.INTERSTITIAL;

const interstitial = InterstitialAd.createForAdRequest(intersticialID, {
    requestNonPersonalizedAdsOnly: true,
    keywords: ['soccer', 'sports'],
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
};

export const BannerAdReady = ( {props} ) => {
    return (
        <View
        style={props.style}>
            <BannerAd
            unitId={bannerID}
            size={BannerAdSize.BANNER}
            requestOptions={{
                requestNonPersonalizedAdsOnly: true,
                keywords: ['sports', 'soccer'],
            }}
            onAdFailedToLoad={(err) => props.onError(err)}
            
            onAdLoaded={props.onLoad}
            />
        </View>
    );
};