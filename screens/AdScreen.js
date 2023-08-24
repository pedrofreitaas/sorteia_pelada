import { StyleSheet, View, Text } from "react-native";

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import { useNavigation } from '@react-navigation/native';

import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';

import * as ids from '../IDs.json'

const bannerID = ids.bannerAdID ? ids.bannerAdID : TestIds.BANNER; 

const Stack = createNativeStackNavigator();

export const AdScreen = ( {navigation, route} ) => {
    return (
        <View
        style={styles.container}>
            
            <BannerAd
            unitId={bannerID}
            size={BannerAdSize.LEADERBOARD}
            requestOptions={{
                requestNonPersonalizedAdsOnly: true,
            }}
            onAdFailedToLoad={(err)=> {
                console.log('failed to load banner ad.', err);
            }}
            onAdOpened={() => {
                console.log('banner ad opened.');
            }}
            />

        </View>
    );
}

const styles = StyleSheet.create( {
    container: {
        flex: 1,
    },

    main_text: {
        top: '50%',
    }
} );