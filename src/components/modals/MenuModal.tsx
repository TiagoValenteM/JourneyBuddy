import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getAuth, signOut } from "firebase/auth";
import Feather from "react-native-vector-icons/Feather";
import React from "react";

const auth = getAuth();
const MenuModal = ({
  screenProps,
}: {
  screenProps: { modalVisible: boolean; setModalVisible: any };
}) => {
  const { modalVisible, setModalVisible } = screenProps;
  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <TouchableOpacity
        onPress={() => setModalVisible(!modalVisible)}
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <View
          style={{
            height: "70%",
            marginTop: "auto",
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}
        >
          <LinearGradient
            colors={["#141e30", "#243b55"]}
            style={{ flex: 1, borderRadius: 20 }}
          >
            <TouchableOpacity
              onPress={() => signOut(auth)}
              style={{ margin: 16 }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: 4,
                }}
              >
                <Feather name="log-out" color="white" size={24} />
                <Text style={{ color: "white", fontSize: 20, marginLeft: 8 }}>
                  Logout
                </Text>
              </View>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default MenuModal;
