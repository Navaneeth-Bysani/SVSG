import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { AuthContextProvider } from "./contexts/AuthContext";
import { LoginScreen, HomeScreen } from './screens';
import AppNavigator from "./navigation";
import { Provider as PaperProvider } from "react-native-paper";

export default function App() {
  return (
    <AuthContextProvider>
      <PaperProvider>
        <AppNavigator />
      </PaperProvider>
    </AuthContextProvider>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// <View style={styles.container}>
      {/* <Text>Open up App.js to start working on your app!</Text> */}
      {/* <LoginScreen /> */}
       {/* <HomeScreen /> */}
      {/* <StatusBar style="auto" /> */}
      {/* <AppNavigator /> */}
    // </View>
