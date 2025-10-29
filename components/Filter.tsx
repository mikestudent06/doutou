import { Category } from "@/type";
import cn from "clsx";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FlatList, Platform, Text, TouchableOpacity } from "react-native";

const Filter = ({ categories }: { categories: Category[] }) => {
  const searchParams = useLocalSearchParams();
  const [active, setActive] = useState(searchParams.category || "all");
  console.log("active===============================", active);
  const filterData: (Category | { $id: string; name: string })[] = categories
    ? [{ $id: "all", name: "All" }, ...categories]
    : [{ $id: "all", name: "All" }];

  const handlePress = (id: string) => {
    setActive(id);
    console.log("id", id);

    // Instead of setting undefined, set empty string or remove the param entirely
    if (id === "all") {
      router.setParams({ category: "" }); // or router.replace({ pathname: router.pathname })
    } else {
      router.setParams({ category: id });
    }
  };

  return (
    <FlatList
      data={filterData}
      keyExtractor={(item) => item.$id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-x-2 pb-3"
      renderItem={({ item }) => {
        console.log("item", item.name);
        return (
          <TouchableOpacity
            key={item.$id}
            className={cn(
              "filter",
              active === item.$id ? "bg-amber-500" : "bg-white"
            )}
            style={
              Platform.OS === "android"
                ? { elevation: 5, shadowColor: "#878787" }
                : {}
            }
            onPress={() => handlePress(item.$id)}
          >
            <Text
              className={cn(
                "body-medium",
                active === item.$id ? "text-white" : "text-gray-200"
              )}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
};
export default Filter;
