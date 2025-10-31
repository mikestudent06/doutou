import CustomButton from "@/components/CustomButton";
import { app_features } from "@/constants";
import { router } from "expo-router";
import { FlatList, Image, ImageSourcePropType, Text, View } from "react-native";

export default function OnboardingIntro() {
  return (
    <View className="flex-1 bg-secondary items-center pt-20 px-6 gap-6">
      <View className="flex-row">
        <Text className="font-quicksand-semibold text-3xl">
          {" "}
          Bienvenue dans{" "}
        </Text>

        <Text className="text-primary font-quicksand-bold text-3xl">
          Doutou
        </Text>
      </View>
      <Text className="text-base text-gray-700 text-center">
        Découvrez l&apos;application de gestion de tâches qui vous aidera à
        rester organisé et à atteindre vos objectifs.
      </Text>

      <FlatList
        className="pt-10 w-full"
        data={app_features}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-28"
        renderItem={({ item }) => (
          <View className="w-full bg-white shadow-white-200/10 backdrop-blur-xl rounded-lg flex-row items-center gap-4 mb-4 p-4">
            <View className="size-10 bg-primary/10 rounded-full p-2">
              <Image
                source={item.icon as ImageSourcePropType}
                className="size-full"
              />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-quicksand-bold">{item.title}</Text>
              <Text className="text-base text-gray-500">
                {item.description}
              </Text>
            </View>
          </View>
        )}
        ListFooterComponent={
          <CustomButton
            title="Continuer"
            style="w-full bg-primary"
            textStyle="text-white font-quicksand-bold"
            isLoading={false}
            onPress={() => {
              router.push("/(tabs)");
            }}
          />
        }
        ListFooterComponentStyle={{ paddingHorizontal: 16, paddingTop: 20 }}
        scrollEnabled={false}
      />
    </View>
  );
}
