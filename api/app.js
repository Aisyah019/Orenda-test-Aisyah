require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = require('./swagger');

const productRoutes = require('./routes/product');
const customerRoutes = require('./routes/customer');
const orderRoutes = require('./routes/order');

const app = express();
const router = express.Router();

const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));

router.get('/', (req, res) => {
    res.send('Welcome to the CusProd API');

});

router.use('/products', productRoutes);
router.use('/customer', customerRoutes);
router.use('/orders', orderRoutes);


app.use('/api/v1', router);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.listen(port, () => {
    console.log(`CusProd API: listening on port ${port}`);
});

