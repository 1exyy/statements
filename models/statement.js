const {Schema, model} = require('mongoose');
const schema = new Schema({
    type: {type: String, required: true},
    statementID: {type: Number, required: true},
    city: {type: String, required: true, enum: ["Луганск", "Донецк", "Свердловск"]},
    fullName: {type: String, required: true},
    signature: {type: String, required: true},
    signatureDate: {type: String},
    lastname: {type: String},
    name: {type: String},
    patronymic: {type: String},

    passport_number: {type: String},
    passport: {type: String},
    passport_series: {type: String},
    passportData: {type: String},
    dateFrom: {type: String},
    dateTo: {type: String},
    inn: {type: String},
    place: {type: String},
    insurance: {type: String},
    birthday: {type: String},
    registration: {type: String},
    address: {type: String},
    phoneNumber: {type: Number},
    dopPhoneNumber: {type: Number},
    //Образование

    educationDateFrom: {type: String},
    educationDateTo: {type: String},
    educationForm: {type: String},
    universityName: {type: String},
    profession: {type: String},
    //Опыт работы

    workExperienceDateFrom_1: {type: String},
    workExperienceDateTo_1: {type: String},
    companyName_1: {type: String},
    companyDirection_1: {type: String},
    workPlace_1: {type: String},
    subordinates_1: {type: String},

    workExperienceDateFrom_2: {type: String},
    workExperienceDateTo_2: {type: String},
    companyName_2: {type: String},
    companyDirection_2: {type: String},
    workPlace_2: {type: String},
    subordinates_2: {type: String},

    workExperienceDateFrom_3: {type: String},
    workExperienceDateTo_3: {type: String},
    companyName_3: {type: String},
    companyDirection_3: {type: String},
    workPlace_3: {type: String},
    subordinates_3: {type: String},

    // ЛИЧНЫЕ КАЧЕСТВА

    personalQuality_1: {type: String},
    personalQuality_2: {type: String},
    personalQuality_3: {type: String},
    personalQuality_4: {type: String},
    personalQuality_5: {type: String},

    // ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ

    question_1: {type: String},
    question_2: {type: String},
    question_3: {type: String},

    // КРИТЕРИИ ИДЕАЛЬНОЙ КОМПАНИИ
    idealFor_1: {type: String},
    idealFor_2: {type: String},
    idealFor_3: {type: String},
    idealFor_4: {type: String},
    idealFor_5: {type: String},

    // РЕКОМЕНДУЮ СВОИХ ДРУЗЕЙ:
    friend_fullName_1: {type: String},
    friend_phoneNumber_1: {type: String},
    friend_socialNetwork_1: {type: String},

    friend_fullName_2: {type: String},
    friend_phoneNumber_2: {type: String},
    friend_socialNetwork_2: {type: String},

    friend_fullName_3: {type: String},
    friend_phoneNumber_3: {type: String},
    friend_socialNetwork_3: {type: String},

    friend_fullName_4: {type: String},
    friend_phoneNumber_4: {type: String},
    friend_socialNetwork_4: {type: String},

    friend_fullName_5: {type: String},
    friend_phoneNumber_5: {type: String},
    friend_socialNetwork_5: {type: String},
})

module.exports = model('Statement', schema);
