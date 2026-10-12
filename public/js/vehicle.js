    document.addEventListener('DOMContentLoaded', () => {
        const vehicleForm = document.getElementById('vehicleForm');
        const vehicleIdInput = document.getElementById('vehicleId');
        const vehiclePlateNumber = document.getElementById('plateNumber');
        const vehicleBrand = document.getElementById('brand');
        const vehicleModel = document.getElementById('model');
        const vehicleStatus = document.getElementById('status');

        const formTitle = document.getElementById('formTitle');
        const submitBtn = document.getElementById('submitBtn');
        const cancelEditBtn = document.getElementById('cancelEditBtn');

        const vehicleTableBody = document.getElementById('vehicleTableBody');
        const errorMessage = document.getElementById('errorMessage');

        const API_URL = '/api/vehicles';

        function showMessage(message, type){
            const messageBox = document.getElementById("message");

            messageBox.textContent = message;
            messageBox.style.display = "block"

            if (type === "success"){
                messageBox.style.color = "green";
            } else {
                messageBox.style.color = "red";
            }

            setTimeout(() => {
                messageBox.textContent = "";
                messageBox.style.display = "none"
            }, 3000);
        }

        async function fetchVehicles() {
            try{
                const response = await fetch(API_URL);
                if(!response.ok) throw new Error('Failed to fetch Driver.');

                const vehicles = await response.json();


                vehicleTableBody.innerHTML = '';

                if (vehicles.length ===0){
                    vehicleTableBody.innerHTML = `<tr><td colspan="3" style= "text-align:center;">NO VEHICLE FOUND</td></tr>`;
                    return;
                }
                vehicles.forEach(vehicle => {
                    const row = document.createElement('tr');

                    const plateNumber = vehicle.plate_number;
                    const brand = vehicle.brand;
                    const model = vehicle.model;
                    const status = vehicle.status;  

                    row.innerHTML = `
                        <td>${vehicle.id}</td>
                        <td>${plateNumber}</td>
                        <td>${brand}</td>
                        <td>${model}</td>
                        <td>${status}</td>
                        <td style = "text-align: right;">
                            <button class="edit-btn" 
                            data-id="${vehicle.id}" 
                            data-plateNumber="${plateNumber}"
                            data-brand="${brand}"
                            data-model="${model}"
                            data-status="${status}"

                            style="background-color: #3498db;
                            padding: 5px 10px; 
                            font-size: 13px; 
                            margin-right: 5px;"
                            >edit</button>

                            <button class="delete-btn" 
                            data-id="${vehicle.id}" 
                            style ="background-color: #e74c3c"; 
                            padding: 5px 10px;
                            font-size: 13px;"
                            >Delete</button>
                        </td>                       
                    `;
                    vehicleTableBody.appendChild(row);

                });
               
                attachEventListeners();
            }catch(error){
                errorMessage.textContent = error.message;
            }
        }
        function attachEventListeners(){
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    const plateNumber = e.target.getAttribute('data-plateNumber');
                    const brand = e.target.getAttribute('data-brand');
                    const model = e.target.getAttribute('data-model');
                    const status = e.target.getAttribute('data-status');
                    
                    vehicleIdInput.value = id;
                    vehiclePlateNumber.value = plateNumber;
                    vehicleBrand.value = brand;
                    vehicleModel.value = model;
                    vehicleStatus.value = status;

                    formTitle.textContent = 'Edit Vehicle Details';
                    submitBtn.textContent = 'Update Driver';
                    submitBtn.style.backgroundColor = "#3498db";
                    cancelEditBtn.style.display = "inline-block";
                    window.scrollTo({ top: 0, behavior: 'smooth'});



                });
            });

            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = e.target.getAttribute('data-id');
                    if (confirm(`Are you sure you want to delete Vehicle ID #${id}?`)) {
                        try{
                            const response = await fetch(`${API_URL}/${id}`, {method: 'DELETE'});
                            const result = await response.json();

                            if (!response.ok){
                                throw new Error(result.message)
                            }

                            showMessage(result.message, "success");

                            resetFormState();
                            fetchVehicles();    

                        } catch(error){
                            errorMessage.textContent = error.message;
                        }
                    }
                });
            });



        }
        vehicleForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorMessage.textContent = '';

            const id = vehicleIdInput.value.trim();

            const plateNumber = document.getElementById('plateNumber').value.trim();
            const brand = document.getElementById("brand").value.trim();
            const model = document.getElementById("model").value.trim();
            const status = document.getElementById("status").value.trim();

            const method = id ? 'PUT' : 'POST';
            const targetUrl = id ? `${API_URL}/${id}` : API_URL;

            try {
                const response = await fetch(targetUrl,{
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({plateNumber,brand,model,status})
                });
                const result = await response.json();

                if (!response.ok) throw new Error(result.message || 'Operation failed');

                //showMessage(result.message, "success");
                resetFormState();
                fetchVehicles();
            } catch(error) {
                errorMessage.textContent = error.message;
            }
        });

        function resetFormState(){
            vehicleForm.reset();
            vehicleIdInput.value = '';
            formTitle.textContent = "Add New Vehicle";
            submitBtn.textContent = "Add Vehicle";
            submitBtn.style.background = "var (--success-color)";
            cancelEditBtn.style.display = "none";


        }
        cancelEditBtn.addEventListener('click', resetFormState);

        fetchVehicles();


    });

