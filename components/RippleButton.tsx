import { cn } from "@/lib/utils";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface RippleButtonProps {
  onPress?: () => void;
  title: string;
  style?: string;
  textStyle?: string;
  rippleColor?: string;
  numberOfRipples?: number;
  bottom?: number;
  top?: number;
  right?: number;
  left?: number;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export default function RippleButton({
  onPress,
  title,
  style,
  textStyle,
  rippleColor = "rgba(254, 140, 0, 0.3)", // amber-500 with opacity
  numberOfRipples = 3,
  bottom,
  top,
  right,
  left,
}: RippleButtonProps) {
  // Créer un nombre fixe de valeurs partagées (maximum 5)
  const scale1 = useSharedValue(1);
  const opacity1 = useSharedValue(0.6);
  const scale2 = useSharedValue(1);
  const opacity2 = useSharedValue(0.6);
  const scale3 = useSharedValue(1);
  const opacity3 = useSharedValue(0.6);
  const scale4 = useSharedValue(1);
  const opacity4 = useSharedValue(0.6);
  const scale5 = useSharedValue(1);
  const opacity5 = useSharedValue(0.6);

  // Créer les styles animés au niveau supérieur
  const animatedStyle1 = useAnimatedStyle(() => ({
    transform: [{ scale: scale1.value }],
    opacity: opacity1.value,
  }));
  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [{ scale: scale2.value }],
    opacity: opacity2.value,
  }));
  const animatedStyle3 = useAnimatedStyle(() => ({
    transform: [{ scale: scale3.value }],
    opacity: opacity3.value,
  }));
  const animatedStyle4 = useAnimatedStyle(() => ({
    transform: [{ scale: scale4.value }],
    opacity: opacity4.value,
  }));
  const animatedStyle5 = useAnimatedStyle(() => ({
    transform: [{ scale: scale5.value }],
    opacity: opacity5.value,
  }));

  const ripples = [
    { scale: scale1, opacity: opacity1, style: animatedStyle1 },
    { scale: scale2, opacity: opacity2, style: animatedStyle2 },
    { scale: scale3, opacity: opacity3, style: animatedStyle3 },
    { scale: scale4, opacity: opacity4, style: animatedStyle4 },
    { scale: scale5, opacity: opacity5, style: animatedStyle5 },
  ].slice(0, numberOfRipples);

  // Démarrer les animations pour chaque onde avec des délais différents
  React.useEffect(() => {
    ripples.forEach((ripple, index) => {
      const delay = index * 400; // Délai de 400ms entre chaque onde

      // Décaler le démarrage de chaque onde
      setTimeout(() => {
        ripple.scale.value = withRepeat(
          withTiming(3, {
            duration: 2000,
            easing: Easing.out(Easing.ease),
          }),
          -1, // Répéter indéfiniment
          false
        );
        ripple.opacity.value = withRepeat(
          withTiming(0, {
            duration: 2000,
            easing: Easing.out(Easing.ease),
          }),
          -1,
          false
        );
      }, delay);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numberOfRipples]);

  // Build positioning style
  const positioningStyle: {
    position?: "absolute" | "relative";
    bottom?: number;
    top?: number;
    right?: number;
    left?: number;
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
  }

  return (
    <View
      className="relative items-center justify-center"
      style={hasPositioning ? positioningStyle : undefined}
    >
      {/* Ondes animées */}
      {ripples.map((ripple, index) => (
        <AnimatedView
          key={index}
          style={[
            {
              position: "absolute",
              width: 64, // w-16 = 64px
              height: 64,
              borderRadius: 32,
              backgroundColor: rippleColor,
            },
            ripple.style,
          ]}
        />
      ))}

      {/* Bouton principal */}
      <TouchableOpacity
        className={cn("bg-primary rounded-full w-16 h-16 flex-center", style)}
        onPress={onPress}
      >
        <Text
          className={cn("text-white text-2xl font-quicksand-bold", textStyle)}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
