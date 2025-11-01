import { images } from "@/constants";
import { TabBarIconProps } from "@/types/ui.types";
import cn from "clsx";
import { Tabs } from "expo-router";
import { Image, ImageSourcePropType, Text, View } from "react-native";

const TabBarIcon = ({ focused, icon, title }: TabBarIconProps) => (
  <View className="tab-icon">
    <Image
      source={icon as ImageSourcePropType}
      className="size-6"
      resizeMode="contain"
      tintColor={focused ? "#FE8C00" : "#5D5F6D"}
    />
    <Text
      className={cn(
        "text-sm font-bold",
        focused ? "text-primary" : "text-gray-200"
      )}
    >
      {title}
    </Text>
  </View>
);

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 70,
          bottom: 0,
          position: "absolute",
          backgroundColor: "white",
          shadowColor: "#1a1a1a",
          shadowOffset: { width: 20, height: 20 },
          shadowOpacity: 1,
          boxShadow: "10px 20px 50px 0 #efefef",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Tâches",
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabBarIcon title="Tâches" icon={images.list} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendrier",
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabBarIcon
              title="Calendrier"
              icon={images.calendar}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="overview"
        options={{
          title: "Aperçu",
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabBarIcon
              title="Aperçu"
              icon={images.overview}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="pomodoro"
        options={{
          title: "Pomodoro",
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabBarIcon
              title="Pomodoro"
              icon={images.pomodoro}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}
