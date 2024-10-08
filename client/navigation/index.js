import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  // LoginScreen, 
  // HomeScreen, 
  DashBoardScreen, 
  QRCodeScanner, 
  CylinderScreen, 
  TransactionSuccessScreen, 
  AddFileScreen, 
  AddCylinderScreen, 
  RegularLoginScreen, 
  AddClientScreen,
  AddUserScreen,
  ManageCylinder,
  AddPackageScreen,
  AddCylindersToPackageScreen,
  ManageDuraCylinder,
  DuraCylinderScreen,
  AddDuraCylinderScreen,
  AddDuraCylinderFileScreen,
  ManagePackage,
  PermanentPackageScreen
} from "./../screens";
import useAuthContext from "../hooks/useAuthContext";
import {useState, useEffect} from "react";
import axios from "./../utils/axios";
import {Alert} from "react-native";
import getUserRoles from "../utils/getUserRoles";

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
      if (isLoggedIn && user) {
        getUserRoles(user.email).then(role => setRole(role));
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
              {/* <AuthStack.Screen
                name="Home"
                component={LoginScreen}
                options={{
                  title: "Login Screen",
                }}
              /> */}

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
            {/* <MainTabs.Screen
              name="home"
              component={HomeScreen}
              options={{
                title: "Home"
              }}
            /> */}
            {/* <MainTabs.Screen
              name="login"
              component={LoginScreen}
              options={{
                title: "Login"
              }}
            /> */}

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
              name="duracylinder"
              component={DuraCylinderScreen}
              options={{
                title: "Dura Cylinder"
              }}
            />

            <MainTabs.Screen
              name="permanentPackage"
              component={PermanentPackageScreen}
              options={{
                title: "Permanent package"
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
                title: "Add bulk cylinders"
              }}
            />

            <MainTabs.Screen
              name="addDuraFile"
              component={AddDuraCylinderFileScreen}
              options={{
                title: "Add bulk dura cylinders"
              }}
            />

            <MainTabs.Screen
              name="manageCylinder"
              component={ManageCylinder}
              options={{
                title: "Manage Cylinders"
              }}
            />

            <MainTabs.Screen
              name="managePackage"
              component={ManagePackage}
              options={{
                title: "Manage Packages"
              }}
            />

            <MainTabs.Screen
              name="manageDuraCylinder"
              component={ManageDuraCylinder}
              options={{
                title: "Manage Dura Cylinders"
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
              name="dashboard"
              component={DashBoardScreen}
              options={{
                title: "Dashboard"
              }}
            />
            
          <AdminTabs.Screen
            name="addcylinder"
            component={AddCylinderScreen}
            options={{
              title: "Add Cylinder"
            }}
          />

        <AdminTabs.Screen
            name="addDuraCylinder"
            component={AddDuraCylinderScreen}
            options={{
              title: "Add Dura Cylinder"
            }}
          />

          {/* <AdminTabs.Screen
              name="home"
              component={HomeScreen}
              options={{
                title: "Home"
              }}
            /> */}
            {/* <AdminTabs.Screen
              name="login"
              component={LoginScreen}
              options={{
                title: "Login"
              }}
            /> */}

           

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
              name="permanentPackage"
              component={PermanentPackageScreen}
              options={{
                title: "Permanent package"
              }}
            />

            <AdminTabs.Screen
              name="duracylinder"
              component={DuraCylinderScreen}
              options={{
                title: "Dura Cylinder"
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
                title: "Add bulk cylinders"
              }}
            />

            <AdminTabs.Screen
              name="addDuraFile"
              component={AddDuraCylinderFileScreen}
              options={{
                title: "Add bulk dura cylinders"
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
                title: "Manage User"
              }}
            />

            <AdminTabs.Screen
              name="manageCylinder"
              component={ManageCylinder}
              options={{
                title: "Manage Cylinders"
              }}
            />

            <AdminTabs.Screen
              name="manageDuraCylinder"
              component={ManageDuraCylinder}
              options={{
                title: "Manage Dura Cylinders"
              }}
            />

            <AdminTabs.Screen
              name="managePackage"
              component={ManagePackage}
              options={{
                title: "Manage Packages"
              }}
            />

            <AdminTabs.Screen
              name="addPackage"
              component={AddPackageScreen}
              options={{
                title: "Add Package"
              }}
            />

            <AdminTabs.Screen
              name="addCylindersToPackage"
              component={AddCylindersToPackageScreen}
              options={{
                title: "Add Cylinders to Package"
              }}
            />
        </AdminTabs.Navigator>

        
      );
    };
    let content;
    if(isLoggedIn) {
      content = <MainUserTabsNavigator />
      if(role?.includes("admin")) {
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