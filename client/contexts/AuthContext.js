import { createContext, useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  getItemAsync,
  setItemAsync,
  isAvailableAsync,
  deleteItemAsync,
} from "expo-secure-store";
import sleep from "../utils/sleep";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState("");

  const login = async (newUser, token) => {
    try {
      // Alert.alert(`2  ${token}`);

      await setItemAsync("user", JSON.stringify(newUser));
      await setItemAsync("authToken", token);
      setUser(newUser);
      setAuthToken(token);
    } catch (error) {
      Alert.alert("Error", "Failed to store rider credentials on your device");
      setUser(null);
      throw new Error(error);
    }
  };

  const logout = async () => {
    try {
      await deleteItemAsync("user");
      await deleteItemAsync("authToken");
      setUser(null);
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to remove rider credentials from your device"
      );
      console.log(error);
      console.log(error.stack);
    }
  };

  useEffect(() => {
    const getUserFromStorage = async () => {
      await sleep(2000);
      try {
        const isSecureStoreAvailable = await isAvailableAsync();
        if (isSecureStoreAvailable) {
          const storedUser = await getItemAsync("user");
          if (storedUser !== null) {
            setUser(JSON.parse(storedUser));
          }
        }
        setLoading(false);
      } catch (error) {
        Alert.alert("Login Required", error.status);
        console.log(error);
      }
    };

    getUserFromStorage();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        authToken,
      }}
    >
      {loading && (
        <View style={styles.container}>
          <ActivityIndicator></ActivityIndicator>
        </View>
      )}
      {!loading && children}
    </AuthContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  logo: {
    height: 300,
    aspectRatio: 1,
  },
});
