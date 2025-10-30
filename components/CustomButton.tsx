import { CustomButtonProps } from "@/types/ui.types";
import cn from "clsx";
import React from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CustomButton = ({
  onPress,
  title = "Click Me",
  style,
  textStyle,
  leftIcon,
  rightIcon,
  isLoading = false,
}: CustomButtonProps) => {
  return (
    <TouchableOpacity className={cn("custom-btn", style)} onPress={onPress}>
      {leftIcon && (
        <Image
          source={typeof leftIcon === "string" ? { uri: leftIcon } : leftIcon}
          className="size-6"
        />
      )}

      <View className="flex-center flex-row">
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text className={cn("text-white-100 paragraph-semibold", textStyle)}>
            {title}
          </Text>
        )}
      </View>

      {rightIcon && (
        <Image
          source={
            typeof rightIcon === "string" ? { uri: rightIcon } : rightIcon
          }
          className="size-6"
        />
      )}
    </TouchableOpacity>
  );
};
export default CustomButton;
