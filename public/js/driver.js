document.addEventListener('DOMContentLoaded', () => {
    const driverForm = document.getElementById('driverForm');
    const driverTableBody = document.getElementById('driverTableBody');
    const errorMessage = document.getElementById('errorMessage');

    const API_URL = '/api/drivers';

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
                row.innerHTML = `
                    <td>${driver.id}</td>
                    <td>${driver.name}</td>
                    <td>${driver.license_number || driver.licenseNumber}</td>
                `;
                driverTableBody.appendChild(row);
            });
        } catch (error) {
            errorMessage.textContent = error.message;

        }
    }
    driverForm.addEventListener('submit' , async (e) => {
        e.preventDefault();
        errorMessage.textContent = '';

        const name = document.getElementById('driverName').value.trim();
        const licenseNumber = document.getElementById('licenseNumber').value.trim();

        try {
            const response = await fetch(API_URL,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name,licenseNumber})
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to add driver. ');

            }

            driverForm.reset();
            fetchDrivers();
        } catch (error) {
            errorMessage.textContent = error.message;
        }
    });

    fetchDrivers();

});