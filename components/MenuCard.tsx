import { appwriteConfig } from "@/lib/appwrite";
import { useCartStore } from "@/store/cart.store";
import { MenuItem } from "@/type";
import { useRouter } from "expo-router";
import { Image, Platform, Text, TouchableOpacity, View } from "react-native";

const MenuCard = ({
  item: { $id, image_url, name, price },
}: {
  item: MenuItem;
}) => {
  const imageUrl = `${image_url}?project=${appwriteConfig.projectId}`;
  const { addItem } = useCartStore();
  const router = useRouter();

  const handleQuickAdd = (e: any) => {
    // Prevent navigation when quick adding to cart
    e.stopPropagation();

    addItem({
      id: $id,
      name,
      price,
      image_url: imageUrl,
      customizations: [],
    });
  };

  const handleCardPress = () => {
    // Navigate to menu detail page
    router.push(`/menu/${$id}`);
  };

  return (
    <TouchableOpacity
      className="menu-card"
      style={
        Platform.OS === "android"
          ? { elevation: 10, shadowColor: "#878787" }
          : {}
      }
      onPress={handleCardPress}
    >
      <Image
        source={{ uri: imageUrl }}
        className="size-32 absolute -top-10"
        resizeMode="contain"
      />
      <Text
        className="text-center base-bold text-dark-100 mb-2"
        numberOfLines={1}
      >
        {name}
      </Text>
      <Text className="body-regular text-gray-200 mb-4">From ${price}</Text>

      <View className="flex-row justify-between items-center">
        <TouchableOpacity onPress={handleQuickAdd}>
          <Text className="paragraph-bold text-primary">Add to Cart +</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default MenuCard;
