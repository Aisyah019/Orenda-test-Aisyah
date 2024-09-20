const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Customer = require("./customer");
const Product = require("./product");
const Order = sequelize.define("order", {
    customerId: {
        type: DataTypes.INTEGER, // Set maximum length to 100 characters
        allowNull: false,
    },
    productId: {
        type: DataTypes.INTEGER, // Set maximum length to 15 characters for phone numbers
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER, // Set maximum length to 100 characters
        allowNull: false,
    },
},
    {
        timestamps: false,
    }
);
Order.belongsTo(Customer, { foreignKey: 'customerId' });
Customer.hasMany(Order, { foreignKey: 'customerId' });
Order.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(Order, { foreignKey: 'productId' });
module.exports = Order;