import { FIRESTORE, FIREBASE_AUTH } from "../../firebaseConfig.js";
import { doc, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

/**
 * @param {Object} questions - Object containing the user's answers to the initial questions
 * @returns {Promise<void>} - Promise that resolves when the user's answers are successfully registered
 * @description - Registers the user's answers to the initial questions in the database
 */
export const registerInitialQuestions = async (questions) => {
  const userId = FIREBASE_AUTH.currentUser.uid;
  const email = FIREBASE_AUTH.currentUser.email;

  if (!userId) {
    throw new Error("No user found");
  }

  if (!email) {
    throw new Error("No email found");
  }

  if (!checkQuestion(questions)) {
    throw new Error("Invalid questions");
  }

  try {
    await updateProfile(FIREBASE_AUTH.currentUser, {
      displayName: questions.name,
    });
    await setDoc(doc(FIRESTORE, "users", userId), {
      name: questions.name,
      gender: questions.gender,
      age: questions.age,
      weight: questions.weight,
      weightUnit: questions.weightUnit,
      height: questions.height,
      heightUnit: questions.heightUnit,
      prevExperience: questions.prevExperience,
      fitnessLevel: questions.fitnessLevel,
      physicalLimitations: questions.physicalLimitations,
      objectives: questions.objectives,
      dietPreference: questions.dietPreference,
      trainingFrequency: questions.trainingFrequency,
      trainingDuration: questions.trainingDuration,
      trainingHours: questions.trainingHours,
      email: email,
      weightRecord: [],
      workouts: [],
      routines: [],
      exercises: [],
      showwHeightAndWeight: true,
      finishedWorkouts: 0,
      hoursTrained: 0,
      achievements: 0,
      bio: "",
      privateProfile: false,
      pushNotifications: true,
      workoutReminders: true,
      sound: true,
      vibrations: true,
      gym: "",
      badges: [],
    });
  } catch (error) {
    throw new Error("Error setting document: ", error);
  }
};

const checkQuestion = (questions) => {
  if (questions.name === "") {
    return false;
  }
  if (questions.gender === "") {
    return false;
  }
  if (questions.age === "") {
    return false;
  }
  if (questions.weight === "") {
    return false;
  }
  if (questions.weightUnit === "") {
    return false;
  }
  if (questions.height === "") {
    return false;
  }
  if (questions.heightUnit === "") {
    return false;
  }
  if (questions.prevExperience === "") {
    return false;
  }
  if (questions.fitnessLevel === "") {
    return false;
  }
  if (questions.physicalLimitations === "") {
    return false;
  }
  if (questions.objectives === "") {
    return false;
  }
  if (questions.dietPreference === "") {
    return false;
  }
  if (questions.trainingFrequency === "") {
    return false;
  }
  if (questions.trainingDuration === "") {
    return false;
  }
  if (questions.trainingHours === "") {
    return false;
  }
  return true;
};
