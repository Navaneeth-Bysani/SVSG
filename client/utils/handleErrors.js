import { Alert } from "react-native";

const handleErrors = (error) => {
    if(error.response.status === 404) {
        Alert.alert(`Not found anything with ${barcode}`);
    } else {
        Alert.alert("Something went wrong");
        console.error(error);
    }
}

export default handleErrors;