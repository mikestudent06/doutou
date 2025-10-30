import AppFeatures from "@/components/welcome/AppFeatures";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function OnboardingFeatures() {
  return (
    <View className="flex-1 bg-white">
      <View className="flex-1">
        <AppFeatures />
      </View>
      <View className="px-6 pb-10">
        <Pressable
          className="bg-primary px-6 py-3 rounded-full items-center"
          onPress={() => router.push("/(onboarding)/get-started")}
        >
          <Text className="text-white font-quicksand-bold">Next</Text>
        </Pressable>
      </View>
    </View>
  );
}
