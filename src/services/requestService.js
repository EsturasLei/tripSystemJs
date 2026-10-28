
const RequestRepository = require("../repositories/requestRepository");

class RequestService {
    static validate(data) {
    const { requestor, date, timeStart, timeEnd, purpose, passengers } = data;

        if (
            !requestor?.trim() ||
            !date ||
            !timeStart ||
            !timeEnd ||
            !purpose?.trim()
        ) {
            throw new Error("Please complete all required fields.");
        }

        if (timeEnd <= timeStart) {
            throw new Error("End time must be later than start time.");
        }

        if (!Array.isArray(passengers)) {
            throw new Error("Passengers must be an array.");
        }

        console.log("Received passengers:", passengers);

        const cleanedPassengers = passengers
            .map(passenger => {
                if (typeof passenger === "string") {
                    return { name: passenger.trim() };
                }

                return {
                    name: typeof passenger?.name === "string"
                        ? passenger.name.trim()
                        : ""
                };
            })
            .filter(passenger => passenger.name !== "");

        console.log("Cleaned passengers:", cleanedPassengers);

        if (cleanedPassengers.length === 0) {
            throw new Error("Add at least one passenger.");
        }

        return {
            requestor: requestor.trim(),
            date,
            timeStart,
            timeEnd,
            purpose: purpose.trim(),
            passengers: cleanedPassengers
        };
    }
    static async getAll(userId, role) {
        return RequestRepository.findAll(userId, role);
    }

    static async getById(id, userId, role) {
        const request = await RequestRepository.findById(id, userId, role);

        if (!request) {
            const error = new Error("Trip request not found.");
            error.status = 404;
            throw error;
        }

        return request;
    }

    static async create(data, userId) {
        const cleanedData = this.validate(data);
        return RequestRepository.create(cleanedData, userId);
    }

    static async update(id, data, userId, role) {
        const cleanedData = this.validate(data);
        const request = await RequestRepository.update(id, cleanedData, userId, role);

        if (!request) {
            const error = new Error("Trip request not found.");
            error.status = 404;
            throw error;
        }

        return request;
    }

    static async delete(id, userId, role) {
        const deleted = await RequestRepository.delete(id, userId, role);

        if (!deleted) {
           const error = new Error("Trip request not found.");
            error.status = 404;
            throw error;
        }

        return deleted;
    }
}

module.exports = RequestService;
