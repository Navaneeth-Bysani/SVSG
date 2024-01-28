import axios from "./axios";
import { Alert
 } from "react-native";
const getUserRoles = async (email) => {
    try {
        const res = await axios.post("/user/getRole", {
          email
        });
        const role = res.data.role;
        return role;
    } catch (error) {
      switch (error.response?.status) {
        case 400:
          Alert.alert("Please provide email");
          break;
        case 404:
          Alert.alert("No user found with that email");
        default:
          Alert.alert("Something went wrong");
          break;
      }
    }
    
};

export default getUserRoles;