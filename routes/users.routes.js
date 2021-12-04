const {Router} = require('express');
const Statement = require('../models/statement');
const User = require('../models/User');
const authMiddleware = require('../middlewaree/authMiddlewaree');
const roleMiddleware = require('../middlewaree/roleMiddleware');
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
router.get('/usersControl', authMiddleware, roleMiddleware, async (request, response) => {
    let users = await User.find({}).lean();
    response.render("adminPanel.hbs", {
        users,
        isAdmin: request.session.isAdmin
    })
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

    response.render('main.hbs', {
        statements,
        isAdmin: request.session.isAdmin
    })
});

router.post('/create', async (request, response) => {
    try {
        const {username, password, fullname, email, roles} = request.body;
        const candidate = await User.findOne({username});

        if (candidate) {
            return response.status(400).json({massage: `Пользователь ${username} уже зарегестрирован`});
        }

        const hashPassword = bcrypt.hashSync(password, 7);
        const user = new User({
            username,
            email,
            fullname,
            password: hashPassword,
            roles
        });

        await user.save();
        return response.redirect('/admin/usersControl');
    } catch (e) {

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
    request.session.isAdmin = user.roles.includes('ADMIN');

    return response.redirect('/admin/main');
});

router.post('/removeUser', async (request, response) => {
    const {_id} = request.body;
    await User.findByIdAndDelete(_id);
    return response.redirect('/admin/usersControl');
});

module.exports = router;
