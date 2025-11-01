import { ActivityIndicator, Text, View } from "react-native";

export default function Loader() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      {/* Friendly message */}
      <Text className="text-lg font-quicksand-semibold text-dark-100">
        Toud
      </Text>
      {/* Spinning indicator */}
      <ActivityIndicator size="large" color="#F97316" />
    </View>
  );
}
