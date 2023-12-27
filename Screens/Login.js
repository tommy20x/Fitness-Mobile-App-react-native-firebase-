import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Pressable, KeyboardAvoidingView, Image } from 'react-native';
import React, { useState } from 'react';
import { FIREBASE_AUTH } from '../firebaseConfig';
import { signInWithEmailAndPassword } from "firebase/auth";

import SuccessNotification from '../components/SuccessNotification';
import ErrorNotification from '../components/ErrorNotification';
import PrimaryNotification from '../components/PrimaryNotification';

export default function Signup({ navigation }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const auth = FIREBASE_AUTH;

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  }

  const handleSignin = async () => {

    setLoading(true);

    if (email === '') {
      setLoading(false);
      setTimeout(() => {
        setError(false);
      }, 3000);
      setError('Por favor ingresa tu email');
      return;
    }

    // check if email is valid
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setLoading(false);
      setTimeout(() => {
        setError(false);
      }, 3000);
      setError('Por favor ingresa un email válido');
      return;
    }

    if (password === '') {
      setLoading(false);
      setTimeout(() => {
        setError(false);
      }, 3000);
      setError('Por favor ingresa tu contraseña');
      return;
    }

    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      // console.log(response);
      setLoading(false);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      setSuccess('Se ha iniciado sesión correctamente');
    } catch (error) {
      // console.log(error);
      setTimeout(() => {
        setError(false);
      }, 3000);
      setError('Hubo un error al iniciar sesión');
      return;
    }

  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      { success && <SuccessNotification message={success} /> }
      { error && <ErrorNotification message={error} /> }
      { loading && <PrimaryNotification message="Cargando..." /> }
      <View style={{width: '100%', alignItems: 'center'}}>
      <Text style={styles.title}>wellness</Text>
      <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
      <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="email@example.com"
            placeholderTextColor={'rgba(147, 146, 154, 0.8)'}
            value={email}
            onChangeText={setEmail}
            keyboardType='email-address'
          />
      </View>
      <View style={styles.formGroup}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="********"
            placeholderTextColor={'rgba(147, 146, 154, 0.8)'}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <Pressable onPress={handleShowPassword} style={{position: 'absolute', right: 0, height: 25, width: 25, zIndex: 999}}>
            {
              showPassword ? (
                <Image style={styles.showHide} source={require('../assets/eye-off.png')} />
              ) : (
                <Image style={styles.showHide} source={require('../assets/eye.png')} />
              )
            }
          </Pressable>
      </View>
      <Text style={styles.label}> ¿Olvidaste tu <Text style={{color: '#0496FF', fontWeight: 'bold'}}>contraseña</Text>?</Text>
      <Pressable
        style={styles.btn}
        onPress={handleSignin}
      >
        <Text style={styles.btnText}>Entrar</Text>
      </Pressable>
      <Text style={styles.label}>¿No tienes una cuenta? <Text style={{color: '#0496FF', fontWeight: 'bold'}} onPress={() => navigation.navigate('Signup')}>Regístrate</Text></Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B0B',
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },

  title: {
    fontSize: 65,
    fontWeight: 'bold',
    color: '#0496FF',
    marginBottom: 0,
  },

  subtitle: {
    fontSize: 19,
    color: '#fff',
    marginBottom: 40,
  },

  formGroup: {
    width: '85%',
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    color: 'rgba(147, 146, 154, 1)',
    marginBottom: 10,
  },

  input: {
    height: 50,
    borderWidth: 0,
    borderRadius: 20,
    paddingHorizontal: 20,
    backgroundColor: "#1F1F1F",
    color: '#fff',
  },

  // send to bottom
  formGroupBtn: {
    width: '85%',
    marginBottom: 40,
    alignItems: 'center',
  },

  btn: {
    width: '85%',
    height: 48,
    backgroundColor: '#0496FF',
    borderRadius: 90,
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 16,
    marginTop: 70,
  },

  btnText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'normal',
    alignSelf: 'center',
    marginTop: 4,
  },

  showHide: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    position: 'absolute',
    right: 15,
    top: 40,
  }

});
