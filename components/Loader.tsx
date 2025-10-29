import { images } from "@/constants";
import { ActivityIndicator, Image, Text, View } from "react-native";

export default function Loader() {
  return (
    <View className="flex-1 flex-center bg-white">
      <Image
        source={images.logo}
        className="w-28 h-28 mb-6"
        resizeMode="contain"
      />

      {/* Spinning indicator */}
      <ActivityIndicator size="large" color="#F97316" />

      {/* Friendly message */}
      <Text className="mt-4 text-lg font-quicksand-semibold text-dark-100">
        Preparing your delicious meals...
      </Text>
    </View>
  );
}
