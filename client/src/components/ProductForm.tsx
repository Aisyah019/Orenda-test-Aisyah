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
  Snackbar
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import API_URL from "../config";

interface Product {
  name: string;
  price: string; 
}

const ProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product>({ name: '', price: '' });
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/products/${id}`);
        setProduct(response.data.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (id) {
        await axios.put(`${API_URL}/products/${id}`, product);
        setSnackbarMessage("Product updated successfully!");
      } else {
        await axios.post(`${API_URL}/products/create`, product);
        setSnackbarMessage("New product created successfully!");
      }
      setSnackbarOpen(true);
      navigate('/products');
    } catch (error) {
      console.error('Error saving product:', error);
      setSnackbarMessage("Failed to save product. Please try again.");
      setSnackbarOpen(true);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

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
      backgroundColor: "#b71c1c",
    },
  };

  const cancelButtonStyles = {
    ...buttonStyles,
    backgroundColor: "#FFFFFF",
    color: "#000",
    "&:hover": {
      backgroundColor: "#ffffff",
    },
  };

  if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto' }} />;

  return (
    <div>
      <Box mb={2}>
        <Typography variant="h5" fontWeight="bold">
          Products Page
        </Typography>
        <Breadcrumbs aria-label="breadcrumb" separator=">" sx={{ mt: 1 }}>
          <Link to="/" style={{ color: "#D22B2B", textDecoration: "none", fontWeight: "bold" }}>
            Main Menu
          </Link>
          <Typography color="textSecondary" fontWeight={"bold"}>
            {id ? 'Edit Product' : 'Create New Product'}
          </Typography>
        </Breadcrumbs>
      </Box>
      <Card variant="outlined" sx={{ padding: "24px" }}>
        <Box display="flex" justifyContent="flex-start" mb={2}>
          <Typography variant="h6" fontWeight={"bold"}>
            Product Information
          </Typography>
        </Box>
        <Box component="form" noValidate autoComplete="off">
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <TextField
                    label="Product Name"
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                    required
                    autoFocus
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Price"
                    name="price"
                    value={product.price}
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

export default ProductForm;
