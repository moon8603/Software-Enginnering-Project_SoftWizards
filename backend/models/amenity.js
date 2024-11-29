module.exports = (sequelize, DataTypes)=>{
    const Amenity = sequelize.define('Amenity', { // MySQL에는 Amenity라는 테이블 생성
        // id는 mysql에서 자동으로 생성되기 때문에 넣어줄 필요 없다.
        // id: {},
        name: {
            type:DataTypes.STRING(100),
            allowNull: false, //필수값
        },
        location: {
            // 패스워드는 암호화를 하기 때문에 넉넉하게 잡아주는 것이 좋다. 
            type:DataTypes.STRING(500),
            allowNull: false, //필수값
        },
        bussinessHour: {
            type:DataTypes.STRING(300)
        },
        type: {
            type:DataTypes.STRING(300)
        },
        introduction: {
            type:DataTypes.TEXT
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
        // 한글을 쓸수 있게 해준다.(한글 저장)
        charset: 'utf8',
        collate: 'utf8_general_ci' 
    });
    Amenity.associate = (db) => {};
    return Amenity;
}