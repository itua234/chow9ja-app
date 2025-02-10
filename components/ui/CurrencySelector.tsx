import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import Flag from 'react-native-flags';

type PickerType  = {
    onPress: () => void;
    selectedCurrency: string;
    selectedCountry : CountryCode;
}
type CountryCode = 'US' | 'GB' | 'EU' | 'JP' | 'CN' | 'KR' | 'IN' | 'CA' | 'AU';

// If using Expo, we can use expo-flag-icons or create a simple flag component
const FlagEmoji = ({ 
    country 
}: {country: CountryCode}) => {
    const flagEmojis: Record<CountryCode, string> = {
        'US': '🇺🇸',
        'GB': '🇬🇧',
        'EU': '🇪🇺',
        'JP': '🇯🇵',
        'CN': '🇨🇳',
        'KR': '🇰🇷',
        'IN': '🇮🇳',
        'CA': '🇨🇦',
        'AU': '🇦🇺'
    };
    return <Text style={styles.flag}>{flagEmojis[country]}</Text>;
};

const CurrencySelector: React.FC<PickerType> = ({
    onPress, 
    selectedCurrency = 'USD', 
    selectedCountry = 'US' 
}) => {
    return (
        <TouchableOpacity 
            style={styles.container} 
            onPress={onPress}
        >
            <View style={styles.content}>
                {/* <Flag 
                    code={selectedCountry}
                    size={24}
                    type="flat"  // or "shiny"
                /> */}
                <FlagEmoji country={selectedCountry} />
                <Text style={styles.currencyText}>{selectedCurrency}</Text>
                <Text style={styles.chevron}>▼</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingVertical: 8,
        //paddingHorizontal: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        width: 100,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center"
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    flag: {
        fontSize: 16,
    },
    currencyText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000000',
    },
    chevron: {
        fontSize: 12,
        color: '#666666',
    },
});

export default CurrencySelector;