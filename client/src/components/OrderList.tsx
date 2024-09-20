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

interface Order {
  id: Key | null | undefined;
  customerId: string;
  productId: string;
  quantity: number;
}

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchCustomerId, setSearchCustomerId] = useState('');
  const [filterQuantity] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders`);
      setOrders(response.data.data);
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
    if (!selectedOrderId) return;

    try {
      await axios.delete(`${API_URL}/orders/${selectedOrderId}`);
      fetchOrders();
      setConfirmDialogOpen(false);
      showSnackbar("Order deleted successfully!");
    } catch (error) {
      console.error("Error deleting order:", error);
      showSnackbar("Failed to delete order. Please try again.");
    }
  };

  const handleSearchNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchCustomerId(event.target.value);
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
    orderId: number
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrderId(orderId);
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

  const filteredOrders = orders.filter((order) => {
    return (
      typeof order.customerId === 'string' &&
      typeof order.quantity === 'number' &&
      order.customerId.toLowerCase().includes(searchCustomerId.toLowerCase()) &&
      order.quantity >= Number(filterQuantity)
    );
  });

  if (loading) return <CircularProgress />;
  if (error)
    return (
      <Typography color="error">Error fetching orders: {error}</Typography>
    );

    function handleFilterPhoneChange(_event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        throw new Error("Function not implemented.");
    }

  return (
    <div>
      <Box mb={2}>
        <Typography variant="h5" fontWeight="bold">
          Orders Page
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
            All Orders
          </Typography>
        </Box>
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            component={Link}
            to="/orders/create"
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
            Add New Order
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Customer ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Product ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Quantity</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <TextField
                    label="Search costumerId"
                    value={searchCustomerId}
                    onChange={handleSearchNameChange}
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    label="Filter"
                    value={filterQuantity}
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
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body1" color="textSecondary">
                      No orders found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.customerId}</TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>
                      <IconButton onClick={(event) => {
                        if (order.id !== null && order.id !== undefined) {
                         handleMenuOpen(event, parseInt(order.id as string));
                        }
                      }}>
                       <MoreVertIcon />
                      </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl && selectedOrderId === order.id)}
                          onClose={handleMenuClose}
                        >
                          <MenuItem
                            component={Link}
                            to={`/orders/edit/:id ${order.id}`}
                            onClick={handleMenuClose}
                          >
                            Edit
                          </MenuItem>
                          <MenuItem
                             onClick={() => {
                              if (order.id !== null && order.id !== undefined) {
                                setSelectedOrderId(order.id as number);
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
            count={filteredOrders.length}
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
            Are you sure you want to delete this order?
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

export default OrderList;
