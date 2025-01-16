import React, { useMemo, useState } from 'react';
import { 
  Modal, 
  View, 
  FlatList,
  TouchableOpacity, 
  Text, 
  TextInput,
  StatusBar
} from 'react-native';
import {SafeAreaView, SafeAreaProvider, useSafeAreaInsets} from 'react-native-safe-area-context';
import {SvgXml} from "react-native-svg";
import {cancel} from '../../util/svg';

type PickerType  = {
    title: string,
    modalVisible: boolean,
    animationType?: 'none' | 'slide' | 'fade',
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
    animationType = 'slide',
    title,
    setModalVisible,
    data,                    // Array of items to display
    onSelect,               // Callback function when item is selected
    displayKey = 'name',    // Key to display in the list (default: 'name')
    searchPlaceholder = 'Search...',  // Customizable placeholder text
    renderItem,            // Optional custom render function for items
    searchKeys = ['name'],
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const insets = useSafeAreaInsets();
    
    // Filter data based on search query
    const filteredData = useMemo(() => {
        return data.filter(item =>
            searchKeys.some(key =>
                String(item[key]).toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [data, searchQuery, searchKeys]);

    const defaultRenderItem = (item: any) => (
        <Text className="text-[#6C7278] font-primary text-[16px]">
            {item[displayKey].toUpperCase()}
        </Text>
    );

    return (
        <SafeAreaProvider>
            <Modal
                animationType={animationType}
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(!modalVisible)}
            >
                <SafeAreaView className="flex-1 bg-white">
                    <StatusBar
                        animated={false}
                        backgroundColor="#fff"
                        networkActivityIndicatorVisible={true}
                        hidden={false}
                        barStyle="dark-content"
                        translucent={false}
                    />
                    <View className="flex-1 bg-white">
                        <View className="px-[15px] pb-[15px] flex-row ">
                            <View className="flex-1 justify-center">
                                <Text className="text-[#6C7278] font-primary text-[16px]">
                                    {title}
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
                        {filteredData.length === 0 ? (
                            <View className="py-8 px-5">
                                <Text className="
                                    text-gray-500 
                                    text-center 
                                    text-base
                                ">
                                    No results found
                                </Text>
                            </View>
                        ) : (
                            <FlatList
                                data={filteredData}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity 
                                        onPress={() => {
                                            onSelect(item);
                                            setSearchQuery("");
                                            setModalVisible(false);
                                        }}
                                        className="flex-row items-center px-[15px] mt-[0px] border-b-[2px] border-[#EDF1F3] py-[15px] active:bg-gray-50"
                                    >
                                        {renderItem ? renderItem(item) : defaultRenderItem(item)}
                                    </TouchableOpacity>
                                )}
                            />
                        )}
                    </View>
                </SafeAreaView>
            </Modal>
        </SafeAreaProvider>
    );
};

export default CustomPicker;