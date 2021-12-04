module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next();
    }

    if (req.session.isAdmin) {
        next()
    } else {
        res.render('404.hbs', {
            title: 'Error 404',
        });
    }
}
