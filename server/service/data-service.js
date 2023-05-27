const { Faker, ne} = require('@faker-js/faker');
const { Parser } = require('json2csv');
const regionData = require('../dictionaries/regionData');

class DataService {
    async generateData(region, errorsQuantity, seed, start, count) {
        let customFaker;
        try {
            customFaker = new Faker({
                locale: [regionData[region].fakerLocale],
            });
        } catch (e) {
            throw e;
        }
        seed += start;
        customFaker.seed(seed);

        const data = [];
        for (let i = start; i < start + count; i++) {
            let row = this.generateFakeDataRow(region, customFaker, i);
            row = this.addErrorToRow(row, errorsQuantity, region, customFaker, ["fullName", "address"]);
            data.push(row);
        }
        return data;
    }

    async jsonToCsvConverter(data){
        const json2csvParser = new Parser();
        return json2csvParser.parse(data);
    }

    addErrorToRow(row, errorsQuantity, region, faker, keys = Object.keys(row)) {
        errorsQuantity = this.getRoundedErrors(errorsQuantity, faker);
        for (let i = 0; i < errorsQuantity; i++) {
            let key = faker.helpers.arrayElement(keys);
            const errorType = this.getWeightedRandomErrorType(row[key], faker);
            switch (errorType) {
                case 0:
                    row[key] = this.deleteRandomChar(row[key], faker);
                    break;
                case 1:
                    row[key] = this.addRandomChar(row[key], region, faker);
                    break;
                case 2:
                    row[key] = this.swapRandomChars(row[key], faker);
                    break;
            }
        }
        return row;
    }

    getRoundedErrors(errorsQuantity, faker) {
        const errorsFloor = Math.floor(errorsQuantity);
        const probability = errorsQuantity - errorsFloor;
        const extraError = faker.number.float({ min: 0, max: 1 }) < probability ? 1 : 0;

        return errorsFloor + extraError;
    }

    getErrorTypeWeights(str) {
        const length = str.length;
        return [
            {type: 0, weight: length > 8 ? 1 : 0},
            {type: 1, weight: length < 60 ? 1 : 0},
            {type: 2, weight: length > 1 ? 1 : 0}
        ];
    }

    getWeightedRandomErrorType(str, faker) {
        const weights = this.getErrorTypeWeights(str);
        const totalWeight = weights.reduce((acc, item) => acc + item.weight, 0);
        let randomValue = faker.number.float({min: 0, max: totalWeight});
        for (let i = 0; i < weights.length; i++) {
            randomValue -= weights[i].weight;
            if (randomValue < 0) {
                return weights[i].type;
            }
        }
        return weights[weights.length - 1].type;
    }

    deleteRandomChar(str, faker) {
        const deleteIndex = faker.number.int({min: 0, max: str.length - 1});
        return str.slice(0, deleteIndex) + str.slice(deleteIndex + 1);
    }

    addRandomChar(str, region, faker) {
        const addIndex = faker.number.int({min: 0, max: str.length});
        const randomChar = faker.helpers.arrayElement(regionData[region].alphabet);
        return str.slice(0, addIndex) + randomChar + str.slice(addIndex);
    }

    swapRandomChars(str, faker) {
        const swapIndex = faker.number.int({min: 0, max: str.length - 2});
        return str.slice(0, swapIndex) + str[swapIndex + 1] + str[swapIndex] + str.slice(swapIndex + 2);
    }

    generateFakeDataRow(region, faker, number){
        return {
            number: number + 1,
            id: faker.string.uuid(),
            fullName: faker.person.fullName(),
            address: faker.location.streetAddress(faker.datatype.boolean()),
            phone: faker.phone.number(regionData[region].phoneFormat),
        }
    }
}

module.exports = new DataService();