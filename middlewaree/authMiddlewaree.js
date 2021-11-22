module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next();
    }

    try {
        if (req.session && req.session.isAuth === true) {
            next()
        } else {
            res.redirect('/admin/login')
        }
    } catch (e) {
        console.log(e)
        return res.status(400).json({message: "Пользователь не авторизован!"})
    }
}
