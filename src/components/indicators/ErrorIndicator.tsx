import { Text, View } from "react-native";
import React, { useEffect } from "react";
import Feather from "react-native-vector-icons/Feather";
import { useError } from "../../hooks/useError";

const ErrorIndicator = () => {
  const { modalErrorVisible, errorMessage, hideError } = useError();

  useEffect(() => {
    if (modalErrorVisible) {
      setTimeout(() => {
        hideError();
      }, 3000);
    }
  }, [modalErrorVisible]);

  return modalErrorVisible ? (
    <View
      style={{
        position: "absolute",
        bottom: "7%",
        paddingVertical: 10,
        paddingHorizontal: 25,
        backgroundColor: "rgba(50,51,50,0.85)",
        width: "90%",
        borderRadius: 10,
        alignSelf: "center",
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          gap: 10,
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Feather name={"alert-circle"} size={22} color={"white"} />
        <Text
          style={{
            color: "white",
            fontWeight: "500",
            fontSize: 12,
          }}
          ellipsizeMode={"tail"}
          numberOfLines={2}
        >
          {errorMessage}
        </Text>
      </View>
    </View>
  ) : (
    <></>
  );
};

export default ErrorIndicator;
