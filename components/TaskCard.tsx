import { Task } from "@/types/task.types";
import React from "react";
import { Text, View } from "react-native";

const TaskCard = ({ task }: { task: Task }) => {
  return (
    <View>
      <Text>TaskCard</Text>
    </View>
  );
};

export default TaskCard;
