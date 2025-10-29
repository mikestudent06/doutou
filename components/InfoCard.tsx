import React from "react";
import { ImageBackground, ImageSourcePropType, Text, View } from "react-native";

interface InfoCardProps {
  icon: ImageSourcePropType | undefined;
  title: string;
  value: string;
}

export default function InfoCard({ icon, title, value }: InfoCardProps) {
  return (
    <View className="flex-row items-center gap-4 py-4">
      <View className=" bg-white-200/10 w-12 h-12 items-center justify-center rounded-full">
        <ImageBackground source={icon} className="w-6 h-6" alt="" />
      </View>
      <View>
        <Text className="paragraph-medium text-gray-200">{title}</Text>
        <Text className="paragraph-bold text-dark-100">{value}</Text>
      </View>
    </View>
  );
}
