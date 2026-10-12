document.addEventListener('DOMContentLoaded', () => {
    const driverForm = document.getElementById('driverForm');
    const driverIdInput = document.getElementById('driverId');
    const driverNameInput = document.getElementById('driverName');
    const licenseNumberInput = document.getElementById('licenseNumber');

    const formTitle = document.getElementById('formTitle');
    const submitBtn = document.getElementById('submitBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');

    const driverTableBody = document.getElementById('driverTableBody');
    const errorMessage = document.getElementById('errorMessage');

    const API_URL = '/api/drivers';

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
    
    async function fetchDrivers() {
        try{
            const response = await fetch(API_URL);
            if(!response.ok) throw new Error('Failed to fetch Driver.');
            
            const drivers =  await response.json();

            driverTableBody.innerHTML = '';

            if(drivers.length ===0){
                driverTableBody.innerHTML = `<tr><td colspan="3" style="text-align:center;">NO Drivers Found.</td></tr>`;
                return;

            }
            drivers.forEach(driver => {
                const row = document.createElement('tr');
                const license = driver.license_number || driver.licenseNumber;
                
                row.innerHTML = `
                    <td>${driver.id}</td>
                    <td>${driver.name}</td>
                    <td>${license}</td>
                    <td style="text-align: right;">
                        <button class="edit-btn" data-id="${driver.id}" data-name="${driver.name}" data-license="${license}" style="background-color: #3498db; padding: 5px 10px; font-size: 13px; margin-right: 5px;">edit</button>
                        <button class="delete-btn" data-id="${driver.id}" style="background-color: #e74c3c; padding: 5px 10px; font-size: 13px;">Delete</button>
                    </td>
                `;
                driverTableBody.appendChild(row);
            });

            attachEventListeners();
        } catch (error) {
            errorMessage.textContent = error.message;

        }
    }
    //for edit and updat
    function attachEventListeners(){

        document.querySelectorAll('.edit-btn').forEach(btn =>{
            btn.addEventListener('click', (e) => {

                // const response = await fetch(`${API_URL}/${id}`,{ method: 'PUT'});
                // const result = await response.json();

                const id = e.target.getAttribute('data-id');
                const name = e.target.getAttribute('data-name');
                const license = e.target.getAttribute('data-license');

                driverIdInput.value = id;
                driverNameInput.value = name;
                licenseNumberInput.value = license;

                formTitle.textContent = "Edit Driver Details";
                submitBtn.textContent = "Update Driver";
                submitBtn.style.backgroundColor = "#3498db";
                cancelEditBtn.style.display = "inline-block";
                window.scrollTo({ top: 0, behavior: 'smooth'});

                // showMessage(result.message, 'sucess');
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.getAttribute('data-id');
                if (confirm(`Are you sure you want to delete driver ID #${id}?`)) {
                    try{
                        const response = await fetch(`${API_URL}/${id}`,{ method: 'DELETE'});
                        const result = await response.json();

                        if (!response.ok){
                            throw new Error(result.message)
                        }

                        showMessage(result.message, "success");
                        
                        resetFormState();
                        fetchDrivers();
                    } catch (error){
                        errorMessage.textContent = error.message;
                    }
                }
            });
        });
    }

    driverForm.addEventListener('submit' , async (e) => {
        e.preventDefault();
        errorMessage.textContent = '';

        const id = driverIdInput.value;

        const name = document.getElementById('driverName').value.trim();
        const licenseNumber = document.getElementById('licenseNumber').value.trim();

        const method = id ? 'PUT' : 'POST';
        const targetUrl = id ? `${API_URL}/${id}` : API_URL;

        try {
            const response = await fetch(targetUrl,{
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name,licenseNumber})
            });
            const result = await response.json();

            if (!response.ok) throw new Error(result.message || 'Operation faild');

            showMessage(result.message, "success");

            resetFormState();
            fetchDrivers();
        } catch (error) {
            errorMessage.textContent = error.message;
        }
    });

    function resetFormState() {
        driverForm.reset();
        driverIdInput.value = '';
        formTitle.textContent = "Add New Driver";
        submitBtn.textContent = "Add driver";
        submitBtn.style.background = "var (--success-color)";
        cancelEditBtn.style.display = "none";
    }
    cancelEditBtn.addEventListener('click', resetFormState);

    fetchDrivers();

});