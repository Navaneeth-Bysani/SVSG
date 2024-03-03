import axios from "../axios";
import handleErrors from "../handleErrors";
import useAuthContext from "../../hooks/useAuthContext";

const getDuraCylinderFromBarcode = async(authToken, barcode) => {
    const response = await axios.get(`/duracylinder/barcode/${barcode}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                Accept: "application/json",
            }
    });
    const permanentPackage = response.data.data;
    return permanentPackage;
}

export default getDuraCylinderFromBarcode;