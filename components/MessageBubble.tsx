import { cn } from "@/lib/utils";
import React from "react";
import { Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

interface MessageBubbleProps {
  message: string;
  bottom?: number;
  right?: number;
  left?: number;
  className?: string;
  textClassName?: string;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export default function MessageBubble({
  message,
  bottom = 100,
  right,
  left,
  className,
  textClassName,
}: MessageBubbleProps) {
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    // Animation bounce infinie
    translateY.value = withRepeat(
      withSequence(
        withTiming(-8, {
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0, {
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1, // Répéter indéfiniment
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <AnimatedView
      style={[
        {
          position: "absolute",
          bottom,
          ...(right !== undefined && { right }),
          ...(left !== undefined && { left }),
          zIndex: 40,
        },
        animatedStyle,
      ]}
      className={cn("relative ", className)}
    >
      {/* Bulle de message */}
      <View className="bg-primary w-full px-6 py-8 rounded-2xl shadow-lg shadow-gray-200">
        <Text
          className={cn(
            "text-white-100 text-sm font-quicksand-medium",
            textClassName
          )}
        >
          {message}
        </Text>
      </View>

      {/* Pointe de la bulle (triangle pointant vers le bas et droite) */}
      <View
        style={{
          position: "absolute",
          bottom: -16,
          right: 14,
          width: 0,
          height: 0,
          borderLeftWidth: 8,
          borderRightWidth: 8,
          borderTopWidth: 22,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderTopColor: "#FE8C00", // primary
          transform: [{ rotate: "326deg" }],
        }}
      />
    </AnimatedView>
  );
}
