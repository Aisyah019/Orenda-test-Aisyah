import React, { useState, useEffect, ChangeEvent, Key } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Typography,
  TextField,
  Box,
  TablePagination,
  Card,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Breadcrumbs,
  Snackbar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MuiAlert from "@mui/material/Alert";
import API_URL from "../config";

interface Product {
  id: Key | null | undefined;
  name: string;
  price: string; 
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchName, setSearchName] = useState<string>("");
  const [filterPhone, setFilterPhone] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [filterPrice] = useState<number>(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data.data);
      setLoading(false);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred");
      }
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProductId) return;

    try {
      await axios.delete(`${API_URL}/products/${selectedProductId}`);
      fetchProducts();
      setConfirmDialogOpen(false);
      showSnackbar("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      showSnackbar("Failed to delete product. Please try again.");
    }
  };

  const handleSearchNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchName(event.target.value);
  };

  const handleFilterPhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFilterPhone(event.target.value);
  };

  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    productId: number
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedProductId(productId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleConfirmDialogOpen = () => {
    setConfirmDialogOpen(true);
  };

  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

 const filteredProducts = products.filter((product) => {
  return (
    product.name.toLowerCase().includes(searchName.toLowerCase()) &&
    parseInt(product.price, 10) >= filterPrice
  );
});

  if (loading) return <CircularProgress />;
  if (error)
    return (
      <Typography color="error">Error fetching products: {error}</Typography>
    );

  return (
    <div>
      <Box mb={2}>
        <Typography variant="h5" fontWeight="bold">
          Products Page
        </Typography>
        <Breadcrumbs aria-label="breadcrumb">
          <Typography color="textSecondary" fontWeight={"bold"}>
            Main Menu
          </Typography>
        </Breadcrumbs>
      </Box>
      <Card variant="outlined" sx={{ padding: "24px" }}>
        <Box display="flex" justifyContent="flex-start">
          <Typography variant="h6" fontWeight={"bold"}>
            All Products
          </Typography>
        </Box>
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            component={Link}
            to="/products/create"
            variant="contained"
            sx={{
              backgroundColor: "#D22B2B",
              color: "#fff",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#b71c1c",
              },
            }}
            startIcon={<AddIcon />}
          >
            Add New Product
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Product Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <TextField
                    label="Search name"
                    value={searchName}
                    onChange={handleSearchNameChange}
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    label="Filter"
                    value={filterPhone}
                    onChange={handleFilterPhoneChange}
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </TableCell>
                <TableCell />
                <TableCell />
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body1" color="textSecondary">
                      No products found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell>
                      <IconButton onClick={(event) => {
                        if (product.id !== null && product.id !== undefined) {
                         handleMenuOpen(event, parseInt(product.id as string));
                        }
                      }}>
                       <MoreVertIcon />
                      </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl && selectedProductId === product.id)}
                          onClose={handleMenuClose}
                        >
                          <MenuItem
                            component={Link}
                            to={`/products/edit/:id ${product.id}`}
                            onClick={handleMenuClose}
                          >
                            Edit
                          </MenuItem>
                          <MenuItem
                             onClick={() => {
                              if (product.id !== null && product.id !== undefined) {
                                setSelectedProductId(product.id as number);
                                handleConfirmDialogOpen();
                                handleMenuClose();
                              }
                             }}
                          >
                            Delete
                          </MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={filteredProducts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Card>
      <Dialog
        open={confirmDialogOpen}
        onClose={handleConfirmDialogClose}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDialogClose}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
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
          severity={
            snackbarMessage.includes("successfully") ? "success" : "error"
          }
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default ProductList;
