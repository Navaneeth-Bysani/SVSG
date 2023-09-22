import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  LoginScreen, 
  HomeScreen, 
  DashBoardScreen, 
  QRCodeScanner, 
  CylinderScreen, 
  TransactionSuccessScreen, 
  AddFileScreen, 
  AddMaterialScreen, 
  RegularLoginScreen, 
  AddClientScreen,
  AddUserScreen
} from "./../screens";
import useAuthContext from "../hooks/useAuthContext";
import {useState, useEffect} from "react";
import axios from "./../utils/axios";
import {Alert} from "react-native";

const AppNavigator = () => {

    const { user, authToken } = useAuthContext();
    // let user = null;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState("");

    const AuthStack = createNativeStackNavigator();

    useEffect(() => {
      if (user && authToken) {
        // Alert.alert("Invoked");
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    }, [user, authToken]);

    useEffect(() => {
      const getRole = async () => {
        try {
          const res = await axios.post("/user/getRole", {
            email: user.email,
          });
          setRole(res.data.role);
        } catch (error) {
          Alert.alert("Something went wrong");
          console.error(error);
        }
        
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

            <AuthStack.Screen
                name="regularLogin"
                component={RegularLoginScreen}
                options={{
                  title: "Login with details",
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
              name="cylinder"
              component={CylinderScreen}
              options={{
                title: "Cylinder"
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

    const AdminTabs = createNativeStackNavigator();
    const AdminTabsNavigator = () => {
      return (
        <AdminTabs.Navigator
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
          <AdminTabs.Screen
            name="addmaterial"
            component={AddMaterialScreen}
            options={{
              title: "Add Material"
            }}
          />

          <AdminTabs.Screen
              name="home"
              component={HomeScreen}
              options={{
                title: "Home"
              }}
            />
            <AdminTabs.Screen
              name="login"
              component={LoginScreen}
              options={{
                title: "Login"
              }}
            />

            <AdminTabs.Screen
              name="dashboard"
              component={DashBoardScreen}
              options={{
                title: "Dashboard"
              }}
            />

            <AdminTabs.Screen
              name="qrscanner"
              component={QRCodeScanner}
              options={{
                title: "QR Scanner"
              }}
            />

            <AdminTabs.Screen
              name="cylinder"
              component={CylinderScreen}
              options={{
                title: "Cylinder"
              }}
            />

            <AdminTabs.Screen
              name="transactionSuccess"
              component={TransactionSuccessScreen}
              options={{
                title: "Transaction successful"
              }}
            />

            <AdminTabs.Screen
              name="addFile"
              component={AddFileScreen}
              options={{
                title: "Add File Screen"
              }}
            />

            <AdminTabs.Screen
              name="addClient"
              component={AddClientScreen}
              options={{
                title: "Add Client Screen"
              }}
            />

            <AdminTabs.Screen
              name="addUser"
              component={AddUserScreen}
              options={{
                title: "Add User Screen"
              }}
            />
        </AdminTabs.Navigator>

        
      );
    };
    let content;
    if(isLoggedIn) {
      content = <MainUserTabsNavigator />
      if(role === "admin") {
        content = <AdminTabsNavigator />
      }
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