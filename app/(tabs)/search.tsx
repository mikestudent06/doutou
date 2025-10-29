import CartButton from "@/components/CartButton";
import Filter from "@/components/Filter";
import MenuCard from "@/components/MenuCard";
import SearchBar from "@/components/SearchBar";
import { getCategories, getMenu } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwirte";
import { Category, MenuItem } from "@/type";
import cn from "clsx";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Search = () => {
  const { category, query } = useLocalSearchParams<{
    query: string;
    category: string;
  }>();

  const { data, refetch, loading } = useAppwrite({
    fn: getMenu,
    params: { category, query, limit: 6 },
  });

  const { data: categories } = useAppwrite({ fn: getCategories });

  useEffect(() => {
    refetch({ category, query, limit: 6 });
  }, [category, query]);

  return (
    <SafeAreaView className="bg-white h-full">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* 👇 FIXED: Move header content outside FlatList */}
        <View className="px-5 py-5 gap-5 bg-white">
          <View className="flex-between flex-row w-full">
            <View className="flex-start">
              <Text className="small-bold uppercase text-primary">Search</Text>
              <View className="flex-start flex-row gap-x-1 mt-0.5">
                <Text className="paragraph-semibold text-dark-100">
                  Find your favorite food
                </Text>
              </View>
            </View>
            <CartButton />
          </View>

          {/* SearchBar is now outside FlatList - won't lose focus! */}
          <SearchBar />

          {/* Filter is also outside - prevents focus issues */}
          <Filter categories={categories as Category[]} />
        </View>

        {/* 👇 FlatList now only contains the menu items */}
        <FlatList
          className="flex-1"
          data={data}
          renderItem={({ item, index }) => {
            const isFirstRightColItem = index % 2 === 0;

            return (
              <View
                className={cn(
                  "flex-1 max-w-[48%]",
                  !isFirstRightColItem ? "mt-10" : "mt-0"
                )}
              >
                <MenuCard item={item as MenuItem} />
              </View>
            );
          }}
          keyExtractor={(item) => item.$id}
          numColumns={2}
          columnWrapperClassName="gap-7"
          contentContainerClassName="gap-7 px-5 pt-0 pb-32"
          // Keep these for better UX
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
          ListEmptyComponent={() =>
            !loading && (
              <View className="items-center justify-center py-10">
                <Text>No results found</Text>
                {query && (
                  <Text className="text-gray-500 mt-2">
                    Try searching for something else
                  </Text>
                )}
              </View>
            )
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Search;
