module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        name: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: true,
            }
        },
        password: DataTypes.STRING,
    });
    sequelize.sync()
    .then(() => {
    console.log(`Database & tables created!`)
  });

    return User;
}