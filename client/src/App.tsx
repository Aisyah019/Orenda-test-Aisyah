import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomerList from "./components/CustomerList";
import CustomerForm from "./components/CustomerForm";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";
import OrderList from "./components/OrderList";
import OrderForm from "./components/OrderForm";
import Sidebar from "./components/Sidebar";

import { CssBaseline, Box, AppBar, Toolbar } from "@mui/material";

const App: React.FC = () => {
    const [open, setOpen] = useState(false);

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    return (
        <Router>
            <CssBaseline />
            <Box sx={{ display: "flex", backgroundColor: "#F0F0F0" }}>
                <AppBar position="fixed" color="default">
                    <Toolbar />
                </AppBar>
                <Sidebar open={open} handleDrawerToggle={handleDrawerToggle} />
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        transition: "margin 0.3s",
                        marginTop: "60px",
                    }}
                >
                    <Routes>
                        <Route path="/" element={<CustomerList />} />
                        <Route path="/products" element={<ProductList />} />
                        <Route path="/orders" element={<OrderList />} />
                        <Route path="/create" element={<CustomerForm />} />
                        <Route path="/edit/:id" element={<CustomerForm />} />
                        <Route path="/products/create" element={<ProductForm />} />
                        <Route path="/edit/:id" element={<ProductForm />} />
                        <Route path="/orders/create" element={<OrderForm />} />
                        <Route path="/edit/:id" element={<OrderForm />} />
                    </Routes>
                </Box>
            </Box>
        </Router>
    );
};

export default App;
