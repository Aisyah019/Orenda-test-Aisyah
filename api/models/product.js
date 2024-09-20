const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define("product", {
    name: {
        type: DataTypes.STRING(100), // Set maximum length to 100 characters
        allowNull: false,
    },
    price: {
        type: DataTypes.STRING(15), 
        allowNull: false,
    },
},
    {
        timestamps: false,
    }
);

// Product.hasMany(Order, { foreignKey: "productId" });

module.exports = Product;
