module.exports = (sequelize, DataTypes)=>{
    const Comment = sequelize.define('Comment', {
        authorId: {
            type: DataTypes.INTEGER,
            allowNull:false,
        },
        postId: {
            type: DataTypes.INTEGER,
            allowNull:false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull:false,
        },
        // password: {
        //     type:DataTypes.STRING(100),
        //     allowNull: false,
        // },
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
    Comment.associate = (db) => {};
    return Comment;
}