const catchAsync = require("../utils/catchAsync");
const Client = require("./../models/clientModel");

exports.createClient = catchAsync(async (req,res,next) => {
    const clientData = {
        name : req.body.name
    };

    const createdClient = await Client.create(clientData);

    res.status(201).json({
        createdClient
    })
})

exports.getAllClients = catchAsync(async(req,res,next) => {
    const clients = await Client.find();

    res.status(200).json({
        clients
    })
})