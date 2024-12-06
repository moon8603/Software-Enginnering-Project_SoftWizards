module.exports = (sequelize, DataTypes)=>{
    const Post = sequelize.define('Post', {
        author: {
            type: DataTypes.STRING(100),
            allowNull:false,
        },
        title: {
            type: DataTypes.STRING(500),
            allowNull:false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull:false,
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
        timestamps:false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
    });
    Post.associate = (db) => {};
    return Post;
}