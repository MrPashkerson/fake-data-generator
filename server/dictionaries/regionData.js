const {es, ru, en, uk} = require("@faker-js/faker");

module.exports =  {
    "ru_RU": {
        fakerLocale: ru,
        alphabet: "абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ",
        phoneFormat: "+7 (###) ###-##-##"
    },
    "es_ES": {
        fakerLocale: es,
        alphabet: "abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ",
        phoneFormat: "+34 ### ## ## ##"
    },
    "uk_UA": {
        fakerLocale: uk,
        alphabet: "абвгдеєжзиійклмнопрстуфхцчшщьюяАБВГДЕЄЖЗИІЙКЛМНОПРСТУФХЦЧШЩЬЮЯ",
        phoneFormat: "+380 (##) ###-##-##"
    },
    "en_US": {
        fakerLocale: en,
        alphabet: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
        phoneFormat: "+1 (###) ###-####"
    },
};