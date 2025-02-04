// import React, { useState, useEffect } from 'react';
// import { Text, View, 
//     SafeAreaView, ScrollView, TextInput, Image, Keyboard,
//     KeyboardAvoidingView, TouchableOpacity,
//     Platform, Pressable, StatusBar } from 'react-native';
// import {SvgXml} from "react-native-svg";
// import {logo} from '@/util/svg';
// import PrimaryButton from "@/components/PrimaryButton";
// import CustomInput from "@/components/CustomInput";
// import CustomPicker from "@/components/ui/CustomPicker"
// import {register, get_flags} from "../services/api"
// import { AxiosResponse, AxiosError } from 'axios';
// import {router} from "expo-router";
// import * as Haptics from 'expo-haptics';
// import { 
//     Country
// } from "@/util/types";
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState, AppDispatch } from '@/reducers/store';
// import { setInput, setError, clearErrors, setApiErrors, setInputAndValidate, resetForm } from '@/reducers/form/formSlice';

// const Signup = () => {
//     const inputs = useSelector((state: RootState) => state.form.inputs);
//     const errors = useSelector((state: RootState) => state.form.errors);
//     const dispatch = useDispatch<AppDispatch>();
//     useEffect(() => {
//         dispatch(resetForm()); // Reset form state when component mounts
//         return () => {
//             dispatch(resetForm()); // Reset form state when component unmounts
//         };
//     }, [dispatch]);

//     const [msg, setMsg] = useState<string>('');
//     const [isLoading, setLoading] = useState<boolean>(false);

//     const [callingCode, setCallingCode] = useState<string>('+234');
//     const [flagUrl, setFlagUrl] = useState<string>('https://flagcdn.com/w320/ng.png'); // Default flag
//     const [showCountryPicker, setShowCountryPicker] = useState<boolean>(false);
//     const [countries, setCountries] = useState([]);
 
//     const onSelectCountry = (country: Country) => {
//         const flagUrl = `https://flagcdn.com/w320/${country.code.toLowerCase()}.png`;
//         setFlagUrl(flagUrl);
//         setCallingCode(country.dial_code);
//         dispatch(setInput({ field: 'phone', value: '' }));
//     };

//     // Custom render function for countries
//     const renderCountry = (country: Country) => (
//         <>
//             <Image className="w-[32px] h-[32px] rounded-full mr-[10px]"
//                 source={{uri: `https://flagcdn.com/w320/${country.code.toLowerCase()}.png`}}
//             />
//             <Text className="text-[#6C7278] font-primary text-[16px]">
//                 {country.name.toUpperCase()}
//             </Text>
//             <Text className="text-[#6C7278] font-primary text-[16px] ml-[10px]">{country.dial_code}</Text>
//         </>
//     );

//     useEffect(() => {
//         const fetchCountries = async () => {
//             const response = await get_flags();
//             setCountries(response?.data);
//         };
//         fetchCountries();
//     }, []);

//     const handleInputs = (name: string) => {
//         return (value: string) => {
//             const rules = {
//                 [name]: name === 'email' 
//                     ? 'required|email' 
//                     : name === 'phone'
//                     ? 'required|number|min:10'
//                     : name === 'password'
//                     ? 'required|min:8|number|special'
//                     : 'required'
//             };
//             dispatch(setInputAndValidate({field: name, value, rules}));
//         };
//     };
//     const handleErrors = (error: string, input: string) => {
//         dispatch(setError({field: input, error }));
//     }
//     const handleMessage = (message: string) => setMsg(message);

//     const Signup = async () => {
//         // router.push({
//         //     pathname: "/verify-email",
//         //     params: {email: "ituaosemeilu234@gmail.com"}
//         // });
//         const payload = { ...inputs };  // Creates a deep copy of the inputs object
//         if (inputs.phone && inputs.phone.trim() !== "") {
//             payload.phone = callingCode + inputs.phone;
//         }
//         Keyboard.dismiss();
//         setLoading(true);
//         dispatch(clearErrors());
//         handleMessage('');
//         setTimeout(() => {
//             register(payload)
//             .then(async (res: AxiosResponse) => {
//                 //setLoading(false);
//                 //console.log(res.data?.results);
//                 router.push({
//                     pathname: "/verify-email",
//                     params: {email: res.data?.results}
//                 });
//             }).catch((error: AxiosError<any>) => {
//                 dispatch(clearErrors());
//                 handleMessage('');
//                 setLoading(false); 
//                 if (error.response) {
//                     let errors = error.response.data.error;
//                     dispatch(setApiErrors(errors));
//                     if (error.response.status === 400 || error.response.status === 401) {
//                         handleMessage(error.response.data.message);
//                     }
//                 }
//             })
//         }, 100); // Delay submission 
//     }

//     return (
//         <SafeAreaView className="flex-1 bg-white pt-[20px]">
//             <StatusBar
//                 animated={false}
//                 backgroundColor="#fff"
//                 networkActivityIndicatorVisible={true}
//                 hidden={false}
//                 barStyle="dark-content"
//                 translucent={false}
//             />
//             <KeyboardAvoidingView 
//                 behavior={Platform.OS === "ios" ? "padding" : "height"}
//                 className="flex-1"
//             >
//                 <ScrollView 
//                     contentContainerStyle={{ 
//                         flexGrow: 1, 
//                         justifyContent: 'space-between' 
//                     }}
//                     keyboardShouldPersistTaps="handled"
//                 >
//                     <View className="px-[17.5] flex-1">
//                         <SvgXml xml={logo} width="101" height="40"></SvgXml>
//                         <View className="mb-30">
//                             <Text className="text-[30px] font-primary font-bold text-[#2A0944] mb-2.5">Sign up</Text>
//                             <Text className="font-primary text-[#6C7278]">Create an account to continue.</Text>
//                         </View>
//                         <Text className="text-[16px] text-red-500 mb-2.5 font-primary text-center">{msg}</Text>

//                         <View className="flex-1">
//                             <CustomInput 
//                                 label="First Name"
//                                 type="text"
//                                 value={inputs.firstname}
//                                 onChangeText={handleInputs("firstname")}
//                                 placeholder="Enter your firstname"
//                                 error={errors.firstname}
//                             />
                        
//                             <CustomInput 
//                                 label="Last Name"
//                                 type="text"
//                                 value={inputs.lastname}
//                                 onChangeText={handleInputs("lastname")}
//                                 placeholder="Enter your lastname"
//                                 error={errors.lastname}
//                             />

//                             <CustomInput 
//                                 label="Email"
//                                 type="email"
//                                 value={inputs.email}
//                                 onChangeText={handleInputs("email")}
//                                 placeholder="Enter your email"
//                                 error={errors.email}
//                             />
                            
//                             <View className="">
//                                 <Text className="mb-2 mt-[7.5px] font-primary">Phone Number</Text>
//                                 <View className={`flex-row items-center border-2 border-[#EDF1F3] rounded-[15px]`}>
//                                     <TouchableOpacity 
//                                         className="flex-row items-center justify-center w-[110px] h-full border-r border-[#EDF1F3] "
//                                         onPress={async () => {
//                                             await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
//                                             setShowCountryPicker(!showCountryPicker)
//                                         }}
//                                     >
//                                         <View className="flex-row items-center">
//                                             <Image className="w-[30px] h-[30px] rounded-full"
//                                                 source={{
//                                                     uri: flagUrl,
//                                                 }}
//                                             />
//                                             <Text className="text-[18px] font-primary ml-[10px]">{callingCode}</Text>
//                                         </View>
//                                     </TouchableOpacity>
//                                     <TextInput
//                                         className="flex-1 py-5 px-[15px] font-primary text-[#1A1C1E] text-[16px]"
//                                         placeholder="Enter your phone"
//                                         placeholderTextColor={"#6C7278"}
//                                         value={inputs.phone}
//                                         onChangeText={handleInputs("phone")}
//                                         inputMode='tel'
//                                         keyboardType='phone-pad'
//                                         maxLength={10}
//                                     />
//                                 </View>
//                             </View>
//                             {errors.phone && <Text className="text-[16px] text-red-500 mt-1 font-primary">{errors.phone}</Text>}

//                             <CustomInput 
//                                 label="Password"
//                                 type="password"
//                                 value={inputs.password}
//                                 onChangeText={handleInputs("password")}
//                                 placeholder="Enter your password"
//                                 error={errors.password}
//                             />
                            
//                             <PrimaryButton 
//                                 title="Register"
//                                 isLoading={isLoading} 
//                                 action={Signup}
//                                 disabled={false}
//                             />
//                         </View>

//                         <CustomPicker
//                             modalVisible={showCountryPicker}
//                             animationType="slide"
//                             title="Select a Country"
//                             setModalVisible={setShowCountryPicker}
//                             data={countries}
//                             onSelect={onSelectCountry}
//                             searchPlaceholder="Search country..."
//                             searchKeys={['name', 'code']} // Search by both name and code
//                             //renderItem={renderCountry}
//                             renderItem={countries.length ? renderCountry : () => <Text>Loading...</Text>}
//                         />

//                         <View className="mt-auto pb-4">
//                             <View className="mt-[15px] flex-row justify-center">
//                                 <Text className="font-primary mr-[5px]">Already have an account?</Text>
//                                 <Pressable onPress={() => router.push('/sign-in')}>
//                                     <Text className="font-primary text-primary">Login!</Text>
//                                 </Pressable>
//                             </View>
//                         </View>
                            
//                     </View>
//                 </ScrollView>
//             </KeyboardAvoidingView>
//         </SafeAreaView>
//     );

// }

// export default Signup;

import React, { useState, useEffect, useRef } from 'react';
import { 
    Text, View, SafeAreaView, ScrollView, TextInput, Image, 
    Keyboard, KeyboardAvoidingView, TouchableOpacity,
    Platform, Pressable, StatusBar, Animated, Dimensions
} from 'react-native';
import { SvgXml } from "react-native-svg";
import { logo } from '@/util/svg';
import PrimaryButton from "@/components/PrimaryButton";
import CustomInput from "@/components/CustomInput";
import CustomPicker from "@/components/ui/CustomPicker";
import { register, get_flags } from "../services/api";
import { AxiosResponse, AxiosError } from 'axios';
import { router } from "expo-router";
import * as Haptics from 'expo-haptics';
import { Country } from "@/util/types";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/reducers/store';
import { setInput, setError, clearErrors, setApiErrors, setInputAndValidate, resetForm } from '@/reducers/form/formSlice';

const { width } = Dimensions.get('window');

const StepIndicate = ({ 
    steps, 
    currentStep 
}: {
    steps: string[];
    currentStep: number;
}) => {
    return (
        <View className="w-full max-w-2xl mx-auto">
            <View className="relative flex flex-row justify-between items-center">
                {   /* Connection lines between circles */}
                <View 
                className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200" />
                
                <View
                    className="absolute top-4 left-0 h-0.5 bg-blue-600"
                    style={{
                        width: `${(currentStep / (steps.length - 1)) * 100}%`,
                    }}
                />
                {/* Completed line */}
    
                {/* Step circles and labels */}
                {steps.map((step, index) => {
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;
        
                return (
                    <View key={step} className="relative flex flex-col items-center z-10">
                    <View
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                        isCompleted || isCurrent
                            ? 'border-blue-600 bg-blue-600'
                            : 'border-gray-300 bg-white'
                        }`}
                    >
                        {isCompleted ? (
                        //   <svg 
                        //   className="w-4 h-4 text-white" 
                        //   fill="none" 
                        //   stroke="currentColor" 
                        //   viewBox="0 0 24 24"
                        // >
                        //   <path 
                        //     strokeLinecap="round" 
                        //     strokeLinejoin="round" 
                        //     strokeWidth={2} 
                        //     d="M5 13l4 4L19 7" 
                        //   />
                        // </svg>
                        <Text></Text>
                        ) : (
                        <View
                            className={`w-2 h-2 rounded-full ${
                            isCurrent ? 'bg-white' : 'bg-gray-300'
                            }`}
                        />
                        )}
                    </View>
                    <Text
                        className={`mt-2 text-sm ${
                        isCompleted || isCurrent ? 'text-blue-600' : 'text-gray-500'
                        }`}
                    >
                        {step}
                    </Text>
                    </View>
                );
                })}
            </View>
        </View>
      );
};

const FormStep = ({ 
    children, 
    slideAnim, 
    opacity 
}: { 
    children: React.ReactNode, 
    slideAnim: Animated.Value,
    opacity: Animated.Value
}) => (
    <Animated.View style={{
        transform: [{ translateX: slideAnim }],
        opacity,
        width: '100%',
    }}>
        {children}
    </Animated.View>
);

const StepIndicator = ({ 
    currentStep,
    totalSteps 
}: { 
    currentStep: number,
    totalSteps: number 
}) => (
    <View className="flex-row justify-center items-center mb-6">
        {[...Array(totalSteps)].map((_, index) => (
            <View key={index} className="flex-row items-center">
                <View className={`h-2 w-2 rounded-full ${
                    index === currentStep ? 'bg-primary' : 'bg-gray-300'
                }`} />
                {index < totalSteps - 1 && (
                    <View className="w-4 h-[1px] bg-gray-300" />
                )}
            </View>
        ))}
    </View>
);

const Signup = () => {
    const { 
        inputs, 
        errors
    } = useSelector((state: RootState) => state.form);
    const dispatch = useDispatch<AppDispatch>();
    
    const [currentStep, setCurrentStep] = useState(0);
    const slideAnim = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(1)).current;
    
    const [msg, setMsg] = useState<string>('');
    const [isLoading, setLoading] = useState<boolean>(false);
    const [callingCode, setCallingCode] = useState<string>('+234');
    const [flagUrl, setFlagUrl] = useState<string>('https://flagcdn.com/w320/ng.png');
    const [showCountryPicker, setShowCountryPicker] = useState<boolean>(false);
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        dispatch(resetForm());
        return () => {
            dispatch(resetForm());
        };
    }, [dispatch]);

    useEffect(() => {
        const fetchCountries = async () => {
            const response = await get_flags();
            setCountries(response?.data);
        };
        fetchCountries();
    }, []);

    const animateTransition = (direction: 'forward' | 'backward') => {
        const toValue = direction === 'forward' ? -width : width;
        
        Animated.sequence([
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]),
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    };

    const handleNext = async () => {
        if (currentStep < 2) {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            animateTransition('forward');
            setCurrentStep(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = async () => {
        if (currentStep > 0) {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            animateTransition('backward');
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleInputs = (name: string) => (value: string) => {
        const rules = {
            [name]: name === 'email' 
                ? 'required|email' 
                : name === 'phone'
                ? 'required|number|min:10'
                : name === 'password'
                ? 'required|min:8|number|special'
                : 'required'
        };
        dispatch(setInputAndValidate({field: name, value, rules}));
    };

    const onSelectCountry = (country: Country) => {
        const flagUrl = `https://flagcdn.com/w320/${country.code.toLowerCase()}.png`;
        setFlagUrl(flagUrl);
        setCallingCode(country.dial_code);
        dispatch(setInput({ field: 'phone', value: '' }));
    };

    const handleSubmit = async () => {
        const payload = { ...inputs };
        if (inputs.phone && inputs.phone.trim() !== "") {
            payload.phone = callingCode + inputs.phone;
        }
        
        Keyboard.dismiss();
        setLoading(true);
        dispatch(clearErrors());
        handleMessage('');
        
        try {
            const res = await register(payload);
            router.push({
                pathname: "/verify-email",
                params: { email: res.data?.results }
            });
        } catch (error: any) {
            dispatch(clearErrors());
            handleMessage('');
            setLoading(false);
            
            if (error.response) {
                let errors = error.response.data.error;
                dispatch(setApiErrors(errors));
                if (error.response.status === 400 || error.response.status === 401) {
                    handleMessage(error.response.data.message);
                }
            }
        }
    };

    const handleMessage = (message: string) => setMsg(message);

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <FormStep slideAnim={slideAnim} opacity={opacity}>
                        {/* <Text className="text-[20px] font-primary font-bold mb-6">Personal Information</Text> */}
                        <CustomInput 
                            value={inputs.firstname}
                            onChangeText={handleInputs("firstname")}
                            placeholder="Enter your firstname"
                            error={errors.firstname}
                        />
                        <CustomInput 
                            value={inputs.lastname}
                            onChangeText={handleInputs("lastname")}
                            placeholder="Enter your lastname"
                            error={errors.lastname}
                        />
                        <View>
                            <View className="mb-2 mt-[7.5px]" />
                            <View className="flex-row items-center border-2 border-[#EDF1F3] rounded-[15px]">
                                <TouchableOpacity 
                                    className="flex-row items-center justify-center w-[110px] h-full border-r border-[#EDF1F3]"
                                    onPress={async () => {
                                        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                                        setShowCountryPicker(!showCountryPicker);
                                    }}
                                >
                                    <View className="flex-row items-center">
                                        <Image 
                                            className="w-[30px] h-[30px] rounded-full"
                                            source={{ uri: flagUrl }}
                                        />
                                        <Text className="text-[18px] font-primary ml-[10px]">{callingCode}</Text>
                                    </View>
                                </TouchableOpacity>
                                <TextInput
                                    className="flex-1 py-5 px-[15px] font-primary text-[#1A1C1E] text-[16px]"
                                    placeholder="Enter your phone"
                                    placeholderTextColor="#6C7278"
                                    value={inputs.phone}
                                    onChangeText={handleInputs("phone")}
                                    inputMode="tel"
                                    keyboardType="phone-pad"
                                    maxLength={10}
                                />
                            </View>
                        </View>
                        <CustomInput 
                            value={inputs.gender}
                            onChangeText={handleInputs("gender")}
                            placeholder="Enter your gender"
                            error={errors.gender}
                        />
                        <CustomInput 
                            value={inputs.country}
                            onChangeText={handleInputs("country")}
                            placeholder="Enter your country"
                            error={errors.country}
                        />
                    </FormStep>
                );
            case 1:
                return (
                    <FormStep slideAnim={slideAnim} opacity={opacity}>
                        <Text className="text-[20px] font-primary font-bold mb-6">Contact Information</Text>
                        <CustomInput 
                            label="Email"
                            type="email"
                            value={inputs.email}
                            onChangeText={handleInputs("email")}
                            placeholder="Enter your email"
                            error={errors.email}
                        />
                        
                    </FormStep>
                );
            case 2:
                return (
                    <FormStep slideAnim={slideAnim} opacity={opacity}>
                        <Text className="text-[20px] font-primary font-bold mb-6">Security</Text>
                        <CustomInput 
                            label="Password"
                            type="password"
                            value={inputs.password}
                            onChangeText={handleInputs("password")}
                            placeholder="Enter your password"
                            error={errors.password}
                        />
                    </FormStep>
                );
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white pt-[20px]">
            <StatusBar
                animated={false}
                backgroundColor="#fff"
                barStyle="dark-content"
                translucent={false}
            />
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView 
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="px-[17.5px] flex-1">
                        <SvgXml xml={logo} width="101" height="40" />
                        <View className="mb-8">
                            <Text className="text-[30px] font-primary font-bold text-[#2A0944] mb-2.5">
                                Sign up
                            </Text>
                            <Text className="font-primary text-[#6C7278]">
                                Create an account to continue.
                            </Text>
                        </View>

                        {msg ? (
                            <Text className="text-[16px] text-red-500 mb-2.5 font-primary text-center">
                                {msg}
                            </Text>
                        ) : null}

                        <StepIndicator currentStep={currentStep} totalSteps={3} />
                        
                        <View className="flex-1">
                            {renderStep()}
                            
                            <View className="flex-row justify-between mt-8">
                                {currentStep > 0 ? (
                                    <TouchableOpacity
                                        className="px-[15px] py-5 border border-primary rounded-[15px] mt-5"
                                        onPress={handleBack}
                                    >
                                        <Text className="text-primary font-primary">Back</Text>
                                    </TouchableOpacity>
                                ) : <View />}
                                
                                <PrimaryButton 
                                    title={currentStep === 2 ? "Register" : "Next"}
                                    isLoading={isLoading}
                                    action={handleNext}
                                    disabled={false}
                                />
                            </View>
                        </View>

                        <CustomPicker
                            modalVisible={showCountryPicker}
                            animationType="slide"
                            title="Select a Country"
                            setModalVisible={setShowCountryPicker}
                            data={countries}
                            onSelect={onSelectCountry}
                            searchPlaceholder="Search country..."
                            searchKeys={['name', 'code']}
                            renderItem={countries.length ? (country: Country) => (
                                <>
                                    <Image 
                                        className="w-[32px] h-[32px] rounded-full mr-[10px]"
                                        source={{
                                            uri: `https://flagcdn.com/w320/${country.code.toLowerCase()}.png`
                                        }}
                                    />
                                    <Text className="text-[#6C7278] font-primary text-[16px]">
                                        {country.name.toUpperCase()}
                                    </Text>
                                    <Text className="text-[#6C7278] font-primary text-[16px] ml-[10px]">
                                        {country.dial_code}
                                    </Text>
                                </>
                            ) : () => <Text>Loading...</Text>}
                        />

                    <StepIndicate steps={[
                        'Next of Kin Details',
                        'Upload Documents',
                        'Under Review'
                    ]} currentStep={0} />

                        <View className="mt-auto pb-4">
                            <View className="mt-[15px] flex-row justify-center">
                                <Text className="font-primary mr-[5px]">
                                    Already have an account?
                                </Text>
                                <Pressable onPress={() => router.push('/sign-in')}>
                                    <Text className="font-primary text-primary">Login!</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Signup;