import axios from "../axios";
import handleErrors from "./../handleErrors";
import useAuthContext from "../../hooks/useAuthContext";
const getCylinderFromBarcode = async (authToken, barcode) => {
        const response = await axios.get(`/cylinder/barcode/${barcode}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                Accept: "application/json",
            }
        });
      const cylinder = response.data.data;
      return cylinder;
}

export default getCylinderFromBarcode;