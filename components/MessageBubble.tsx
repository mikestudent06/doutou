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
  top?: number;
  right?: number;
  left?: number;
  className?: string;
  textClassName?: string;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export default function MessageBubble({
  message,
  bottom,
  top,
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
  }, [translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  // Build positioning style
  const positioningStyle: {
    position?: "absolute" | "relative";
    bottom?: number;
    top?: number;
    right?: number;
    left?: number;
    zIndex?: number;
  } = {};

  // Only use absolute positioning if any position prop is provided
  const hasPositioning =
    bottom !== undefined ||
    top !== undefined ||
    right !== undefined ||
    left !== undefined;

  if (hasPositioning) {
    positioningStyle.position = "absolute";
    if (bottom !== undefined) positioningStyle.bottom = bottom;
    if (top !== undefined) positioningStyle.top = top;
    if (right !== undefined) positioningStyle.right = right;
    if (left !== undefined) positioningStyle.left = left;
    positioningStyle.zIndex = 40;
  }

  return (
    <AnimatedView
      style={[hasPositioning ? positioningStyle : {}, animatedStyle]}
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
          right: 20,
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
