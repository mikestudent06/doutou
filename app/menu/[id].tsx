import { appwriteConfig, databases } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwirte";
import { calculateItemTotal, formatPrice, generateStars } from "@/lib/utils";
import { useCartStore } from "@/store/cart.store";
import { CartCustomization, Customization, MenuItem } from "@/type";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Clock,
  Minus,
  Plus,
  Search,
  Star,
} from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MenuDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addItem } = useCartStore();

  // State
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [selectedSides, setSelectedSides] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  // Fetch menu item details
  const {
    data: menuItem,
    loading: menuLoading,
    error: menuError,
  } = useAppwrite<MenuItem, { id: string }>({
    fn: async ({ id }) => {
      const response = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.menuCollectionId,
        id
      );
      return response as MenuItem;
    },
    params: { id: id! },
    skip: !id,
  });

  // Fetch customizations
  const { data: customizations, loading: customizationsLoading } = useAppwrite<
    Customization[],
    {}
  >({
    fn: async () => {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.customizationsCollectionId
      );
      return response.documents as Customization[];
    },
  });

  // Memoized values
  const { toppings, sides } = useMemo(() => {
    if (!customizations) return { toppings: [], sides: [] };

    return {
      toppings: customizations.filter((item) => item.type === "topping"),
      sides: customizations.filter((item) => item.type === "side"),
    };
  }, [customizations]);

  const selectedCustomizations = useMemo((): CartCustomization[] => {
    const selectedToppingItems = selectedToppings
      .map((id) => toppings.find((t) => t.$id === id))
      .filter(Boolean)
      .map((item) => ({
        id: item!.$id,
        name: item!.name,
        price: item!.price,
        type: item!.type,
      }));

    const selectedSideItems = selectedSides
      .map((id) => sides.find((s) => s.$id === id))
      .filter(Boolean)
      .map((item) => ({
        id: item!.$id,
        name: item!.name,
        price: item!.price,
        type: item!.type,
      }));

    return [...selectedToppingItems, ...selectedSideItems];
  }, [selectedToppings, selectedSides, toppings, sides]);

  const totalPrice = useMemo(() => {
    if (!menuItem) return 0;
    return calculateItemTotal(menuItem.price, selectedCustomizations, quantity);
  }, [menuItem, selectedCustomizations, quantity]);

  const loading = menuLoading || customizationsLoading;

  // Handlers
  const toggleTopping = (toppingId: string) => {
    setSelectedToppings((prev) =>
      prev.includes(toppingId)
        ? prev.filter((id) => id !== toppingId)
        : [...prev, toppingId]
    );
  };

  const toggleSide = (sideId: string) => {
    setSelectedSides((prev) =>
      prev.includes(sideId)
        ? prev.filter((id) => id !== sideId)
        : [...prev, sideId]
    );
  };

  const handleAddToCart = () => {
    if (!menuItem) return;

    const cartItem = {
      id: menuItem.$id,
      name: menuItem.name,
      price: menuItem.price,
      image_url: menuItem.image_url,
      customizations: selectedCustomizations,
    };

    // Add items to cart (respecting quantity)
    for (let i = 0; i < quantity; i++) {
      addItem(cartItem);
    }

    Alert.alert(
      "Added to Cart",
      `${quantity}x ${menuItem.name} has been added to your cart!`,
      [
        { text: "Continue Shopping", style: "cancel" },
        { text: "View Cart", onPress: () => router.push("/cart") },
      ]
    );

    // Reset selections after adding to cart
    setSelectedToppings([]);
    setSelectedSides([]);
    setQuantity(1);
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  // Components
  const CustomizationItem = ({
    item,
    isSelected,
    onToggle,
  }: {
    item: Customization;
    isSelected: boolean;
    onToggle: () => void;
  }) => (
    <TouchableOpacity
      onPress={onToggle}
      className="mr-4 items-center"
      activeOpacity={0.7}
    >
      <View className="relative">
        <View
          className={`w-20 h-20 rounded-2xl items-center justify-center mb-2 ${
            isSelected ? "bg-orange-100 border-2 border-primary" : "bg-gray-100"
          }`}
        >
          <Image
            source={{ uri: item.image }}
            className="w-12 h-12 rounded-lg"
            resizeMode="cover"
            onError={() => console.warn(`Failed to load image: ${item.image}`)}
          />
        </View>
        <View
          className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full items-center justify-center ${
            isSelected ? "bg-primary" : "bg-gray-300"
          }`}
        >
          {isSelected ? (
            <Minus size={12} color="white" />
          ) : (
            <Plus size={12} color="white" />
          )}
        </View>
      </View>
      <Text className="text-sm font-medium text-center w-20" numberOfLines={2}>
        {item.name}
      </Text>
      <Text className="text-xs text-primary text-center font-semibold">
        {formatPrice(item.price)}
      </Text>
    </TouchableOpacity>
  );

  const StarRating = ({ rating }: { rating: number }) => {
    const stars = generateStars(rating);
    return (
      <View className="flex-row items-center">
        {stars.map((star) => (
          <Star
            key={star.key}
            size={16}
            color={star.filled ? "#FE8C00" : "#E5E5E5"}
            fill={star.filled ? "#FE8C00" : "#E5E5E5"}
          />
        ))}
        <Text className="ml-2 text-gray-500 font-medium">{rating}/5</Text>
      </View>
    );
  };

  const LoadingView = () => (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg text-gray-500">Loading menu details...</Text>
      </View>
    </SafeAreaView>
  );

  const ErrorView = () => (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-5">
        <Text className="text-lg text-gray-500 text-center mb-4">
          {menuError || "Menu item not found"}
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-primary px-6 py-3 rounded-2xl"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  // Render conditions
  if (loading) return <LoadingView />;
  if (!menuItem || menuError) return <ErrorView />;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-4">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <ArrowLeft size={24} color="#181C2E" />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7}>
            <Search size={24} color="#181C2E" />
          </TouchableOpacity>
        </View>

        {/* Menu Item Image */}
        <View className="px-5 mb-6">
          <Image
            source={{ uri: menuItem.image_url }}
            className="w-full h-64 rounded-2xl"
            resizeMode="cover"
          />
        </View>

        {/* Menu Item Details */}
        <View className="px-5">
          <Text className="text-2xl font-bold text-dark-100 mb-1">
            {menuItem.name}
          </Text>
          <Text className="text-gray-500 text-lg mb-3">
            {menuItem.category}
          </Text>

          {/* Rating and Price */}
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <StarRating rating={menuItem.rating} />
              <Text className="text-3xl font-bold text-primary mt-1">
                {formatPrice(menuItem.price)}
              </Text>
            </View>
          </View>

          {/* Nutrition Info */}
          <View className="flex-row mb-4">
            <View className="mr-8">
              <Text className="text-gray-500 text-sm">Calories</Text>
              <Text className="text-dark-100 font-semibold">
                {menuItem.calories} Cal
              </Text>
            </View>
            <View>
              <Text className="text-gray-500 text-sm">Protein</Text>
              <Text className="text-dark-100 font-semibold">
                {menuItem.protein}g
              </Text>
            </View>
          </View>

          {/* Delivery Info */}
          <View className="flex-row items-center justify-between bg-gray-50 rounded-2xl p-4 mb-6">
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-primary rounded-full items-center justify-center mr-3">
                <Text className="text-white text-sm font-bold">$</Text>
              </View>
              <Text className="text-dark-100 font-medium">Free Delivery</Text>
            </View>
            <View className="flex-row items-center">
              <Clock size={16} color="#FE8C00" />
              <Text className="text-dark-100 font-medium ml-2">
                {menuItem.deliveryTime || "20-30 min"}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Star size={16} color="#FE8C00" fill="#FE8C00" />
              <Text className="text-dark-100 font-medium ml-1">
                {menuItem.deliveryRating || "4.8"}
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text className="text-gray-500 text-base leading-6 mb-8">
            {menuItem.description || "Delicious menu item crafted with care."}
          </Text>

          {/* Toppings Section */}
          {toppings.length > 0 && (
            <View className="mb-8">
              <Text className="text-xl font-bold text-dark-100 mb-4">
                Toppings{" "}
                {selectedToppings.length > 0 &&
                  `(${selectedToppings.length} selected)`}
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-4"
              >
                {toppings.map((topping) => (
                  <CustomizationItem
                    key={topping.$id}
                    item={topping}
                    isSelected={selectedToppings.includes(topping.$id)}
                    onToggle={() => toggleTopping(topping.$id)}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Side Options Section */}
          {sides.length > 0 && (
            <View className="mb-8">
              <Text className="text-xl font-bold text-dark-100 mb-4">
                Side options{" "}
                {selectedSides.length > 0 &&
                  `(${selectedSides.length} selected)`}
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-4"
              >
                {sides.map((side) => (
                  <CustomizationItem
                    key={side.$id}
                    item={side}
                    isSelected={selectedSides.includes(side.$id)}
                    onToggle={() => toggleSide(side.$id)}
                  />
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Section - Quantity and Add to Cart */}
      <View className="px-5 py-4 bg-white border-t border-gray-100">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => handleQuantityChange(-1)}
              className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
              activeOpacity={0.7}
            >
              <Minus size={16} color="#181C2E" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-dark-100 mx-6">
              {quantity}
            </Text>
            <TouchableOpacity
              onPress={() => handleQuantityChange(1)}
              className="w-10 h-10 bg-primary rounded-full items-center justify-center"
              activeOpacity={0.7}
            >
              <Plus size={16} color="white" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleAddToCart}
            className="bg-primary rounded-2xl px-8 py-4 flex-row items-center"
            activeOpacity={0.8}
          >
            <View className="mr-3">
              <Text className="text-white text-sm">🛒</Text>
            </View>
            <Text className="text-white font-bold text-lg">
              Add to cart ({formatPrice(totalPrice)})
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MenuDetail;
