const { responseError, responseSuccess } = require('../utils/responseHandler');
const Order = require('../models/order');
const Customer = require('../models/customer'); // Pastikan ada model Customer
const Product = require('../models/product');   // Pastikan ada model Product
const createOrder = async (req, res) => {
    try {
        const order = await Order.create(req.body);
        return responseSuccess(res, order, 'Order created successfully', 201);
    } catch (error) {
        console.error('Error creating order:', error);
        return responseError(res, 'Failed to create order', 500);
      }
};
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                { model: Customer, attributes: ['name','phone','email','address'] },
                { model: Product, attributes: ['name', 'price'] }
            ]
        });
        return responseSuccess(res, orders, 'Orders retrieved successfully', 200);
    } catch (error) {
        console.error('Error fetching orders:', error);
        return responseError(res, 'Failed to fetch orders', 500);
    }
};
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (!order) {
            return responseError(res, 'Order not found', 404);
        } else {
            return responseSuccess(res, order, 'Order retrieved successfully', 200);
        }
    } catch (error) {
        return responseError(res, 'Failed to fetch order', 500);
    }
};
const updateOrder = async (req, res) => {
    try {
        const [updatedRowsCount] = await Order.update(req.body, {
            where: { id: req.params.id }
        });
        if (updatedRowsCount === 0) {
            return responseError(res, 'Order not found', 404);
        } else {
            const order = await Order.findByPk(req.params.id);
            return responseSuccess(res, order, 'Order updated successfully', 200);
        }
    } catch (error) {
        return responseError(res, 'Failed to update order', 500);
    }
};
const deleteOrder = async (req, res) => {
    try {
        const deletedRowsCount = await Order.destroy({ where: { id: req.params.id } });
        if (deletedRowsCount === 0) {
            return responseError(res, 'Order not found', 404);
        } else {
            return responseSuccess(res, null, 'Order deleted successfully', 200);
        }
    } catch (error) {
        return responseError(res, 'Failed to delete order', 500);
    }
};
module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder
}