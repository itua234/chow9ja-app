import React, { useState } from 'react';
import {View, Text, Pressable} from 'react-native';
import {SvgXml} from "react-native-svg";
import {arrow_up, arrow_down} from '../util/svg';
import { 
    Transaction  
} from "@/util/types";

interface TransactionCardProps {
    data: Transaction;
}
const TransactionCard: React.FC<TransactionCardProps> = ({ data }) => {
    const formatDate = (timestamp: string | number): string => {
        const date = new Date(timestamp);
        const dateStr = date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric'
        });
        
        const timeStr = date.toLocaleString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        }).toLowerCase();
        
        return dateStr+" . "+timeStr;
    };
    return (
        <Pressable onPress={() => {console.log("Transaction clicked", data);}}>
            <View className="p-4 mb-[10px] bg-white flex flex-row items-center justify-between border-0 rounded-[20px]">
                <View className="flex flex-row items-center space-x-2">
                    <View className={`w-[40px] h-[40px] mr-[10px] rounded-full flex items-center justify-center ${data.type === 'DEBIT' ? 'bg-[#fff0ed]' : 'bg-[#dae8f5]'}`}>
                    {
                        data.type === 'DEBIT'
                        ? <SvgXml xml={arrow_up} width="24" height="24"></SvgXml>
                        : <SvgXml xml={arrow_down} width="24" height="24"></SvgXml>
                    }
                    </View>
                    <View>
                        {
                            data.type === 'DEBIT'
                            ? <Text className="font-primary text-[17px]">{data.receiver.firstname} {data.receiver.lastname}</Text>
                            : <Text className="font-primary text-[17px]">{data.sender.firstname} {data.sender.lastname}</Text>
                        }
                        <Text className="text-[13px] font-primary text-[gray]">{formatDate(data.createdAt)}</Text>
                    </View>
                </View>
                <View className="space-y-1 flex-column items-end">
                    <Text className="font-primary text-[17px] font-semibold">${data.amount.toLocaleString()}</Text>
                    {/* <Text className="text-[13px] font-primary text-[gray]">{data.type === "CREDIT" ? "Sent" : "Received"}</Text> */}
                    <View className={`px-2 py-1 rounded-md ${
                        data.status == 'SUCCESSFUL' ? 'bg-[#DCFCE7]' :
                        data.status == 'PENDING' ? 'bg-[#FEF9C3]' :
                        data.status == 'REVERSED' ? 'bg-[#FEF9C3]' :
                        data.status == 'FAILED' ? 'bg-[#FEE2E2]' : 'bg-gray-100'
                    }`}>
                        <Text className={`text-xs font-medium capitalize ${
                            data.status == 'SUCCESSFUL' ? 'text-[#166534]' :
                            data.status == 'PENDING' ? 'text-[#854D0E]' :
                            data.status == 'REVERSED' ? 'text-[#854D0E]' :
                            data.status == 'FAILED' ? 'text-[#991B1B]' : 'text-gray-700'
                        }`}>
                            {data.status}
                        </Text>
                    </View>
                </View>
            </View>
        </Pressable>
    );
};

export default TransactionCard;