import { cn } from "@/lib/utils";
import { Category } from "@/types/task.types";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { FlatList, Platform, Text, TouchableOpacity } from "react-native";

const CategoriesFilter = ({ categories }: { categories: Category[] }) => {
  const searchParams = useLocalSearchParams();
  const [active, setActive] = useState(searchParams.category || "toutes");
  const filterData: (Category | { id: string; name: string })[] = categories
    ? [{ id: "toutes", name: "Toutes" }, ...categories]
    : [{ id: "toutes", name: "Toutes" }];

  console.log("filterData", filterData);

  const handlePress = (id: string) => {
    setActive(id);
    console.log("id", id);
    if (id === "toutes") {
      router.setParams({ category: "" });
    } else {
      router.setParams({ category: id });
    }
  };

  return (
    <FlatList
      data={filterData}
      style={{ flexGrow: 0 }}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 10 }}
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
  );
};

export default CategoriesFilter;
