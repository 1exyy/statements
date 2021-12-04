const express = require('express');
const configuration = require('./config/default.json');
const mongoose = require('mongoose');
const expressHbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session)
const hbs = expressHbs.create({
    defaultLayout: 'statement',
    extname: 'hbs'
});
const PORT = process.env.PORT || 8080;
process.setMaxListeners(0)
app.engine('hbs', hbs.engine);

app.set('view engine', 'hbs');
app.set('views', 'views');
app.use(cookieParser())
app.use(express.json({extended: true}));
app.use(express.urlencoded({extended: true}));
app.use(cors())
const store = new MongoDBSession({
    uri: configuration.URI,
    collection: "sessions"
})
app.use(session({
    secret: configuration.secret,
    resave: false,
    cookie: {
        maxAge: 3600000 * 12
    },
    saveUninitialized: false,
    store: store
}))
app.use("/statement", require('./routes/statements.routes'));
app.use("/admin", require('./routes/users.routes'));
app.use(express.static('./static/signature_pad-master/docs'));


async function start() {
    try {
        await mongoose.connect(configuration.URI);
        app.listen(PORT, () => console.log(`Server has been started on port ${PORT}`));
    } catch (e) {
        console.log('Error:', e);
        process.exit(1);
    }
}

start().then();
