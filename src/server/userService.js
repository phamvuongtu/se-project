const db =  require('./database');



let handleUserLogin = async (email, password) => {
    try {
        let userData = {};
        let isExist = await checkUserName(email);

        if (isExist) {
            let results = await getUserByEmail(email);

            if (results.length > 0) {
                const user = results[0];
                if (password == user.password) {
                    userData.errCode = 0;
                    userData.errMessage = "OK~";
                    userData.user = user;
                } else {
                    userData.errCode = 3;
                    userData.errMessage = "WRONG PASSWORD~";
                }
            } else {
                userData.errCode = 2;
                userData.errMessage = "User not found~";
            }
        } else {
            userData.errCode = 1;
            userData.errMessage = "Username does not exist";
        }

        return userData;
    } catch (e) {
        throw e;
    }
};

let getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT email,password, role FROM User_Account WHERE email = ?", email, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

let checkUserName = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            const results = await db.query("SELECT email FROM User_Account WHERE email = ?", [email]);
            if (results) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    });
};


module.exports = {
    handleUserLogin: handleUserLogin,
}