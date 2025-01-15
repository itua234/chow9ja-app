import React, { useState } from 'react';
import {View, Text, Pressable, Image} from 'react-native';
import {SvgXml} from "react-native-svg";
import {arrow_up, arrow_down} from '../util/svg';
import { 
    Investment  
} from "@/util/types";

const InvestmentCard = ({ data }: {data: Investment}) => {
    return (
        <Pressable onPress={() => {console.log("Card clicked", data);}}>
            <View className="p-[8px] pr-[10px] mb-[10px] bg-white flex flex-row items-center border-2 border-[#89ABD9] rounded-[10px]">
                <View className="">
                    <Image
                        style={{height: 115, width: 115, borderRadius: 10}}
                        source={{uri: "https://res.cloudinary.com/capital-votes/image/upload/v1740639662/vvdkjh8futiuvfndoqep.png"}}
                    />
                </View>
                <View className="flex flex-1 flex-col ml-4 h-full min-h-[120px] justify-between">
                    <View className="flex flex-row">
                        <Text numberOfLines={2} className="mr-2 text-[16px] font-primary flex-1">{data.name}</Text>
                        <View>
                            {
                                data.status == "active" ?
                                <Text className="font-primary text-[12px] shrink-0 bg-[gray] text-[green] py-[5px] px-[7px] rounded-[20px]">Invest Now</Text> :
                                <Text className="font-primary text-[12px] shrink-0 bg-[red] py-[5px] px-[7px] rounded-[20px]">Sold out</Text>
                            }
                        </View>
                    </View>
                    <Text className="font-primary text-[15px]">{data.returns}% {data.duration == 12 ? "p.a expected returns" : "returns in "+data.duration+" months"} </Text>
                    <View className="flex-row justify-between">
                        <View className="flex-col">
                            <Text className="font-primary text-[16px]">{data.amount.toLocaleString()}</Text>
                            <Text className="font-primary text-[12px]">at last trade</Text>
                        </View>
                        <View className="flex-col">
                            <Text className="font-primary text-[16px]">11,241</Text>
                            <Text className="font-primary text-[12px]">Investors</Text>
                        </View>
                    </View>
                </View>
            </View>
        </Pressable>
    );
};

export default InvestmentCard;