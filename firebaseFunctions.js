import { FIRESTORE } from "./firebaseConfig";

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

export const getRoutines = async (
  userId,
  setRoutines,
  setError,
  setRefreshing,
) => {
  setRefreshing(true);
  console.log("getting routines");

  // get the user's routines' ids, they are stored in the user's document
  // it is an array of strings
  try {
    const userDocRef = doc(FIRESTORE, "users", userId);
    const userDocSnap = await getDoc(userDocRef);
    const userDocData = userDocSnap.data();
    const userRoutinesIds = userDocData.routines;

    if (userRoutinesIds.length === 0) {
      setRoutines([]);
      setRefreshing(false);
      return;
    }

    console.log("AFTER GETTING USER'S ROUTINES' IDS");

    // after getting the ids, get the routines from the routines collection
    // and store them in the state
    const routines = [];

    for (const id of userRoutinesIds) {
      const routineDocRef = doc(FIRESTORE, "routines", id);
      const routineDocSnap = await getDoc(routineDocRef);
      const routineDocData = routineDocSnap.data();
      // create a new object with the id and the dayDocData
      const routine = {
        id: id,
        ...routineDocData,
      };
      routines.push(routine);
    }

    console.log("AFTER GETTING ROUTINES");

    // after getting the routines, we need to get all the day's ids
    // and then get the days from the days collection

    for (const routine of routines) {
      const days = [];

      for (const id of routine.days) {
        const dayDocRef = doc(FIRESTORE, "days", id);
        const dayDocSnap = await getDoc(dayDocRef);
        const dayDocData = dayDocSnap.data();
        // create a new object with the id and the dayDocData
        const day = {
          id: id,
          ...dayDocData,
        };
        days.push(day);
      }

      routine.days = days;
    }

    console.log("AFTER GETTING DAYS");

    // after getting the days, we need to get all the exercise's ids
    // and then get the exercises from the exercises collection
    // and then add them to the days

    setRoutines(routines);
    setRefreshing(false);
    return routines;
  } catch (err) {
    setError(err);
    setRefreshing(false);
    console.log(err);
    return;
  }
};

export const saveEditedRoutine = async (
  userId,
  routine,
  setError,
  setLoading,
) => {
  console.log("saving edited routine");
  console.log(routine);
  console.log(userId);

  setLoading(true);
  setError(null);

  try {
    // for the routine document, we only need to update the name and the updatedAt fields
    const routineDocRef = doc(FIRESTORE, "routines", routine.id);
    await updateDoc(routineDocRef, {
      routineName: routine.routineName,
      updatedAt: new Date(),
    });

    console.log("updated routine");

    // for the days documents, for each day we need to update the name and the exercises fields
    // the exercises array is the same as the one in the object in the routine.days array
    // so we can just update the whole array
    for (const day of routine.days) {
      const dayDocRef = doc(FIRESTORE, "days", day.id);
      await updateDoc(dayDocRef, {
        dayName: day.dayName,
        exercises: day.exercises,
      });
    }

    console.log("updated days");

    setLoading(false);
    return;
  } catch (err) {
    setError(err);
    setLoading(false);
    console.log(err);
    return;
  }
};

export const userSavedExercises = async (
  userId,
  setExercises,
  setError,
  setRefreshing,
) => {
  // from the user document, get the ids of the exercises
  // and then get the exercises from the exercises collection

  setRefreshing(true);
  setError(null);

  try {
    const userDocRef = doc(FIRESTORE, "users", userId);
    const userDocSnap = await getDoc(userDocRef);
    const userDocData = userDocSnap.data();
    const userExercisesIds = userDocData.exercises;

    if (userExercisesIds.length === 0) {
      setExercises([]);
      setRefreshing(false);
      return;
    }

    const exercises = [];

    for (const id of userExercisesIds) {
      const exerciseDocRef = doc(FIRESTORE, "exercises", id);
      const exerciseDocSnap = await getDoc(exerciseDocRef);
      const exerciseDocData = exerciseDocSnap.data();
      // create a new object with the id and the data
      const exercise = {
        id: id,
        ...exerciseDocData,
      };
      exercises.push(exercise);
    }

    setExercises(exercises);
    setRefreshing(false);
    return exercises;
  } catch (err) {
    setError(err);
    setRefreshing(false);
    return;
  }
};
