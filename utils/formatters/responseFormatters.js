const {getIndianDateTimeFromTimeStamp} = require("./dateTimeFormatters");


const format_cylinder_response = (data) => {
    const indian_manufactured_date = getIndianDateTimeFromTimeStamp(data.manufactured_date);
    const indian_last_test_date = getIndianDateTimeFromTimeStamp(data.last_test_date);
    const indian_test_due_date = getIndianDateTimeFromTimeStamp(data.test_due_date);

    const formattedData = {
        barcode : data.barcode,
        serial_number :  data.serial_number,
        product_code :  data.product_code,
        volume : data.volume,
        manufactured_date : `${indian_manufactured_date.date}`,
        manufacturer : data.manufacturer,
        owner : data.owner,
        branch : data.branch,
        status : data.status,
        batch_number : data.batch_number || "Not assigned yet",
        filling_pressure :  data.filling_pressure,
        grade : (data.status === "full" ? data.grade : "Not filled yet"),
        last_test_date : (data.last_test_date ? `${indian_last_test_date.date}` : "Not tested yet"),
        transaction_status : (data.isDispatched ? "Dispatched" : "In store"),
        actions : data.currentTrackId?.actions,
        trackingStatus : data.trackingStatus,
        tare_weight: data.tare_weight,
        test_due_date: `${indian_test_due_date.date}`,
        minimum_thickness: data.minimum_thickness,
        usage: data.usage,
        valve: data.valve,
        valve_gaurd: data.valve_gaurd
    };

    return formattedData;
}

const format_dura_cylinder_response = (data) => {
    const indian_last_test_date = getIndianDateTimeFromTimeStamp(data.last_test_date);
    const indian_test_due_date = getIndianDateTimeFromTimeStamp(data.test_due_date);

    console.log(data);
    const formattedData = {
        barcode : data.barcode,
        serial_number :  data.serial_number,
        volume : data.volume,
        status : data.status,
        batch_number : data.batch_number || "Not assigned yet",
        grade : (data.status === "full" ? data.grade : "Not filled yet"),
        last_test_date : (data.last_test_date ? `${indian_last_test_date.date}` : "Not tested yet"),
        transaction_status : (data.isDispatched ? "Dispatched" : "In store"),
        actions : data.currentTrackId?.actions,
        trackingStatus : data.trackingStatus,
        tare_weight: data.tare_weight,
        test_due_date: `${indian_test_due_date.date}`,
        valve: data.valve,
        trv: data.trv,
        level_gauge: data.level_gauge,
        pressure_gauge: data.pressure_gauge,
        make: data.make,
        frame: data.frame,
        adaptor: data.adaptor,
        service: data.service
    };

    return formattedData;
}

const format_permanent_package_response = (data) => {
    const indian_last_test_date = getIndianDateTimeFromTimeStamp(data.last_test_date);
    //cylinder populated data should be passed.
    const formattedData = {
        barcode : data.barcode,
        serial_number :  data.serial_number,
        status : data.status,
        last_test_date : (data.last_test_date ? `${indian_last_test_date.date}` : "Not tested yet"),
        working_pressure : data.working_pressure,
        valves: data.valves,
        manifold: data.manifold,
        wheels: data.wheels,
        service: data.service,
        number_of_cylinders: data.number_of_cylinders,
        cylinders: data.cylinders.map(cylinder => cylinder.barcode)
    }

    return formattedData;
}

module.exports = {format_cylinder_response, format_dura_cylinder_response, format_permanent_package_response};