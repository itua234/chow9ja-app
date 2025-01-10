import React, { useMemo, useState } from 'react';
import { 
  Modal, 
  View, 
  ScrollView, FlatList,
  TouchableOpacity, 
  Text, 
  TextInput,
  StatusBar,
  Platform
} from 'react-native';
import {SafeAreaView, SafeAreaProvider, useSafeAreaInsets} from 'react-native-safe-area-context';
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
    const insets = useSafeAreaInsets();
    
    // Filter data based on search query
    const filteredData = useMemo(() => {
        return data.filter(item =>
            searchKeys.some(key =>
                String(item[key]).toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [data, searchQuery, searchKeys]);
    // const filteredData = data.filter(item =>
    //     searchKeys.some(key =>
    //         String(item[key]).toLowerCase().includes(searchQuery.toLowerCase())
    //     )
    // );

    const defaultRenderItem = (item: any) => (
        <Text className="text-[#6C7278] font-primary text-[16px]">
            {item[displayKey].toUpperCase()}
        </Text>
    );

    return (
        <SafeAreaProvider>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(!modalVisible)}
            >
                <View className="flex-1 bg-white"
                style={{
                    // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : insets.top,
                    // paddingBottom: insets.bottom,
                }}>
                    <StatusBar
                        animated={true}
                        translucent
                        backgroundColor="white"
                        networkActivityIndicatorVisible={true}
                    />
                    <SafeAreaView className="flex-1 bg-white">
                        <View className="
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
                </View>
            </Modal>
            </SafeAreaProvider>
    );
};

export default CustomPicker;