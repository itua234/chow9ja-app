import React, {useEffect} from "react";
import { Text, View, Pressable, ActivityIndicator, StatusBar } from "react-native";
import {router} from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  useEffect(() => {
    setTimeout(() => {
      router.replace("/splash");
    }, 2000); // Redirect to splash screen after 2 seconds
  }, []);
  return (
    <SafeAreaView>
      <StatusBar
            animated={true}
            backgroundColor="#61dafb"
            barStyle="dark-content" 
            networkActivityIndicatorVisible={true}
            hidden={false}
        />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Edit app/index.tsx to edit this screen.</Text>
        <ActivityIndicator size="large" color="#fff" />
        <Pressable onPress={() => router.push("/sign-in")}>
          <Text>Login</Text>
        </Pressable>
      </View>
      </SafeAreaView>
  );
}