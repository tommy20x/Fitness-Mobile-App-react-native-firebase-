import React, { useState, useRef, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";

import CarouselDays from "../components/CarouselDays";
import EditingRoutineExerciseList from "../components/EditingRoutineExerciseList";

import { FIREBASE_AUTH } from "../firebaseConfig.js";
import { saveEditedRoutine } from "../FirebaseFunctions/Routines/saveEditedRoutine.js";

import { EditRoutineContext } from "../context/EditRoutineContext";

export default function EditRoutine({ navigation }) {
  const {
    routine,
    setRoutine,
    currentDay,
    setCurrentDay,
    totalDays,
    routineName,
    setRoutineName,
    daysNames,
    setDaysNames,
    routineBeforeEditIndex,
    getRoutineBeforeEdit,
    clenUpEditRoutine,
  } = useContext(EditRoutineContext);

  // Here is the current day of the routine that is being edited
  // When adding an exercise to the day or editing an exercise,
  // the totalCalories, totalSets, and totalDuration will be updated in
  // the current day
  console.log(routine.days[currentDay]);

  const [_error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const refInputRoutineName = useRef(null);
  const refInputDayName = useRef(null);

  const updateRoutineNames = (routineName, daysNames, setRoutine) => {
    setRoutine((prevRoutine) => {
      const newRoutine = { ...prevRoutine };
      newRoutine.routineName = routineName;
      newRoutine.days = newRoutine.days.map((day, index) => {
        day.dayName = daysNames[index];
        return day;
      });
      return newRoutine;
    });
  };

  const handleSave = async () => {
    // update the name of the routine and the names of the days
    updateRoutineNames(routineName, daysNames, setRoutine);
    const user = FIREBASE_AUTH.currentUser;
    // check if the user is logged in
    if (!user) {
      navigation.navigate("Login");
      return;
    }
    // save the routine to the database
    setLoading(true);
    try {
      await saveEditedRoutine(routine);
      setLoading(false);
      // go back to the previous screen and refresh the data
      navigation.navigate("Saved Routines", { refresh: true });
    } catch (err) {
      console.log(err);
      setError("Couldn't save the routine");
      setLoading(false);
    }
  };

  const handleGoBack = async () => {
    // get the routine before edit from the async async-storage
    const routineBeforeEdit = await getRoutineBeforeEdit();
    console.log(routineBeforeEdit);
    navigation.navigate("Saved Routines", {
      beforeEdit: true,
      beforeEditIndex: routineBeforeEditIndex,
      routineBeforeEdit: routineBeforeEdit,
    });
    await clenUpEditRoutine();
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.home}>
        {/*aqui la parte de arriba*/}
        <View style={styles.topBar}>
          <Pressable
            onPress={() => handleGoBack()}
            style={{
              position: "absolute",
              top: -5,
              left: 20,
              height: 36,
              width: 36,
              zIndex: 999,
              backgroundColor: "#131417",
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="chevron-back-outline" size={36} color="white" />
          </Pressable>
          <Pressable
            onPress={() => handleSave()}
            style={{
              position: "absolute",
              top: -5,
              right: 20,
              height: 36,
              width: 46,
              zIndex: 999,
              backgroundColor: "#157AFF",
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontSize: 16 }}>Save</Text>
            )}
          </Pressable>
          <View
            style={{
              alignItems: "center",
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "center",
            }}
          >
            {/*<When pressing the pencil, activate the textinput*/}
            <TextInput
              style={{ color: "#fff", fontSize: 24, textAlign: "center" }}
              value={routineName}
              ref={refInputRoutineName}
              onChangeText={(text) => setRoutineName(text)}
            />
            <Pressable onPress={() => refInputRoutineName.current.focus()}>
              <Ionicons
                name="pencil-outline"
                size={20}
                color="white"
                style={{ marginLeft: 5 }}
              />
            </Pressable>
          </View>
        </View>
        {/* Carrousel de los dias */}
        <CarouselDays
          currentDay={currentDay}
          setCurrentDay={setCurrentDay}
          totalDays={totalDays}
        />
        <View
          style={{
            width: "100%",
            minHeight: 600,
            backgroundColor: "#0B0B0B",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            marginTop: 20,
            paddingTop: 16,
          }}
        >
          {/*aqui la parte de abajo (editar nombre dia y agregar ejercicios)*/}
          <View
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 20,
              paddingVertical: 10,
              marginBottom: 20,
            }}
          >
            <View>
              <View
                style={{
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <TextInput
                  style={{ color: "#fff", fontSize: 20, textAlign: "center" }}
                  value={daysNames[currentDay]}
                  ref={refInputDayName}
                  onChangeText={(text) => {
                    const newDaysNames = [...daysNames];
                    newDaysNames[currentDay] = text;
                    setDaysNames(newDaysNames);
                  }}
                />
                <Pressable onPress={() => refInputDayName.current.focus()}>
                  <Ionicons
                    name="pencil-outline"
                    size={20}
                    color="white"
                    style={{ marginLeft: 5 }}
                  />
                </Pressable>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <Text
                  style={{ color: "#9095A1", fontSize: 12, marginRight: 5 }}
                >
                  {routine.days[currentDay].totalDuration ?? 0} min
                </Text>
                <Text
                  style={{ color: "#9095A1", fontSize: 12, marginRight: 5 }}
                >
                  {routine.days[currentDay].totalSets ?? 0} sets
                </Text>
                <Text
                  style={{ color: "#9095A1", fontSize: 12, marginRight: 5 }}
                >
                  {routine.days[currentDay].totalCalories ?? 0} cal
                </Text>
              </View>
            </View>
            <Pressable
              style={{
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
              onPress={() => navigation.navigate("Add Lift")}
            >
              <Ionicons name="add-outline" size={34} color="white" />
              <Text
                style={{ color: "#9095A1", fontSize: 10, textAlign: "center" }}
              >
                Add Lift
              </Text>
            </Pressable>
          </View>
          <View style={styles.containerExercises}>
            <View style={styles.exercises}>
              <EditingRoutineExerciseList
                exercices={routine.days[currentDay].exercises}
                navigation={navigation}
              />
            </View>
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#24262B",
    alignItems: "center",
    paddingTop: Constants.statusBarHeight,
  },

  home: {
    display: "flex",
    alignItems: "center",
    width: "100%",
  },

  topBar: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    marginTop: 20,
    marginBottom: 40,
    top: 0,
    zIndex: 900,
    backgroundColor: "#24262B",
  },

  title: {
    fontSize: 20,
    fontWeight: "normal",
    color: "#fff",
    textAlign: "center",
  },

  containerExercises: {
    flex: 1,
    backgroundColor: "#0B0B0B",
    alignItems: "center",
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 600,
  },

  exercises: {
    width: "100%",
    backgroundColor: "#0b0b0b",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 120,
    minHeight: 600,
  },
});