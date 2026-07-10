require('dotenv').config();
const express =  require('express');
const path = require('path');
const driverRoutes = require('./routes/driverRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/drivers', driverRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Layered Enterprised running on por ${PORT}`)
});

