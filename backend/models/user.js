module.exports = (sequelize, DataTypes)=>{
    const User = sequelize.define('User', { // MySQL에는 users라는 테이블 생성
        // id는 mysql에서 자동으로 생성되기 때문에 넣어줄 필요 없다.
        // id: {},
        // 그렇지만 auto increasement 안 되는 거 같다
        email: {
            type:DataTypes.STRING(30),
            allowNull: false, //필수값
            unique: true,
        },
        password: {
            // 패스워드는 암호화를 하기 때문에 넉넉하게 잡아주는 것이 좋다. 
            type:DataTypes.STRING(100),
            allowNull: false, //필수값
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
        // createdAt updatedAt deletedAt
        timestamps: true,
        paranoid: true,
        // 한글을 쓸수 있게 해준다.(한글 저장)
        charset: 'utf8',
        collate: 'utf8_general_ci' 
    });
    User.associate = (db) => {};
    return User;
}