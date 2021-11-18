const express = require('express');
const mongoose = require('mongoose');
const expressHbs = require('express-handlebars');
const cors = require('cors');
const app = express();
const hbs = expressHbs.create({
    defaultLayout: 'statement',
    extname:'hbs'
});
const PORT = process.env.PORT || 8080;

app.engine('hbs',hbs.engine);

app.set('view engine','hbs');
app.set('views','views');
app.use(express.json({extended:true}));
app.use(express.urlencoded({extended:true}));
app.use(cors())
app.use("/statement", require('./routes/statements.routes'));
app.use(express.static('./static/signature_pad-master/docs'));

async function start() {
    try {
        await mongoose.connect('mongodb+srv://lexUs:Mepeze72@statements.xxqt8.mongodb.net/statements?retryWrites=true&w=majority');
        app.listen(PORT, () => console.log(`Server has been started on port ${PORT}`));
    } catch (e) {
        console.log('Error:', e);
        process.exit(1);
    }
}

start().then(r => console.log(r));
