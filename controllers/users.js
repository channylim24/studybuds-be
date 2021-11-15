const { user, sequelize } = require('../models')
const { decrypt, encrypt, createToken, verifyToken } = require('../utils/index')

class User {
    // creating user
    async registerUser(req, res, next) {
        let errorType;
        // return console.log(req.body);
        try {
            // find user
            const data = await user.findOne({
                where: {
                    email: req.body.email
                },
                attributes: { exclude: ["avatar", "updatedAt", "deletedAt", "password"] }
            })
            if (data == null) {
                let { firstName, lastName, email, password, avatar } = req.body;
                if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) return res.status(400).json(["Masukkan email dengan benar!"]);
                if (password.length < 10 || password.length > 20) return res.status(400).json([`Password tidak boleh ${password.length < 10 ? "kurang" : "lebih"} dari ${password.length < 10 ? "10" : "20"} karakter!`]);
                password = encrypt(password)
                const newData = await user.create({
                    firstName, lastName, password, email, avatar,
                });
                const resData = await user.findOne({
                    where: {
                        id: newData.id
                    },
                    attributes: { exclude: ["avatar", "updatedAt", "deletedAt" ] }
                })
                res.status(201).json({ resData });
            } else {
                // return jika email sudah terdaftar
                errorType = 1;
                res.status(400).json(["Email ini sudah terdaftar, silahkan cari email lain"]);
            }
        } catch (error) {
            console.error(error)
            res.status(500).json(["ERROR Creating User"]);
        }
    }
    // show all user
    async allUser(req, res, next) {
        try {
            const data = await user.findAll({
                attributes: { exclude: ["createdAt", "updatedAt" , "deletedAt", "avatar", "password"] }
            })

            if(data.length === 0) {
                return res.status(404).json(['User not found!'])
            }

            res.status(200).json({ data });
        } catch (error) {
            console.error(error);
            res.status(500).json(['Error getting all USER']);
        }
    }
    // show specific user
    async detailUser(req, res, next) {
        try {
            const data = await user.findOne({
                where: {
                    id: req.params.id
                },
                attributes: { exclude: ["password"]}
            },);

            if (!data) {
            return res.status(404).json({ errors: ["User not found"] });
            }

            res.status(200).json({ data });
        } catch (error) {
            res.status(500).json(['Error getting all USER']);
        }
    }
    // updating user
    async updateUser(req, res, next) {
        try {
            const updateUser = await user.update({
                where: { 
                    id: req.params.id
                },
                attributes: { exclude: ["createdAt", "deletedAt", "password"]}
            })
            if(updateUser[0] === 0) {
                return res.status(404).json({ errors: ['User not found!'] });
            }
            const data = await user.findOne({where: {id: req.params.id}});

            res.status(201).json({ data });
        } catch (error) {
            res.status(500).json(['Error updating USER']);
        }
    }
    // deleting user
    async deleteUser(req, res, next) {
        try {
            const data = await user.destroy({
                where: { id: req.params.id },
                attributes: { exclude: ["createdAt", "updatedAt", "password"] },
            })

            if(!data) {
                return res.status(404).json({ errors: ['User not found!'] });
            }

            res.status(200).json({ messages: ['User account has successfully been deleted!'] });
        } catch (error) {
            res.status(500).json(['Error deleting USER']);
        }
    }
    // =============================================================================================================
    // Login
    async loginUser(req, res, next) {
        // untuk cek email di database
        const data = await user.findOne({ 
            where: { email: req.body.email },
        });
        
        if(data == null) {
            return res.status(404).json({ errors: ['Email yang diisi salah']})
        }
        // cek apa password memang dimiliki oleh email yang diinput
        let validPass = decrypt(req.body.password, data.password);
        if(!validPass) {
            return res.status(404).json({ errors: ['Kata Sandi yang dimasukkan salah']})
        }

        const {
            firstName, lastName, email, avatar
        } = data.dataValues

        const tmpToken = {
            firstName, lastName, email, avatar
        }

        const token = createToken(tmpToken);
        return res.status(200).json({ statusCode: 200, message: "Login success!", token });
    }
    
}

module.exports = new User();