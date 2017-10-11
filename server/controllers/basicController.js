let express = require("express");

const basicController = {};

basicController.get = (req, res) => {
    res.status(200).json({
        success: true,
        data: "howdy"
    })
}


module.exports = basicController;