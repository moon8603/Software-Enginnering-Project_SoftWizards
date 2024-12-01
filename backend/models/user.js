module.exports = (sequelize, DataTypes)=>{
    const User = sequelize.define('User', {
        email: {
            type:DataTypes.STRING(30),
            allowNull: false,
            unique: true,
        },
        password: {
            type:DataTypes.STRING(100),
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.fn('CURRENT_TIMESTAMP'),
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.fn('CURRENT_TIMESTAMP'),
            allowNull: false,
        },
    },{
        sequelize,
        timestamps: true,
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci' 
    });
    User.associate = (db) => {};
    return User;
}