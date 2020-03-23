const { User } = require('../app/models');
require('dotenv-safe').config();
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;
const bcrypt = require('bcryptjs');
const yup = require('yup');

class SessionController {
    async login(req, res) {
        try{
            let schema = yup.object().shape({
                email: yup.string().email().required(),
                password: yup.string().required().min(6)
            });
    
            if(!(await schema.isValid(req.body))){
                return res.status(400).send({ error: 'Erro de validação! '});
            }
        
        const { email, password } = req.body;
        const userExist = await User.findOne({
            where: {
                email: email
                }
            });
        if(!userExist){
            res.status(500).send({ err: 'Usúario não existe!' });
        }
        
        const resultPassword = await bcrypt.compare(password, userExist.password);

        if(userExist && !resultPassword){
            res.status(500).send({ err: 'Password invalid! '})
        }
        if(userExist && resultPassword){
            const id = userExist.id;
            const token = jwt.sign({ id }, secret, {
                expiresIn: '1d' //expira em 5 min
            });
            res.status(200).send({ auth: true, token: token });
            }
        }catch(err) {
        res.status(500).send({ err: 'Login Inválido!' });
        }
    }

    async logout(req, res) {
        res.status(200).send({ auth: false, token: null });
        }
    }

module.exports = new SessionController();