import React from "react";
import {
  TextInput,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Image,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { LinearGradient } from "expo-linear-gradient";
import { useError } from "../../hooks/useError";
import UserProfile from "../../models/userProfiles";

function SignUpView<StackScreenProps>({ navigation }: { navigation: any }) {
  const { showError } = useError();
  const [value, setValue] = React.useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });

  const handleScreenPress = () => {
    Keyboard.dismiss(); // Dismiss the keyboard when the screen is pressed
  };

  async function signUp() {
    if (
      value.email === "" ||
      value.password === "" ||
      value.username === "" ||
      value.fullName === ""
    ) {
      showError("All fields are mandatory.");
      return;
    }

    if (value.password.length < 10) {
      showError("Password should be at least 10 characters long.");
      return;
    }

    if (!value.email.includes("@") || !value.email.includes(".")) {
      showError("Invalid email address.");
      return;
    }

    try {
      // Check if the username already exists
      const emailSnapshot = await getDocs(
        query(
          collection(db, "user_profiles"),
          where("email", "==", value.email)
        )
      );

      if (!emailSnapshot.empty) {
        showError("Email already exists.");
        return;
      }

      // Check if the username already exists
      const usernameSnapshot = await getDocs(
        query(
          collection(db, "user_profiles"),
          where("username", "==", value.username)
        )
      );

      if (!usernameSnapshot.empty) {
        showError("Username already exists.");
        return;
      }

      // Create the user and save the profile
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        value.email,
        value.password
      );

      // Create the user profile object
      const userProfile = new UserProfile(
        value.email,
        value.username,
        value.fullName,
        userCredential.user.uid
      );

      await setDoc(
        doc(db, "user_profiles", userCredential.user.uid),
        userProfile.toJSON()
      );

      navigation.navigate("SignIn");
    } catch (error) {
      showError();
    }
  }

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
                marginBottom: 100,
              }}
            >
              <Image
                source={{
                  uri: "https://i.imgur.com/j7qbzry.jpg",
                }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  marginRight: 15,
                }}
              />
              <Text style={{ fontSize: 20, color: "white", fontWeight: "700" }}>
                JourneyBuddy
              </Text>
            </View>
          </LinearGradient>

          <SafeAreaView style={{ flex: 1 }}>
            <View
              style={{
                justifyContent: "flex-start",
                alignItems: "center",
                marginTop: -170,
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
                    Username
                  </Text>
                  <TextInput
                    maxLength={25}
                    placeholder="Username"
                    style={{
                      padding: 10,
                      borderBottomWidth: 2,
                      borderBottomColor: "#dfe0e3",
                      marginTop: 10,
                    }}
                    value={value.username}
                    onChangeText={(text) =>
                      setValue({ ...value, username: text })
                    }
                  />
                </View>
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ fontSize: 16, fontWeight: "500" }}>Name</Text>
                  <TextInput
                    maxLength={25}
                    placeholder="Name"
                    style={{
                      padding: 10,
                      borderBottomWidth: 2,
                      borderBottomColor: "#dfe0e3",
                      marginTop: 10,
                    }}
                    value={value.fullName}
                    onChangeText={(text) =>
                      setValue({ ...value, fullName: text })
                    }
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
                <TouchableOpacity onPress={signUp} style={{ width: "100%" }}>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 16,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    Sign Up
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
                onPress={() => navigation.goBack()}
              >
                <View style={{ flexDirection: "row", gap: 5 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                  >
                    Already a member?
                  </Text>
                  <Text
                    style={{
                      color: "#1c7ef3",
                      fontSize: 16,
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                  >
                    Sign In
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

export default SignUpView;
