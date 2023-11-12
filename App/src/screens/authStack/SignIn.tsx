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
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useError } from "../../hooks/useError";
import Colors from "../../../styles/colorScheme";

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
        style={{ flex: 1 }}
      >
        <StatusBar barStyle="light-content" backgroundColor={Colors.blue} />
        <LinearGradient
          colors={[Colors.blue, Colors.lightBlue, Colors.white]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.9 }}
          style={{
            flex: 1,
            paddingHorizontal: 20,
            justifyContent: "center",
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={{
                uri: "https://i.imgur.com/j7qbzry.jpg",
              }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 10,
                marginRight: 15,
              }}
            />
            <Text
              style={{
                fontSize: 26,
                color: Colors.white,
                fontWeight: "bold",
              }}
            >
              Journey Buddy
            </Text>
          </View>

          <SafeAreaView style={{ flex: 1 }}>
            <View
              style={{
                backgroundColor: Colors.white,
                borderRadius: 10,
                padding: 20,
                shadowColor: Colors.black,
                shadowOpacity: 0.1,
                shadowOffset: {
                  width: 3,
                  height: 3,
                },
                elevation: 3,
              }}
            >
              <View style={{ marginVertical: 10 }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "bold",
                    color: Colors.darkGray,
                  }}
                >
                  Email
                </Text>
                <TextInput
                  maxLength={25}
                  placeholder="Email"
                  style={{
                    padding: 5,
                    borderBottomWidth: 1,
                    borderBottomColor: Colors.lightGray,
                    marginTop: 10,
                    color: Colors.gray,
                  }}
                  value={value.email}
                  onChangeText={(text) => setValue({ ...value, email: text })}
                />
              </View>
              <View style={{ marginVertical: 10 }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "bold",
                    color: Colors.darkGray,
                  }}
                >
                  Password
                </Text>
                <TextInput
                  maxLength={25}
                  placeholder="Password"
                  style={{
                    padding: 5,
                    borderBottomWidth: 1,
                    borderBottomColor: Colors.lightGray,
                    marginTop: 10,
                    color: Colors.gray,
                  }}
                  onChangeText={(text) =>
                    setValue({ ...value, password: text })
                  }
                  secureTextEntry={true}
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={signIn}
              style={{
                borderRadius: 10,
                backgroundColor: Colors.blue,
                marginVertical: 20,
                paddingVertical: 10,
              }}
            >
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

            <View
              style={{
                flexDirection: "row",
                gap: 5,
                alignItems: "center",
                marginVertical: 20,
                alignSelf: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "bold",
                  color: Colors.gray,
                }}
              >
                New here?
              </Text>
              <Pressable onPress={() => navigation.navigate("SignUp")}>
                <Text
                  style={{
                    color: Colors.blue,
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  Create an account
                </Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

export default SignInView;
