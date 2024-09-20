import React, { useState, useEffect, ChangeEvent } from "react";
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Typography,
  TextField,
  Box,
  Card,
  Button,
  Breadcrumbs,
  CircularProgress,
  Grid,
  Snackbar,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import API_URL from "../config";
// Interface for order
interface Order {
  customerId: string;
  productId: string;
  quantity: number;
}
// Interface for customer
interface Customer {
  id: string;
  name: string;
}
const OrderForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order>({ customerId: '', productId: '', quantity: 1 });
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [products, setProducts] = useState<{ id: string, name: string }[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]); // Added state for customers
  // Fetch order and products (and customers) on mount
  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/orders/${id}`);
        setOrder(response.data.data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/products`);
        setProducts(response.data.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    const fetchCustomer = async () => {
      try {
        const response = await axios.get(`${API_URL}/customer`);
        setCustomers(response.data.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };
    if (id) fetchOrder();
    fetchProducts();
    fetchCustomer(); // Call this to load customer data
  }, [id]);
  // Handle Snackbar Close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  // Handle form input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOrder({ ...order, [e.target.name]: e.target.value });
  };
  // Handle select change for dropdowns
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setOrder({ ...order, [e.target.name]: e.target.value });
  };
  // Handle save order
  const handleSave = async () => {
    try {
      if (id) {
        await axios.put(`${API_URL}/orders/${id}`, order);
        setSnackbarMessage("Product updated successfully!");
      } else {
        await axios.post(`${API_URL}/orders/create`, order);
        setSnackbarMessage("New product created successfully!");
      }
      setSnackbarOpen(true);
      navigate('/orders');
    } catch (error) {
      console.error('Error saving orders:', error);
      setSnackbarMessage("Failed to save order. Please try again.");
      setSnackbarOpen(true);
    }
  };
  // Handle cancel
  const handleCancel = () => {
    navigate('/');
  };
  // Button Styles
  const buttonStyles = {
    textTransform: "none",
    width: "150px",
    fontWeight: "bold",
  };
  const saveButtonStyles = {
    ...buttonStyles,
    backgroundColor: "#D22B2B",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#B71C1C",
    },
  };
  const cancelButtonStyles = {
    ...buttonStyles,
    backgroundColor: "#FFFFFF",
    color: "#000",
    "&:hover": {
      backgroundColor: "#FFFFFF",
    },
  };
  if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto' }} />;
  return (
    <div>
      <Box mb={2}>
        <Typography variant="h5" fontWeight="bold">
          Orders Page
        </Typography>
        <Breadcrumbs aria-label="breadcrumb" separator=">" sx={{ mt: 1 }}>
          <Link to="/" style={{ color: "#D22B2B", textDecoration: "none", fontWeight: "bold" }}>
            Main Menu
          </Link>
          <Typography color="textSecondary" fontWeight={"bold"}>
            {id ? 'Edit Order' : 'Create New Order'}
          </Typography>
        </Breadcrumbs>
      </Box>
      <Card variant="outlined" sx={{ padding: "24px" }}>
        <Box display="flex" justifyContent="flex-start" mb={2}>
          <Typography variant="h6" fontWeight={"bold"}>
            Order Information
          </Typography>
        </Box>
        <Box component="form" noValidate autoComplete="off">
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Grid container spacing={1}>
                <Grid item xs={15}>
                  <FormControl fullWidth variant="outlined" margin="normal" required>
                    <InputLabel>Customer</InputLabel>
                    <Select
                      name="customerId"
                      value={order.customerId}
                      onChange={handleSelectChange}
                      label="Customer"
                    >
                      {customers.map((customer) => (
                        <MenuItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined" margin="normal" required>
                    <InputLabel>Product</InputLabel>
                    <Select
                      name="productId"
                      value={order.productId}
                      onChange={handleSelectChange}
                      label="Product"
                    >
                      {products.map((product) => (
                        <MenuItem key={product.id} value={product.id}>
                          {product.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Quantity"
                    name="quantity"
                    type="number"
                    value={order.quantity}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Box mt={12} borderTop={1} borderColor="grey.300" pt={3}>
            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                onClick={handleCancel}
                sx={cancelButtonStyles}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                sx={{ ...saveButtonStyles, ml: 2 }}
              >
                {id ? 'Save' : 'Create New'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Card>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity={snackbarMessage.includes("successfully") ? "success" : "error"}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};
export default OrderForm;