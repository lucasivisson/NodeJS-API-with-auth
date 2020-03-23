const { User } = require('../app/models');
require('dotenv-safe').config();
const bcrypt = require('bcryptjs');
const yup = require('yup');

class UserController {
    async index(req, res) {
        try {
            const user = await User.findAll();
            return res.json(user);
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }

    async show(req, res) {
        try {
            const user = await User.findByPk(req.params.id);
            return res.json(user);
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    } 

    async store(req, res) {
        try{
            let schema = yup.object().shape({
                name: yup.string().required(),
                email: yup.string().email().required(),
                password: yup.string().required().min(6)
            });
            if(!(await schema.isValid(req.body))) {
                return res.status(400).send({ error: 'Erro de validação! '});
            }
            const userExist = await User.findOne({
                where: {
                    email: req.body.email
                }
            });
            if(userExist){
                return res.status(400).json({
                    error: 'User already exists.'
                })
            }
            let { password } = req.body;
            const salt = bcrypt.genSaltSync(10);
            password = bcrypt.hashSync(password, salt);
            req.body.password = password;
            const { id, name, email } = await User.create(req.body);
            return res.status(200).send({ id, name, email });
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }   

    async update(req, res) {
        try {
            let schema = yup.object().shape({
                name: yup.string().required(),
                email: yup.string().email().required(),
                oldPassword: yup.string().required().min(6),
                password: yup.string().required().min(6),
                passwordConfirmation: yup.string()
                .oneOf([yup.ref('password')])
            })
            if(!(await schema.isValid(req.body))){
                return res.status(400).send({ error: 'Erro de validação' });
            }
            const { email, oldPassword } = req.body;
            const user = await User.findByPk(req.params.id);

            if(email !== user.email){
                const userExist = User.findOne({
                    where: {
                        email
                    }
                });
                if(userExist){
                    res.status(400).send({ error: 'User already exists'})
                }
                const resultPassword = await bcrypt.compare(oldPassword, userExist.password);
                if(!resultPassword){
                    res.status(400).send({ error: 'Password incorrect '})
                }
            }

            const salt = bcrypt.genSaltSync(10);
            req.body.password = bcrypt.hashSync(req.body.password, salt);
            
            await user.update(req.body);
            return res.status(200).json({
                message: 'User updated successfully'
            });
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }
    
    async destroy(req, res) {
        try {
            const user = await User.findByPk(req.params.id);
            await user.destroy();
            return res.json({ message: 'Usuário excluido com sucesso! '});
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}

module.exports = new UserController();