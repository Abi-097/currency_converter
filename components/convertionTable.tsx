"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface Conversion {
  _id: string;
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  exchangeRate: number;
  convertedAmount: number;
  timestamp: string;
}

const ConversionTable = () => {
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch conversions from database with retry logic
  const fetchConversions = async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/api/conversion', {
        timeout: 10000 // 10 second timeout
      });
      
      // Ensure response.data.data is an array before setting it
      if (Array.isArray(response.data.data)) {
        setConversions(response.data.data); // Set the conversions state
      } else {
        // console.error("Data is not an array:", response.data.data);
        setConversions([]); // Set an empty array if the structure is unexpected
      }
    } catch (error: any) {
      console.error('Error fetching conversions:', error);
      
      // Implement retry logic (max 3 retries)
      if (retryCount < 3) {
        setError(`Loading data, retrying... (${retryCount + 1}/3)`);
        setTimeout(() => fetchConversions(retryCount + 1), 2000);
      } else {
        setError(`Failed to load conversion history. ${error.message || 'Please try again later.'}`);
        setConversions([]);
      }
    } finally {
      setLoading(false);
    }
  };
  

  // Delete conversion with retry logic
  const handleDelete = async (id: string, retryCount = 0) => {
    try {
      setDeleting(id);
      setError(null);
      
      await axios.delete(`/api/conversion/${id}`, {
        timeout: 8000 // 8 second timeout
      });
      
      setConversions(conversions.filter(conv => conv._id !== id));
    } catch (error: any) {
      console.error('Error deleting conversion:', error);
      
      // Implement retry logic (max 2 retries)
      if (retryCount < 2) {
        setTimeout(() => handleDelete(id, retryCount + 1), 1500);
      } else {
        setError(`Failed to delete record. ${error.message || 'Please try again later.'}`);
      }
    } finally {
      setDeleting(null);
    }
  };

  useEffect(() => {
    fetchConversions();
  }, []);

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <>
      {error && (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
          <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      )}
      
      <TableContainer component={Paper} sx={{ maxWidth: '100%', margin: '20px auto' }}>
        <Table sx={{ minWidth: 650 }} aria-label="currency conversion table">
          <TableHead>
            <TableRow>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Rate</TableCell>
              <TableCell align="right">Converted</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : conversions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No conversions found
                </TableCell>
              </TableRow>
            ) : (
              conversions.map((conversion) => (
                <TableRow
                  key={conversion._id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {conversion.fromCurrency}
                  </TableCell>
                  <TableCell>{conversion.toCurrency}</TableCell>
                  <TableCell align="right">{conversion.amount.toFixed(2)}</TableCell>
                  <TableCell align="right">{conversion.exchangeRate.toFixed(2)}</TableCell>
                  <TableCell align="right">{conversion.convertedAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    {new Date(conversion.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDelete(conversion._id)}
                      disabled={deleting === conversion._id}
                    >
                      {deleting === conversion._id ? (
                        <CircularProgress size={24} />
                      ) : (
                        <DeleteIcon />
                      )}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ConversionTable;