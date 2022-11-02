const authCheckBefore = (req, res, next) => {
    if (req.session.admin) {
        if (req.session.admin.userType == 'admin') {
            res.redirect('/admin/dashboard');
        } else {
            res.redirect('/');
        }
    } else {
        next();
    }
}
const authCheckAfter = (req, res, next) => {
    if (req.session.admin) {
        if (req.session.admin.userType == 'admin') {
            next();
        } else {
            res.redirect('/');
        }
    } else {
        res.redirect('/admin');
    }
}

module.exports = { authCheckBefore, authCheckAfter };