    
const RequestService = require("../services/requestService");

const RequestService = require("../services/requestService");
const asyncHandler = require("../middleware/asyncHandler");

class RequestController {
    static getAll = asyncHandler(async (req, res) => {
        const data = await RequestService.getAll();

        res.json({ success: true, data });
    });

    static getById = asyncHandler(async (req, res) => {
        const data = await RequestService.getById(req.params.id);

        res.json({ success: true, data });
    });

    static create = asyncHandler(async (req, res) => {
        const userId = req.session.user.id;

        const data = await RequestService.create(
            req.body,
            userId
        );

        res.status(201).json({
            success: true,
            message: "Trip request created successfully.",
            data
        });
    });

    static update = asyncHandler(async (req, res) => {
        const data = await RequestService.update(
            req.params.id,
            req.body
        );

        res.json({
            success: true,
            message: "Trip request updated successfully.",
            data
        });
    });

    static delete = asyncHandler(async (req, res) => {
        await RequestService.delete(req.params.id);

        res.json({
            success: true,
            message: "Trip request deleted successfully."
        });
    });
}

module.exports = RequestController;
// req.session.user.id gets the ID of the user who logged in    
// req.body contains the trip form data.
// Both values are passed to the service.