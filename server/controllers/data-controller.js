const dataService = require('../service/data-service');

class DataController {
    _getParams(req) {
        const {
            region = process.env.DEFAULT_REGION,
            errors = 0,
            seed = 0,
            start = 0,
            count = process.env.DEFAULT_INITIAL_RECORD_COUNT
        } = req.body;

        return { region, errors, seed, start, count };
    }

    async getData(req, res, next) {
        try {
            const { region, errors, seed, start, count } = this._getParams(req);

            const data = await dataService.generateData(region, errors, seed, start, count);
            return res.json(data);
        } catch (e) {
            next(e);
        }
    }

    async getCsvData(req, res, next) {
        try {
            const { region, errors, seed, start, count } = this._getParams(req);

            const data = await dataService.generateData(region, errors, seed, start, count);
            const csv = await dataService.jsonToCsvConverter(data);

            res.setHeader('Content-Type', 'text/csv');
            return res.send(csv);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new DataController();