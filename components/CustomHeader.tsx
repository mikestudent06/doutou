import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { images } from "@/constants";
import { CustomHeaderProps } from "@/type";

const CustomHeader = ({ title, showBackButton = false }: CustomHeaderProps) => {
  const router = useRouter();

  return (
    <View className="custom-header">
      {showBackButton ? (
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={images.arrowBack}
            className="size-5"
            resizeMode="contain"
          />
        </TouchableOpacity>
      ) : (
        <View className="size-5" />
      )}

      {title && <Text className="base-semibold text-dark-100">{title}</Text>}
      <View className="size-5"></View>
    </View>
  );
};

export default CustomHeader;
