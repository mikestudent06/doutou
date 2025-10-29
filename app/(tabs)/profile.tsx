import CustomButton from "@/components/CustomButton";
import CustomHeader from "@/components/CustomHeader";
import InfoCard from "@/components/InfoCard";
import { images } from "@/constants";
import { signOut } from "@/lib/appwrite";
import useAuthStore from "@/store/auth.store";
import { router } from "expo-router";
import React from "react";
import { Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const { user, logout } = useAuthStore();
  const handleLogout = async () => {
    await signOut();
    logout();
    router.replace("/sign-in");
  };
  const handleEditProfile = () => {
    router.push("/edit-profile");
  };
  return (
    <SafeAreaView className="bg-white-100 h-full">
      <View className="relative px-5 pb-28 pt-5 items-center">
        <CustomHeader title="Profile" showBackButton />
        <View className="w-28 h-28 relative">
          <Image
            source={{ uri: user?.avatar }}
            className="size-24 rounded-full"
          />
        </View>
        <View className="bg-white w-full flex-col rounded-xl shadow-2xl p-4">
          <InfoCard icon={images.user} title="Full Name" value={user?.name!} />
          <InfoCard icon={images.envelope} title="Email" value={user?.email!} />
          <InfoCard
            icon={images.phone}
            title="Phone number"
            value={user?.phone! ?? "-"}
          />
          <InfoCard
            icon={images.location}
            title="Address"
            value={user?.address! ?? "-"}
          />
        </View>
        <View className="w-full gap-4 pt-8">
          <CustomButton
            onPress={handleEditProfile}
            title=" Edit profile"
            style="bg-white-200/10 border border-white-200"
            textStyle="text-white-200"
          />
          <CustomButton
            onPress={handleLogout}
            leftIcon={images.logout}
            title=" Logout"
            style="bg-red-200/10 border border-red-200"
            textStyle="text-red-600"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
