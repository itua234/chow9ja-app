import React, { useState } from 'react';
import {View, Text, Pressable, Image, SafeAreaView} from 'react-native';
import {SvgXml} from "react-native-svg";
import {arrow_up} from '../util/svg';
import { AxiosResponse, AxiosError } from 'axios';
import { useLocalSearchParams, router } from "expo-router";
import { send_code, verify_code } from "@/api"
import { 
    Investment  
} from "@/util/types";
import ScreenLayout from '@/components/ui/ScreenLayout';

const InvestmentData = () => {
    const { data } = useLocalSearchParams();
    const investment = data ? JSON.parse(data as string) : [];
    console.log("Investment data", investment);
    return (
        <ScreenLayout className="pt-[10px] bg-[#f3f3f3]">
            <View className="px-[17.5] flex-1">
                <View className="py-[12px] px-[10px] mb-[10px] bg-white flex-1 rounded-[20px]">
                    <View className="w-full">
                        <Image
                            style={{height: 130, width: "100%"}}
                            source={{uri: "https://docazystor1.blob.core.windows.net/multimedia/1736981694541-pexels-pixabay-259593.jpg"}}
                        />
                    </View>
                    <View className="flex-row justify-between mt-[15px]">
                        <View className="flex-col">
                            <Text className="font-primary text-[12px]">4 Bedroom Duplex</Text>
                            <Text className="font-primary text-[16px]">60,000</Text>
                        </View>
                        <View className="flex-col">
                            <Text className="font-primary text-[16px]">Ipaja, Lagos State</Text>
                            <Text className="font-primary text-[12px]">Adool Constructions Ltd.</Text>
                        </View>
                    </View>
                    <View className="mt-[20px] pt-[10px] bg-[#DC9D0B]">

                        <View className="flex-row justify-center">
                            <View className="mr-[10px]">
                                <Text className="font-primary text-[10px] text-white">Acres</Text>
                                <Text className="font-primary text-[16px] text-white">0.76</Text>
                            </View>
                            <View className="mr-[10px]">
                                <Text className="font-primary text-[10px] text-white">Sq FT</Text>
                                <Text className="font-primary text-[16px] text-white">1,567</Text>
                            </View>
                            <View className="mr-[10px]">
                                <Text className="font-primary text-[10px] text-white">Bedrooms</Text>
                                <Text className="font-primary text-[16px] text-white">6</Text>
                            </View>
                            <View className="">
                                <Text className="font-primary text-[10px] text-white">Type</Text>
                                <Text className="font-primary text-[16px] text-white">456</Text>
                            </View>
                        </View>

                        <View className=" flex-1 flex-row items-center justify-center mt-[10px]">
                            <Text className="font-primary text-[12px] text-white">Build</Text>
                            <View className="flex-row h-[5px] w-[150px] mx-[10px] bg-white rounded-r-[5px] rounded-l-[5px]">
                                <View className="h-full w-[80%] bg-[#1B2C36]  rounded-r-[5px] rounded-l-[5px]"></View>
                            </View>
                            <Text className="font-primary text-[12px] text-white">80%</Text>
                        </View>
                        <View className=" flex-1 flex-row items-center justify-center mt-[10px]">
                            <Text className="font-primary text-[12px] text-white">Electricity</Text>
                            <View className="flex-row h-[5px] w-[150px] mx-[10px] bg-white rounded-r-[5px] rounded-l-[5px]">
                                <View className="h-full w-[80%] bg-[#1B2C36]  rounded-r-[5px] rounded-l-[5px]"></View>
                            </View>
                            <Text className="font-primary text-[12px] text-white">100%</Text>
                        </View>


                    </View>
                </View>
            </View>
        </ScreenLayout>
    );
};

export default InvestmentData;