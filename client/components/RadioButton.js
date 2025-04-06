import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

const RadioButton = ({ options, selectedOption, onSelect }) => {
  return (
    <View>
      {options.map((option, index) => (
        <TouchableOpacity 
          key={index} 
          style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
          onPress={() => onSelect(option.value)}
        >
          <View 
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: "#007AFF",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 10
            }}
          >
            {selectedOption === option.value && (
              <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#007AFF" }} />
            )}
          </View>
          <Text>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};


export default RadioButton;