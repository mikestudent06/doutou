import CategoriesFilter from "@/components/CategoriesFilter";
import MessageBubble from "@/components/MessageBubble";
import RippleButton from "@/components/RippleButton";
import Searchbar from "@/components/SearchBar";
import TaskCard from "@/components/TaskCard";
import { images } from "@/constants";
import { useCategoryStore, useTaskStore } from "@/store";
import { Task } from "@/types/task.types";
import { useEffect } from "react";
import { FlatList, Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { categories, fetchCategories } = useCategoryStore();
  const { tasks, fetchTasks } = useTaskStore();

  // Load categories and tasks on mount
  useEffect(() => {
    fetchCategories();
    fetchTasks();
  }, [fetchCategories, fetchTasks]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={tasks}
        renderItem={({ item }: { item: Task }) => <TaskCard task={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={() => (
          <View className="px-5 pt-5 pb-5 gap-5 bg-white">
            <Searchbar />
            <CategoriesFilter categories={categories} />
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="flex-1 h-full flex-col items-center justify-center gap-8 px-5 pt-20 pb-20">
            {/* Image vide */}
            <View className="size-64 bg-primary/10 rounded-full p-2">
              <Image source={images.empty} className="size-full" />
            </View>

            {/* Message avec animation bounce */}
            <MessageBubble
              message="Cliquez ici pour créer votre première tâche"
              className="relative"
              bottom={-40}
            />

            {/* Bouton avec ondes animées */}
            <RippleButton
              title="+"
              onPress={() => {}}
              rippleColor="rgba(254, 140, 0, 0.25)"
              numberOfRipples={3}
              bottom={-130}
              right={20}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}
