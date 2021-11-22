const {Router} = require('express');
const Statement = require('../models/statement');
const User = require('../models/User');
const Role = require('../models/Role');
const authMiddleware = require('../middlewaree/authMiddlewaree');
const router = Router();
const bcrypt = require('bcrypt');

const statementTitles = {
    gph: 'Договор ГПХ',
    application: "Анкета",
    non_disclosure: "О неразглашении"
}


router.get('/login', async (request, response) => {
    response.render('login.hbs', {})

});
router.get('/main', authMiddleware, async (request, response) => {
    let statements = await Statement.find({}).lean();
    statements.map((a) => a.descriptionType = (statementTitles[a.type]));
    statements.sort((old_el, new_el) => {
        if (old_el.signatureDate > new_el.signatureDate) {
            return -1;
        }
        if (old_el.signatureDate < new_el.signatureDate) {
            return 1;
        }
        return 0;
    });

    response.render('main.hbs', {statements})

});

router.post('/create', async (request, response) => {
    try {

        const {username, password, fullname, email} = request.body;
        const candidate = await User.findOne({username});

        if (candidate) {
            return response.status(400).json({massage: `Пользователь ${username} уже зарегестрирован`});
        }

        const hashPassword = bcrypt.hashSync(password, 7);
        const userRole = await Role.findOne({value: "USER"});
        const user = new User({
            username,
            email,
            fullname,
            password: hashPassword,
            roles: [userRole.value]
        });

        await user.save();
        response.status(200).json({massage: "Пользователь успешно зарегестрирован"});
    } catch (e) {
        console.log(e)
        return response.status(500).json({massage: `Ошибка`});
    }
})

router.post('/auth', async (request, response) => {
    const {username, password} = request.body;
    const user = await User.findOne({username});

    if (!user) {
        return response.status(400).json({massage: `Пользователь ${username} не найден!`})
    }
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
        return response.status(400).json({massage: `Неверный пароль!`})
    }
    request.session.isAuth = true;

    return response.redirect('/admin/main');
});

module.exports = router;
