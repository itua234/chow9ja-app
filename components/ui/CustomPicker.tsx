import React, { useState } from 'react';
import { 
  Modal, 
  SafeAreaView, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Text, 
  TextInput 
} from 'react-native';
import {SvgXml} from "react-native-svg";
import {cancel} from '../../util/svg';

type PickerType  = {
    modalVisible: boolean,
    animationType?: string,
    setModalVisible: (value: boolean) => void;
    data: { [key: string]: string }[];
    onSelect: (item: any) => void;
    displayKey?: string;
    searchPlaceholder? : string;
    renderItem?: (item: any) => JSX.Element;
    searchKeys: string[];
}
const CustomPicker: React.FC<PickerType> = ({
    modalVisible,
    animationType,
    setModalVisible,
    data,                    // Array of items to display
    onSelect,               // Callback function when item is selected
    displayKey = 'name',    // Key to display in the list (default: 'name')
    searchPlaceholder = 'Search...',  // Customizable placeholder text
    renderItem,            // Optional custom render function for items
    searchKeys = ['name'],
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    // Filter data based on search query
    const filteredData = data.filter(item =>
        searchKeys.some(key =>
            String(item[key]).toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const defaultRenderItem = (item: any) => (
        <Text className="text-[#6C7278] font-primary text-[16px]">
            {item[displayKey].toUpperCase()}
        </Text>
    );

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}
        >
            <View className="flex-1 bg-white">
                <SafeAreaView className="
                    flex-1 
                    shadow-lg 
                    shadow-black/10 
                    bg-white 
                    rounded-xl 
                    elevation-1
                    ios:shadow-[0_4px_35px_rgba(0,0,0,0.1)]
                ">
                    <View className="px-[15px] py-[15px] flex-row ">
                        <View className="flex-1 justify-center">
                            <Text className="text-[#6C7278] font-primary text-[16px]">
                                Select a Bank
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <SvgXml xml={cancel} width="27" height="27" />
                        </TouchableOpacity>
                    </View>
                    <View className="px-[15px]">
                        <View className="flex-row items-center border-2 border-[#EDF1F3] rounded-md">
                            <TextInput
                            className="
                                flex-1
                                py-5
                                px-[20px]
                                font-primary
                                text-[16px]
                                text-[#1A1C1E]
                            "
                            placeholder={searchPlaceholder}
                            placeholderTextColor="#6C7278"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            clearButtonMode="while-editing"
                            />
                        </View>
                    </View>
                    <ScrollView className="flex-1 h-auto bg-white">
                        {filteredData.map((item, index) => (
                            <TouchableOpacity 
                                onPress={() => {
                                    onSelect(item);
                                    setSearchQuery("");
                                    setModalVisible(false);
                                }}
                                key={index} 
                                className="flex-row items-center px-[15px] mt-[0px] border-b-[2px] border-[#EDF1F3] py-[15px]"
                            >
                                {renderItem ? renderItem(item) : defaultRenderItem(item)}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </SafeAreaView>
            </View>
        </Modal>
    );
};

export default CustomPicker;