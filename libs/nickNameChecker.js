module.exports = function(req, res, next){
    if(req.isAuthenticated()){
        var nickname = JSON.stringify(req.user.nickname)
        var nickname2 = JSON.parse(nickname)
        } else {
            return next();
        }
};

// module.exports = function(req, res, next) {
//     if (!req.isAuthenticated()){ 
//         res.redirect('/accounts/login');
//     }else{
//         return next();
//     }
// };
