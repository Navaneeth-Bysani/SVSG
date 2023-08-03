import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {LoginScreen, HomeScreen, DashBoardScreen, QRCodeScanner, MaterialScreen, TransactionSuccessScreen, AddFileScreen} from "./../screens";
import useAuthContext from "../hooks/useAuthContext";
import {useState, useEffect} from "react";
import axios from "./../utils/axios";

const AppNavigator = () => {

    const { user } = useAuthContext();
    // let user = null;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState("");

    const AuthStack = createNativeStackNavigator();

    useEffect(() => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    }, [user]);

    useEffect(() => {
      const getRole = async () => {
        const res = await axios.post("/user/getRole", {
          email: user.email,
        });
        setRole(res.data.role);
      };
      if (isLoggedIn) {
        getRole();
      }
    }, [isLoggedIn]);

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

            <MainTabs.Screen
              name="material"
              component={MaterialScreen}
              options={{
                title: "Material"
              }}
            />

            <MainTabs.Screen
              name="transactionSuccess"
              component={TransactionSuccessScreen}
              options={{
                title: "Transaction successful"
              }}
            />

            <MainTabs.Screen
              name="addFile"
              component={AddFileScreen}
              options={{
                title: "Add File Screen"
              }}
            />
          </MainTabs.Navigator>

          
        );
      };

    let content;
    if(isLoggedIn) {
        content = <MainUserTabsNavigator />
    } else {
        content = <AuthStackNavigator />
    }

    return (
        <NavigationContainer>
            {content}
            {/* <MainUserTabsNavigator /> */}
        </NavigationContainer>
    )
      
}

export default AppNavigator;