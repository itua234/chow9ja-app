import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { 
  Modal, 
  View, 
  FlatList,
  TouchableOpacity, 
  Text, 
  TextInput,
  StatusBar,
  Platform,
  SafeAreaView,
  Dimensions, 
  StyleSheet
} from 'react-native';
import {SafeAreaProvider, useSafeAreaInsets} from 'react-native-safe-area-context';
import {SvgXml} from "react-native-svg";
import {arrow_down, cancel} from '../../util/svg';
import RBSheet from "react-native-raw-bottom-sheet";

type PickerType  = {
    title: string,
    data: any[],
    onSelect: (item: any) => void;
    displayKey?: string;
    searchPlaceholder?: string;
    renderItem?: (item: any) => JSX.Element;
    searchKeys: string[];
}
// Export the ref type to use when referencing this component
type PhonePickerRef = {
    open: () => void;
    close: () => void;
}
const PhonePicker = forwardRef<PhonePickerRef, PickerType>(({
    title,
    data,
    onSelect,
    displayKey = 'name',
    searchPlaceholder = 'Search...',
    renderItem,
    searchKeys = ['name'],
}, ref) => {
    const [searchQuery, setSearchQuery] = useState('');
    const insets = useSafeAreaInsets();
    const refRBSheet = useRef<any>(null);
    const screenHeight = Dimensions.get('window').height;

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
        open: () => {
            refRBSheet.current?.open();
        },
        close: () => {
            refRBSheet.current?.close();
        }
    }));
    
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
        <RBSheet
            ref={refRBSheet}
            closeOnPressBack={true}
            closeOnPressMask={true}
            draggable={true}
            openDuration={200}
            height={screenHeight - 100}
            customStyles={styles.bottomSheet}
        >
            <View className="px-7 flex-1">
                
                {filteredData.length === 0 ? (
                    <View className="py-8 px-5">
                        <Text className="
                            text-gray-500 
                            text-center 
                            font-primary
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
                                    refRBSheet.current?.close();
                                    //setModalVisible(false);
                                }}
                                className="flex-row items-center px-[15px] mt-[0px] border-b-[2px] border-[#EDF1F3] py-[15px] active:bg-gray-50"
                            >
                                {renderItem ? renderItem(item) : defaultRenderItem(item)}
                            </TouchableOpacity>
                        )}
                    />
                )}
            </View>
        </RBSheet>
    );
});

export default PhonePicker;

const styles = StyleSheet.create({
    bottomSheet: {
        wrapper: { backgroundColor: "rgba(74, 74, 75, 0.8)" },
        draggableIcon: { backgroundColor: "#F1F1F1", width: 50 },
        container: {
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            backgroundColor: "white"
        }
    }
} as any);       