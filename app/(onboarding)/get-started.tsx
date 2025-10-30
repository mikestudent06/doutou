import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function OnboardingDone() {
  return (
    <View className="flex-1 bg-white items-center justify-center px-6 gap-6">
      <Text className="text-2xl font-quicksand-bold text-primary">
        You’re all set!
      </Text>
      <Text className="text-base text-gray-700 text-center">
        Let’s get you to the app.
      </Text>
      <Pressable
        className="bg-primary px-6 py-3 rounded-full"
        onPress={() => router.replace("/(tabs)")}
      >
        <Text className="text-white font-quicksand-bold">Get Started</Text>
      </Pressable>
    </View>
  );
}
