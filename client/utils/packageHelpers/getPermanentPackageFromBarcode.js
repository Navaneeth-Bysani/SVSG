import axios from "../axios";
import handleErrors from "../handleErrors";
import useAuthContext from "../../hooks/useAuthContext";

const getPermanentPackageFromBarcode = async(authToken, barcode) => {
    try {
        const response = await axios.get(`/package/permanent/barcode/${barcode}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                Accept: "application/json",
            }
        });
      const permanentPackage = response.data.data;
      return permanentPackage;
    } catch (error) {
        handleErrors(error);
    }
}

export default getPermanentPackageFromBarcode;