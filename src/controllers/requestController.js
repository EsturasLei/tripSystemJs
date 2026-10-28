    
const RequestService = require("../services/requestService");
const asyncHandler = require("../middleware/asyncHandler");

class RequestController {
    static getAll = asyncHandler(async (req, res) => {
        const { id: userId, role } = req.session.user;
        const data = await RequestService.getAll(userId, role);
        res.json({ success: true, data });
    });

    static getById = asyncHandler(async (req, res) => {
        const { id: userId, role } = req.session.user;

        const data = await RequestService.getById(
            req.params.id,
            userId,
            role
        );

        res.json({ success: true, data });
    });

    static create = asyncHandler(async (req, res) => {

        console.log("Session user:", req.session.user);
        const userId = req.session.user.id;

        const data = await RequestService.create(
            req.body,
            userId
        );
        console.log("Created request:", data);

        res.status(201).json({
            success: true,
            message: "Trip request created successfully.",
            data
        });
    });

    static update = asyncHandler(async (req, res) => {
        const { id: userId, role } = req.session.user;
        const data = await RequestService.update(
            req.params.id,
            req.body,
            userId,
            role
        );

        res.json({
            success: true,
            message: "Trip request updated successfully.",
            data
        });
    });

    static delete = asyncHandler(async (req, res) => {

        const { id: userId, role} = req.session.user;

        await RequestService.delete(req.params.id, userId, role);

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