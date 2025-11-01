import MessageBubble from "@/components/MessageBubble";
import RippleButton from "@/components/RippleButton";
import { categories } from "@/constants";
import { cn } from "@/lib/utils";
import { Category } from "@/types/category.types";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const searchParams = useLocalSearchParams();
  const [active, setActive] = useState(searchParams.category || "toutes");
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
          ListEmptyComponent={({ item }: { item: Category }) => (
            <View className="flex-1 justify-center items-center">
              <Image source={item.emptyStateImage} className="w-10 h-10" />
              {/* Message avec animation bounce */}
              <MessageBubble
                message="Cliquez ici pour créer votre première tâche"
                bottom={200}
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
          )}
        />
      </View>
    </View>
  );
}
