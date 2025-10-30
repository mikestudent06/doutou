import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Text>Hello World</Text>
      {/* <FlatList
        data={[] as any}
        renderItem={({ item, index }) => {
          return <View></View>;
        }}
        contentContainerClassName="pb-28 px-5"
        ListHeaderComponent={() => <></>}
      /> */}
    </SafeAreaView>
  );
}
