import React, { useState } from 'react';
import {View, Text, Pressable, Image} from 'react-native';
import {SvgXml} from "react-native-svg";
import {arrow_up} from '../util/svg';
import { 
    Investment  
} from "@/util/types";
import { router } from "expo-router";

const InvestmentCard = ({ data }: {data: Investment}) => {
    return (
        <Pressable onPress={() => {
            router.push({
                pathname: "/investment-data",
                params: { data: JSON.stringify(data) }
            });
        }}>
            <View className="py-[12px] px-[10px] mb-[10px] bg-white flex-1 rounded-[20px]">
                <View className="w-full relative">
                    <Image
                        style={{height: 130, width: "100%"}}
                        source={{uri: "https://docazystor1.blob.core.windows.net/multimedia/1736981694541-pexels-pixabay-259593.jpg"}}
                    />
                    <View className="w-[46px] h-[46px] absolute bg-[#DC9D0B] flex-col items-center justify-center">
                        <Text className="font-primary text-[9px] text-white">Returns</Text>
                        <Text className="font-primary text-[16px] text-white">14%</Text>
                    </View>
                </View>

                <View className="flex-row justify-between mt-[15px]">
                    <View className="flex-col">
                        <Text className="font-primary text-[12px]">4 Bedroom Duplex</Text>
                        <Text className="font-primary text-[16px]">{data.amount.toLocaleString()}</Text>
                    </View>
                    <View className="flex-col">
                        <Text className="font-primary text-[16px]">Ipaja, Lagos State</Text>
                        <Text className="font-primary text-[12px]">Adool Constructions Ltd.</Text>
                    </View>
                </View>
            </View>
        </Pressable>
    );
};

export default InvestmentCard;