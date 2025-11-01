import MessageBubble from "@/components/MessageBubble";
import RippleButton from "@/components/RippleButton";
import { categories } from "@/constants";
import { cn } from "@/lib/utils";
import { Category } from "@/types/category.types";
import { useState } from "react";
import { FlatList, Platform, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const [active, setActive] = useState("toutes");
  const filterData: (Category | { id: string; name: string })[] = categories
    ? [{ id: "toutes", name: "Toutes" }, ...categories]
    : [{ id: "toutes", name: "Toutes" }];
  console.log("filterData", filterData);
  const handlePress = (id: string) => {
    setActive(id);
  };
  return (
    <View className="bg-white flex-1 w-full pt-16 gap-6">
      <View className="w-full flex-row justify-center items-center">
        <FlatList
          className="mx-6"
          data={filterData}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-x-2"
          renderItem={({
            item,
          }: {
            item: Category | { id: string; name: string };
          }) => (
            <TouchableOpacity
              key={item.id}
              className={cn(
                "filter",
                active === item.id ? "bg-amber-500" : "bg-white"
              )}
              style={
                Platform.OS === "android"
                  ? { elevation: 5, shadowColor: "#878787" }
                  : {}
              }
              onPress={() => handlePress(item.id)}
            >
              <Text
                className={cn(
                  "body-medium",
                  active === item.id ? "text-white" : "text-gray-200"
                )}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item: Category | { id: string; name: string }) =>
            item.id.toString()
          }
        />
        <Text className="text-gray-500 text-sm">Michel</Text>
      </View>
      {/* Message avec animation bounce */}
      <MessageBubble
        message="Cliquez ici pour créer votre première tâche"
        bottom={200}
        right={60}
      />

      {/* Bouton avec ondes animées */}
      <View className="absolute bottom-16 right-0 z-50">
        <RippleButton
          title="+"
          onPress={() => {}}
          rippleColor="rgba(254, 140, 0, 0.25)"
          numberOfRipples={3}
        />
      </View>
    </View>
  );
}
