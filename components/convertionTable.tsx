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

  // Fetch conversions from database
  const fetchConversions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/conversion');
      // Ensure response.data.data is an array before setting it
      if (Array.isArray(response.data.data)) {
        setConversions(response.data.data); // Set the conversions state
      } else {
        // console.error("Data is not an array:", response.data.data);
        setConversions([]); // Set an empty array if the structure is unexpected
      }
    } catch (error) {
      console.error('Error fetching conversions:', error);
    } finally {
      setLoading(false);
    }
  };
  

  // Delete conversion
  const handleDelete = async (id: string) => {
    try {
      setDeleting(id);
      await axios.delete(`/api/conversion/${id}`);
      setConversions(conversions.filter(conv => conv._id !== id));
    } catch (error) {
      console.error('Error deleting conversion:', error);
    } finally {
      setDeleting(null);
    }
  };

  useEffect(() => {
    fetchConversions();
  }, []);

  return (
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
  );
};

export default ConversionTable;