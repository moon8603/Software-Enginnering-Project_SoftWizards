module.exports = (sequelize, DataTypes)=>{
    const Post = sequelize.define('Post', { // MySQL에는 Posts라는 테이블 생성
        content: {
          	// TEXT로 지정할지 글자수에 제한이 없다.
            type: DataTypes.TEXT,
            allowNull:false,
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
        // createdAt updatedAt, deletedAt
        timestamps:false,
        paranoid:true,
        // 한글과 이모티콘을 쓸수 있게 해준다.(한글, 이모티콘 저장)
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
    });
    Post.associate = (db) => {};
    return Post;
}