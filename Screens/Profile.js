import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { FIREBASE_AUTH } from "../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

import GetUser from "../FirebaseFunctions/Users/GetUser.js";

export default function Profile({ route, navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);

  async function saveProfileDataStorage(data) {
    try {
      await AsyncStorage.setItem("@profileData", JSON.stringify(data));
    } catch (error) {
      console.log(error);
    }
  }

  async function getProfileDataStorage() {
    try {
      const jsonValue = await AsyncStorage.getItem("@profileData");
      console.log("From storage: ", JSON.parse(jsonValue));
      if (route.params?.refresh) {
        route.params.refresh = false;
        return null;
      } else {
        return jsonValue != null ? JSON.parse(jsonValue) : null;
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const user = FIREBASE_AUTH.currentUser;
    if (!user) {
      navigation.navigate("Login");
      return;
    }
    setIsLoading(true);
    getProfileDataStorage()
      .then((data) => {
        if (data) {
          setIsLoading(false);
          setProfileData(data);
        } else {
          GetUser(user.uid)
            .then((data) => {
              saveProfileDataStorage(data);
              setProfileData(data);
            })
            .catch((error) => {
              Alert.alert("Error", error.message);
              navigation.navigate("Home");
            })
            .finally(() => {
              setIsLoading(false);
            });
        }
      })
      .catch((error) => {
        console.log(error);
        navigation.navigate("Home");
      });
    setIsLoading(false);
  }, [route]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#0496FF"
          style={{ zIndex: 100, marginBottom: 20 }}
        />
      ) : null}
      <View
        style={{
          width: "100%",
          height: Dimensions.get("window").height * 0.75,
          backgroundColor: "#0b0b0b",
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          padding: 20,
          paddingTop: 40,
        }}
      >
        <View style={styles.header}>
          <View style={styles.left}>
            <Text style={styles.name}>{profileData?.name}</Text>
            <Text style={styles.bio}>
              {profileData?.bio ? profileData.bio : "no bio"}
            </Text>
          </View>
          <View style={styles.right}>
            <Pressable
              onPress={() => {
                navigation.navigate("Account Settings", {
                  pushNotifications: profileData?.pushNotifications,
                  workoutReminders: profileData?.workoutReminders,
                  sound: profileData?.sound,
                  vibrations: profileData?.vibrations,
                  gym: profileData?.gym,
                  age: profileData?.age,
                  gender: profileData?.gender,
                });
              }}
            >
              <Ionicons name="settings-outline" size={32} color="white" />
            </Pressable>
          </View>
        </View>
        <View style={styles.subHeader}>
          {profileData?.showHeightAndWeight ? (
            <View style={styles.top}>
              <View style={{ flexDirection: "column", alignItems: "center" }}>
                <Text style={styles.weight}>{profileData?.weight}</Text>
                <Text style={styles.unit}>{profileData?.weightUnit}</Text>
              </View>
              <View style={{ flexDirection: "column", alignItems: "center" }}>
                <Text style={styles.weight}>{profileData?.height}</Text>
                <Text style={styles.unit}>{profileData?.heightUnit}</Text>
              </View>
            </View>
          ) : null}
          <View style={styles.bottom}>
            <Pressable
              style={styles.editButton}
              onPress={() =>
                navigation.navigate("User Update", {
                  screen: "Edit Profile",
                  params: {
                    name: profileData?.name,
                    bio: profileData?.bio,
                    weight: profileData?.weight,
                    height: profileData?.height,
                    weightUnit: profileData?.weightUnit,
                    heightUnit: profileData?.heightUnit,
                    showHeightAndWeight: profileData?.showHeightAndWeight,
                    privateProfile: profileData?.privateProfile,
                  },
                })
              }
            >
              <Text style={{ color: "white" }}>Edit Profile</Text>
            </Pressable>
            <Pressable style={styles.shareButton}>
              <Text style={{ color: "white" }}>Share Profile</Text>
            </Pressable>
          </View>
        </View>
        <ScrollView style={styles.content}>
          <View style={styles.stats}>
            <Text
              style={{
                color: "white",
                fontSize: 24,
                fontWeight: "bold",
                marginBottom: 10,
              }}
            >
              Statistics
            </Text>
            <View style={{ flexDirection: "column" }}>
              <View style={styles.stat}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={24}
                    color="white"
                  />
                  <Text
                    style={{
                      color: "white",
                      fontSize: 16,
                      marginLeft: 10,
                    }}
                  >
                    Finished Workouts
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: "#0496FF",
                    borderRadius: 30,
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 16,
                    }}
                  >
                    {profileData?.finishedWorkouts}
                  </Text>
                </View>
              </View>
              <View style={styles.stat}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name="hourglass-outline" size={24} color="white" />
                  <Text
                    style={{
                      color: "white",
                      fontSize: 16,
                      marginLeft: 10,
                    }}
                  >
                    Hours Trained
                  </Text>
                </View>

                <View
                  style={{
                    backgroundColor: "#0496FF",
                    borderRadius: 30,
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 16,
                    }}
                  >
                    {profileData?.hoursTrained}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.badges}>
            <Text
              style={{
                color: "white",
                fontSize: 24,
                fontWeight: "bold",
                marginBottom: 10,
              }}
            >
              Badges
            </Text>
            <Text style={{ color: "#a0a0a0", fontSize: 16 }}>
              Coming soon...
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#24262B",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  content: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  left: {
    flexDirection: "column",
  },

  right: {
    flexDirection: "column",
  },

  name: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },

  bio: {
    color: "#a0a0a0",
    fontSize: 16,
  },

  subHeader: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  top: {
    flexDirection: "row",
    justifyContent: "space-around",
  },

  weight: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },

  unit: {
    color: "#a0a0a0",
    fontSize: 16,
  },

  bottom: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-around",
  },

  editButton: {
    backgroundColor: "#24262B",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingVertical: 10,
  },

  shareButton: {
    backgroundColor: "#0496FF",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingVertical: 10,
  },

  stats: {
    marginTop: 20,
  },

  stat: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
    backgroundColor: "#24262B",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 30,
  },

  badges: {
    marginTop: 20,
  },
});
