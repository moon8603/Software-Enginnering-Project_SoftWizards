module.exports = (sequelize, DataTypes)=>{
    const Amenity = sequelize.define('Amenity', {   // MySQL에는 Amenity라는 테이블 생성
        // id는 mysql에서 자동으로 생성되기 때문에 넣어줄 필요 없다.
        // 그렇지만 auto increasement 속성은 적용되지 않음
        // id: {},
        name: {
            type:DataTypes.STRING(100),
            allowNull: false,   // 필수값
        },
        coordinates: {
            // 37.584939 127.062061 과 같은 형태로 저장된다.
            type:DataTypes.STRING(500),
            allowNull: false,   // 필수값
        },
        description: {
            type:DataTypes.TEXT
        },
        workingHour: {
            // 09:00 ~ 18:00 과 같은 형태로 저장된다.
            type:DataTypes.STRING(500)
        },
        type: {
            // 건물 도서관 과 같은 형태로 저장된다.
            type:DataTypes.STRING(1000)
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
        // createdAt, updatedAt, deletedAt
        timestamps: false,
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci' 
    });
    Amenity.associate = (db) => {};
    return Amenity;
}