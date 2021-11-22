const {Router} = require('express');
const Statement = require('../models/statement');
const router = Router();
const configuration = require('../config/default.json');
const authMiddleware = require('../middlewaree/authMiddlewaree');
let axios = require('axios');

const statementTitles = {
    gph: 'Договор ГПХ',
    application: "Анкета",
    non_disclosure: "О неразглашении"
}

const sendBotMessage = (chatID, type, ref, config) => {
    try {
        let msg;
        if (config.type === 'statement') msg =
            `<strong>Новое заявление:</strong> ${statementTitles[type]} от ${config.name}\n<a href="${ref}">${ref}</a>`;
        msg = encodeURI(msg)
        axios
            .post(`https://api.telegram.org/bot${configuration.telegram.token}/sendMessage?chat_id=${configuration.telegram.chat}&parse_mode=html&text=${msg}`)
            .then(res => {
                console.log(res);
            })
            .catch(error => {
                console.error(error);
            })
    } catch (e) {
        console.log(e)
    }
}
const formatDateInput = (date) => {
    try {
        return date.split('-').reverse().join('.');
    } catch (e) {
        return date;
    }
}

router.post('/gph', async (request, response) => {
    try {
        let lastIndex;
        const {dateFrom, dateTo, ...body} = request.body;
        body.dateFrom = formatDateInput(dateFrom);
        body.dateTo = formatDateInput(dateTo);

        const type = 'gph';
        const db = await Statement.find({type});
        if (!db.length) {
            lastIndex = 1;
        } else {
            lastIndex = db.sort((a, b) => b.statementID - a.statementID)[0].statementID + 1;
        }

        if (body.city && body.fullName && body.signature && lastIndex) {
            const statement = new Statement({type, statementID: lastIndex, ...body});
            await statement.save();
        } else {
            throw new Error("Неверно указанны параметры");
        }

        sendBotMessage(525442208, type, request.headers.referer + '/' + lastIndex, {
            type: 'statement',
            name: body.fullName,
            number: lastIndex
        });
        response.status(201).json({massage: `${type}`});
    } catch (e) {
        response.status(500).json({message: "Что по пошло не так", description: e})
    }
});

//Анкета
router.post('/application', async (request, response) => {
    try {
        let lastIndex;
        const type = 'application';
        const db = await Statement.find({type});

        if (!db.length) {
            lastIndex = 1;
        } else {
            lastIndex = db.sort((a, b) => b.statementID - a.statementID)[0].statementID + 1;
        }

        const {
            lastname, name, patronymic, passport_series, passport_number,
            educationDateFrom, educationDateTo, workExperienceDateFrom_1, workExperienceDateTo_1,
            workExperienceDateFrom_2, workExperienceDateTo_2, workExperienceDateFrom_3, workExperienceDateTo_3, birthday,
            ...body
        } = request.body;

        const fullName = lastname + " " + name + " " + patronymic;
        const passport = passport_series + passport_number;

        body.educationDateFrom = formatDateInput(educationDateFrom);
        body.educationDateTo = formatDateInput(educationDateTo);
        body.workExperienceDateFrom_1 = formatDateInput(workExperienceDateFrom_1);
        body.workExperienceDateTo_1 = formatDateInput(workExperienceDateTo_1);
        body.workExperienceDateFrom_2 = formatDateInput(workExperienceDateFrom_2);
        body.workExperienceDateTo_2 = formatDateInput(workExperienceDateTo_2);
        body.workExperienceDateFrom_3 = formatDateInput(workExperienceDateFrom_3);
        body.workExperienceDateTo_3 = formatDateInput(workExperienceDateTo_3);
        body.birthday = formatDateInput(birthday);
        body.passport_series = passport_series;
        body.passport_number = passport_number;
        body.patronymic = patronymic
        body.lastname = lastname;
        body.name = name;

        if (body.city && fullName && body.signature && lastIndex) {
            const statement = new Statement({type, statementID: lastIndex, passport, fullName, ...body});
            await statement.save();
        } else {
            throw new Error("Неверно указанны параметры");
        }
        sendBotMessage(525442208, type, request.headers.referer + '/' + lastIndex, {
            type: 'statement',
            name: fullName,
            number: lastIndex
        });
        response.status(201).json({message: "Заявление успешно отправлено"});
    } catch (e) {
        response.status(500).json({message: "Что по пошло не так", description: e});
    }
});

// О неразглашении
router.post('/non_disclosure', async (request, response) => {
    try {
        let lastIndex;
        const type = 'non_disclosure';
        const db = await Statement.find({type});

        if (!db.length) {
            lastIndex = 1;
        } else {
            lastIndex = db.sort((a, b) => b.statementID - a.statementID)[0].statementID + 1;
        }

        if (request.body.city && request.body.fullName && request.body.signature && lastIndex) {
            const statement = new Statement({type, statementID: lastIndex, ...request.body});
            await statement.save();
        } else {
            throw new Error("Неверно указанны параметры");
        }

        sendBotMessage(525442208, type, request.headers.referer + '/' + lastIndex, {
            type: 'statement',
            name: request.body.fullName,
            number: lastIndex
        });
        response.status(201).json({message: "Заявление успешно отправлено"})
    } catch (e) {
        response.status(500).json({message: "Что по пошло не так", description: e})
    }
});

router.get(`/gph`, async (request, response) => {
    try {
        response.render(`gph.hbs`, {
            title: 'Договор ГПХ'
        });
    } catch (e) {
        response.render('404.hbs', {
            title: 'Error 404',
            error: e
        });
    }
});

router.get(`/application`, (request, response) => {
    try {
        response.render(`application.hbs`, {
            title: 'Анкета'
        });
    } catch (e) {
        response.render('404.hbs', {
            title: 'Error 404',
            error: e
        });
    }
});

router.get(`/non_disclosure`, (request, response) => {
    try {
        response.render(`non_disclosure.hbs`, {
            title: 'О неразглашении'
        });

    } catch (e) {
        response.render('404.hbs', {
            title: 'Error 404',
            error: e
        });
    }
});

router.get(`/:type/:id`,authMiddleware, async (request, response) => {
    try {
        const id = request.params.id;
        const type = request.params.type;
        let statementData = await Statement.findOne({type, statementID: id});

        if (!statementData) {
            response.render('404.hbs', {
                title: 'Error 404',
            });
            return;
        }
        statementData.title = statementTitles[type];
        statementData.isBased = true;

        response.render(`${type}.hbs`, statementData);
    } catch (e) {
        response.render('404.hbs', {
            title: 'Error 404',
            error: e
        });
    }
});

module.exports = router;
