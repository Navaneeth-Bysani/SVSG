const Excel = require("exceljs");
const catchAsync = require("./catchAsync");
const path = require("path");

const createExcel = async (workbookName, headers, data) => {
    try {
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet('sheet1');

        worksheet.columns = headers;

        data.forEach(element => {
            worksheet.addRow(element);
        });

        const filePath = path.resolve(__dirname, `${workbookName}.xlsx`);
        await workbook.xlsx.writeFile(filePath);

        return filePath;
    } catch(err) {
        console.log(err);
        return "";
    }
    
}

module.exports = createExcel;