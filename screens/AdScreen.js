import { StyleSheet, ImageBackground, View, Text, Pressable } from "react-native";
import { useEffect, useState } from "react";

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { FontAwesome } from '@expo/vector-icons';

import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';

import { BackHandler } from "react-native";

import * as ids from '../IDs.json'

const bannerID = ids.bannerAdID!=="" ? ids.bannerAdID : TestIds.BANNER; 

const Stack = createNativeStackNavigator();

const Timer = ( {props} ) => {
    const [time, setTime] = useState(props.timeMs/1000);

    useEffect( () => {
        if(time < 1) return

        setTimeout( ()=> {
            setTime(time-1);
        }, 1000);
    },[time]);

    return (
        <Text>
            {time!=0 ? String(Math.floor(time))+"s" : ""}
        </Text>
    );
}

const BannerAdReady = ( {props} ) => {
    return (
        <BannerAd
        unitId={bannerID}
        size={BannerAdSize.BANNER}
        requestOptions={{
            requestNonPersonalizedAdsOnly: true,
        }}
        onAdFailedToLoad={(err) => props.onError(err)}
        onAdLoaded={props.onLoad}
        />
    );
}

export const AdScreen = ( {navigation, route} ) => {
    const nav = useNavigation();

    const adTimeMs = 3000;

    useEffect( () => {
        const handleBackButton = () => true;

        const blockGoBack = () => {
            BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        };
        
        blockGoBack();

        setTimeout( () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
            
            navigation.setOptions( {
                headerLeft: () => (
                    <Pressable 
                    onPress={nav.goBack}
                    style={{width: 30, height: 30, alignItems: 'center'}}>
                        <FontAwesome name="close" size={30} color="rgba(220,0,0,.85)"/>
                    </Pressable>
                )
            } );

        }, adTimeMs);

        navigation.setOptions( {
            headerRight: () => <Timer props={{timeMs: adTimeMs}}/>
        } );
    }, []);
 
    return (
        <ImageBackground
        source={require('../assets/imgs/ads_background.jpg')}
        imageStyle={{flex: 1, opacity: .5}}
        style={styles.container}>            
            <BannerAdReady props={{onLoad: null, onError: (err)=> console.log(err)}}/>

        </ImageBackground>
    );
}

const styles = StyleSheet.create( {
    container: {
        flex: 1,
        alignItems: 'center',

        backgroundColor: 'rgba(0,0,0, .8)',
    },

    bannerAdTop: {
        marginTop: '1%',
    },

    bannerAdBottom: {
        marginBottom: '1%',
    }
} );