import React from "react";
import {
  Text,
  Image,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useError } from "../../hooks/useError";

interface SignInViewProps {
  navigation: any;
}

function SignInView({ navigation }: SignInViewProps) {
  const { showError } = useError();
  const [value, setValue] = React.useState({
    email: "",
    password: "",
  });

  const handleScreenPress = () => {
    Keyboard.dismiss(); // Dismiss the keyboard when the screen is pressed
  };

  const signIn = async () => {
    if (value.email === "" || value.password === "") {
      showError("Email and password are mandatory.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, value.email, value.password);
    } catch (error: any) {
      showError("Email or password is incorrect.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleScreenPress}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, backgroundColor: "#dfe0e3" }}
      >
        <View style={{ flex: 1, backgroundColor: "#dfe0e3" }}>
          <StatusBar barStyle="light-content" backgroundColor="#1c7ef3" />
          <LinearGradient
            colors={["#1c7ef3", "#1cbafa", "#dfe0e3"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
              flex: 1,
              paddingHorizontal: 25,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 30,
              }}
            >
              <Image
                source={require("../../../assets/logo.png")}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 10,
                  marginRight: 15,
                }}
              />
              <Text style={{ fontSize: 26, color: "white", fontWeight: "700" }}>
                JourneyBuddy
              </Text>
            </View>
          </LinearGradient>

          <SafeAreaView style={{ flex: 1 }}>
            <View
              style={{
                justifyContent: "flex-start",
                alignItems: "center",
                marginTop: -30,
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 15,
                  padding: 20,
                  width: "90%",
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowOffset: {
                    width: 1,
                    height: 3,
                  },
                  elevation: 3,
                }}
              >
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ fontSize: 16, fontWeight: "500" }}>Email</Text>
                  <TextInput
                    maxLength={25}
                    placeholder="Email"
                    style={{
                      padding: 10,
                      borderBottomWidth: 2,
                      borderBottomColor: "#dfe0e3",
                      marginTop: 10,
                    }}
                    value={value.email}
                    onChangeText={(text) => setValue({ ...value, email: text })}
                  />
                </View>
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ fontSize: 16, fontWeight: "500" }}>
                    Password
                  </Text>
                  <TextInput
                    maxLength={25}
                    placeholder="Password"
                    style={{
                      padding: 10,
                      borderBottomWidth: 2,
                      borderBottomColor: "#dfe0e3",
                      marginTop: 10,
                    }}
                    onChangeText={(text) =>
                      setValue({ ...value, password: text })
                    }
                    secureTextEntry={true}
                  />
                </View>
              </View>

              <LinearGradient
                colors={["#1c7ef3", "#1cbafa"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 13,
                  marginVertical: 20,
                  height: 40,
                  justifyContent: "center",
                  alignItems: "center",
                  width: "90%",
                }}
              >
                <TouchableOpacity onPress={signIn} style={{ width: "100%" }}>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 16,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    Sign In
                  </Text>
                </TouchableOpacity>
              </LinearGradient>

              <TouchableOpacity
                style={{
                  backgroundColor: "transparent",
                  borderRadius: 13,
                  marginVertical: 15,
                  height: 40,
                  justifyContent: "center",
                  alignItems: "center",
                  width: "70%",
                }}
                onPress={() => navigation.navigate("SignUp")}
              >
                <View style={{ flexDirection: "row", gap: 5 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                  >
                    New here?
                  </Text>
                  <Text
                    style={{
                      color: "#1c7ef3",
                      fontSize: 16,
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                  >
                    Create an account
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

export default SignInView;
