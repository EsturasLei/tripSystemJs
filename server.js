require('dotenv').config();

if (!process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET is missing from .env');
}

const express =  require('express');
const path = require('path');
const driverRoutes = require('./routes/driverRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const errorHandler = require('./middleware/errorHandler');
const requestFormRoutes = require("./routes/requestFormRoutes");
const authRoutes = require('./routes/authRoutes');
const requireAuth = require('./middleware/requireAuth');

const app = express();
const PORT = process.env.PORT || 3000;
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const { Pool } = require('pg');

const sessionPool = new Pool({
    connectionString: process.env.DATABASE_URL
});

app.use(session({
    store: new pgSession({
        pool: sessionPool,
        createTableIfMissing: true
    }),
    name: 'trip.sid',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, // Local HTTP development only
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 8 // 8 hours
    }
//     What does this do?
// - store saves sessions in PostgreSQL.
// - httpOnly prevents frontend JavaScript from reading the session cookie.
// - sameSite: 'lax' helps reduce cross-site request risks.
// - maxAge sets an eight-hour cookie lifetime.
// - secure: false is for local HTTP development only. When deployed over HTTPS, 
// configure secure cookies appropriately.
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/drivers', driverRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/requests', requireAuth, requestFormRoutes);
app.use('/api/auth', authRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Layered Enterprised running on port ${PORT}`)
});

