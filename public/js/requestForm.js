
const requestForm = document.getElementById("requestForm");
const passengerList = document.getElementById("passengerList");
const tripList = document.getElementById("tripList");

const requestId = document.getElementById("requestId");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const errorMessage = document.getElementById("errorMessage");
const message = document.getElementById("message");

const API_URL = "/api/requests";

// -------------------------
// PASSENGER INPUTS
// -------------------------

function addPassenger(name = "") {
    const inputs = passengerList.querySelectorAll(".passenger-input");
    const lastInput = inputs[inputs.length - 1];

    if (lastInput && !lastInput.value.trim()) {
        lastInput.focus();
        return;
    }

    const row = document.createElement("div");
    row.className = "passenger-row";

    row.innerHTML = `
        <span class="number"></span>
        <input
            type="text"
            class="passenger-input"
            placeholder="Passenger name"
        >
        <button type="button" class="add-passenger">+</button>
        <button type="button" class="remove-passenger">X</button>
    `;

    row.querySelector(".passenger-input").value = name;

    passengerList.appendChild(row);
    updatePassengerNumbers();

    row.querySelector(".passenger-input").focus();
}

function updatePassengerNumbers() {
    const rows = passengerList.querySelectorAll(".passenger-row");

    rows.forEach((row, index) => {
        row.querySelector(".number").textContent = `${index + 1}.`;
    });
}

function resetPassengers(names = [""]) {
    passengerList.innerHTML = "";

    names.forEach(name => {
        const row = document.createElement("div");
        row.className = "passenger-row";

        row.innerHTML = `
            <span class="number"></span>
            <input
                type="text"
                class="passenger-input"
                placeholder="Passenger name"
            >
            <button type="button" class="add-passenger">+</button>
            <button type="button" class="remove-passenger">X</button>
        `;

        row.querySelector(".passenger-input").value = name;
        passengerList.appendChild(row);
    });

    updatePassengerNumbers();
}

passengerList.addEventListener("click", event => {
    if (event.target.classList.contains("add-passenger")) {
        addPassenger();
    }

    if (event.target.classList.contains("remove-passenger")) {
        const row = event.target.closest(".passenger-row");
        const rows = passengerList.querySelectorAll(".passenger-row");

        if (rows.length === 1) {
            row.querySelector(".passenger-input").value = "";
        } else {
            row.remove();
        }

        updatePassengerNumbers();
    }
});

passengerList.addEventListener("keydown", event => {
    if (
        event.key === "Enter" &&
        event.target.classList.contains("passenger-input")
    ) {
        event.preventDefault();

        if (event.target.value.trim()) {
            addPassenger();
        }
    }
});

// -------------------------
// READ: GET ALL TRIPS
// -------------------------

async function loadTrips() {
    try {
        const response = await fetch(API_URL);
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Failed to load trips.");
        }

        renderTrips(result.data);
    } catch (error) {
        tripList.textContent = error.message;
    }
}

function renderTrips(trips) {
    tripList.innerHTML = "";

    if (trips.length === 0) {
        tripList.textContent = "No trip requests yet.";
        return;
    }

    trips.forEach(trip => {
        const card = document.createElement("div");
        card.className = "trip-card";

        // Use textContent for user-provided values.
        const heading = document.createElement("h3");
        heading.textContent = `Trip #${trip.id} — ${trip.requestor}`;

        const details = document.createElement("p");
        details.textContent =
            `${String(trip.date).slice(0, 10)} | ` +
            `${String(trip.timeStart).slice(0, 5)} - ` +
            `${String(trip.timeEnd).slice(0, 5)}`;

        const purpose = document.createElement("p");
        purpose.textContent = `Purpose: ${trip.purpose}`;

        const passengers = document.createElement("p");
        passengers.textContent =
        `Passengers: ${(trip.passengers || [])
            .map(passenger => passenger.name)
            .join(", ")}`;

        const editBtn = document.createElement("button");
        editBtn.type = "button";
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", () => editTrip(trip.id));

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => deleteTrip(trip.id));

        card.append(heading, details, purpose, passengers, editBtn, deleteBtn);
        tripList.appendChild(card);
    });
}

// -------------------------
// CREATE / UPDATE
// -------------------------

requestForm.addEventListener("submit", async event => {
    event.preventDefault();

    errorMessage.textContent = "";
    message.textContent = "";

   const passengers = [
        ...passengerList.querySelectorAll(".passenger-input")
    ]
        .map(input => input.value.trim())
        .filter(name => name !== "")
        .map(name => ({ name }));

    const data = {
        requestor: document.getElementById("requestor").value.trim(),
        date: document.getElementById("date").value,
        timeStart: document.getElementById("timeStart").value,
        timeEnd: document.getElementById("timeEnd").value,
        purpose: document.getElementById("purpose").value.trim(),
        passengers
    };

    const isEditing = Boolean(requestId.value);

    try {
        const response = await fetch(
            isEditing ? `${API_URL}/${requestId.value}` : API_URL,
            {
                method: isEditing ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Failed to save trip.");
        }

        message.textContent = result.message;
        resetForm();
        await loadTrips();
    } catch (error) {
        errorMessage.textContent = error.message;
    }
});

// -------------------------
// READ ONE: LOAD FOR EDITING
// -------------------------

async function editTrip(id) {
    errorMessage.textContent = "";
    message.textContent = "";

    try {
        const response = await fetch(`${API_URL}/${id}`);
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Failed to load trip.");
        }

        const trip = result.data;

        requestId.value = trip.id;
        document.getElementById("requestor").value = trip.requestor;
        document.getElementById("date").value =
            String(trip.date).slice(0, 10);
        document.getElementById("timeStart").value =
            String(trip.timeStart).slice(0, 5);
        document.getElementById("timeEnd").value =
            String(trip.timeEnd).slice(0, 5);
        document.getElementById("purpose").value = trip.purpose;

        resetPassengers(
            trip.passengers?.length
                ? trip.passengers.map(passenger => passenger.name)
                : [""]
        );

        formTitle.textContent = "Edit Trip";
        submitBtn.textContent = "Update Trip";
        cancelEditBtn.style.display = "inline-block";

        requestForm.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
        errorMessage.textContent = error.message;
    }
}

// -------------------------
// DELETE
// -------------------------

async function deleteTrip(id) {
    if (!confirm(`Delete trip #${id}? This cannot be undone.`)) {
        return;
    }

    errorMessage.textContent = "";
    message.textContent = "";

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Failed to delete trip.");
        }

        message.textContent = result.message;

        if (requestId.value === String(id)) {
            resetForm();
        }

        await loadTrips();
    } catch (error) {
        errorMessage.textContent = error.message;
    }
}

// -------------------------
// RESET FORM
// -------------------------

function resetForm() {
    requestForm.reset();
    requestId.value = "";

    resetPassengers([""]);

    formTitle.textContent = "Create New Trip";
    submitBtn.textContent = "Create Trip";
    cancelEditBtn.style.display = "none";
}

cancelEditBtn.addEventListener("click", resetForm);

// -------------------------
// INITIAL LOAD
// -------------------------

resetPassengers([""]);
loadTrips();
