import CustomButton from "@/components/CustomButton";
import CustomHeader from "@/components/CustomHeader";
import CustomInput from "@/components/CustomInput";
import { images } from "@/constants";
import { uploadAvatar } from "@/lib/appwrite";
import useAuthStore from "@/store/auth.store";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EditProfile = () => {
  const { user, updateProfile, isLoading } = useAuthStore();

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const pickImage = async () => {
    console.log("🖼️ Starting image picker...");

    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Sorry, we need camera roll permissions to change your avatar!"
      );
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      console.log("✅ Image selected:", result.assets[0].uri);
      const asset = result.assets[0];

      // Show selected image immediately
      setSelectedImage(asset.uri);

      // Start uploading
      await handleAvatarUpload(asset.uri);
    }
  };

  const handleAvatarUpload = async (imageUri: string) => {
    if (!user) {
      Alert.alert("Error", "No user found");
      return;
    }

    console.log("⬆️ Starting avatar upload...");
    setUploadingAvatar(true);

    try {
      // Upload image and get URL
      const avatarUrl = await uploadAvatar(imageUri);
      console.log("✅ Upload successful:", avatarUrl);

      // Update user profile with new avatar
      await updateProfile({ avatar: avatarUrl });
      console.log("✅ Profile updated with new avatar");

      Alert.alert("Success", "Avatar updated successfully!");
    } catch (error: any) {
      console.error("❌ Avatar upload failed:", error);
      Alert.alert("Error", error.message || "Failed to upload avatar");

      // Reset selected image on error
      setSelectedImage(null);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleUpdate = async () => {
    if (!form.name.trim()) {
      Alert.alert("Error", "Name is required");
      return;
    }

    console.log("💾 Updating profile...");
    setIsSubmitting(true);

    try {
      await updateProfile({
        name: form.name.trim(),
        phone: form.phone.trim() || undefined,
        address: form.address.trim() || undefined,
      });

      Alert.alert("Success", "Profile updated successfully", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-white-100 h-full">
      <ScrollView className="px-5 pt-5">
        <CustomHeader title="Edit Profile" showBackButton />

        <View className="items-center mt-8 mb-8">
          <View className="w-28 h-28 relative">
            <Image
              source={{ uri: selectedImage || user?.avatar }}
              className="size-24 rounded-full"
            />
            <TouchableOpacity
              onPress={pickImage}
              disabled={uploadingAvatar}
              className="bg-primary rounded-full absolute top-14 right-2 p-2 border-2 border-white"
            >
              {uploadingAvatar ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Image source={images.pencil} className="size-4" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View className="gap-6 mb-8">
          <CustomInput
            label="Full Name"
            placeholder="Enter your full name"
            value={form.name}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, name: text }))
            }
          />

          <CustomInput
            label="Phone Number"
            placeholder="Enter your phone number"
            value={form.phone}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, phone: text }))
            }
            keyboardType="phone-pad"
          />

          <CustomInput
            label="Address"
            placeholder="Enter your address"
            value={form.address}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, address: text }))
            }
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View className="gap-4 pb-8">
          <CustomButton
            title="Update Profile"
            isLoading={isSubmitting || isLoading}
            onPress={handleUpdate}
          />

          <CustomButton
            title="Cancel"
            style="bg-gray-200/10 border border-gray-200"
            textStyle="text-gray-600"
            onPress={() => router.back()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;
