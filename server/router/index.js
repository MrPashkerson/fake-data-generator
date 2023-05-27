const Router = require('express').Router;
const dataController = require('../controllers/data-controller');
const router = new Router();

router.post('/data', dataController.getData.bind(dataController));
router.post('/data-csv', dataController.getCsvData.bind(dataController));

module.exports = router;