import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {LoginScreen, HomeScreen, DashBoardScreen, QRCodeScanner} from "./../screens";

const AppNavigator = () => {

    const AuthStack = createNativeStackNavigator();

    const AuthStackNavigator = () => {
        return (
            <AuthStack.Navigator
              screenOptions={{
                headerShown: false,
                animation: "none",
                contentStyle: {
                  backgroundColor: "white",
                },
              }}
            >
              <AuthStack.Screen
                name="Home"
                component={LoginScreen}
                options={{
                  title: "Login Screen",
                }}
              />
            </AuthStack.Navigator>
          );
    }

    const MainTabs = createNativeStackNavigator();
    const MainUserTabsNavigator = () => {
        return (
          <MainTabs.Navigator
            sceneContainerStyle={{ backgroundColor: "white" }}
            screenOptions={{
            //   headerShown: false,
              animation: "none",
              contentStyle: {
                backgroundColor: "white",
                // padding : "3 px"
              },
            }}
          >
            <MainTabs.Screen
              name="home"
              component={HomeScreen}
              options={{
                title: "Home"
              }}
            />
            <MainTabs.Screen
              name="login"
              component={LoginScreen}
              options={{
                title: "Login"
              }}
            />

            <MainTabs.Screen
              name="dashboard"
              component={DashBoardScreen}
              options={{
                title: "Dashboard"
              }}
            />

            <MainTabs.Screen
              name="qrscanner"
              component={QRCodeScanner}
              options={{
                title: "QR Scanner"
              }}
            />
          </MainTabs.Navigator>
        );
      };

    const isLoggedIn = true;
    let content;
    if(isLoggedIn) {
        content = <MainUserTabsNavigator />
    } else {
        content = <AuthStackNavigator />
    }

    return (
        <NavigationContainer>
            {/* {content} */}
            <MainUserTabsNavigator />
        </NavigationContainer>
    )
      
}

export default AppNavigator;