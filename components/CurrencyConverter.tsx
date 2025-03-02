"use client"
import { useState } from 'react';
import axios from 'axios';
import CurrencySelect from './common/Select';
import { TextField, Alert, Snackbar } from '@mui/material';
import CustomButton from './common/Button';
import ConversionTable from './convertionTable';

const CurrencyConverter = () => {
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [amount, setAmount] = useState(1);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [savingToDb, setSavingToDb] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY;
  const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency}`;

  const currencies = [
    { code: 'USD', name: 'United States Dollar' },
    { code: 'LKR', name: 'Sri Lankan Rupee' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'INR', name: 'Indian Rupee' },
  ];

  const fetchExchangeRate = async (retryCount = 0) => {
    setLoading(true);
    setSaveSuccess(false);
    setError(null);
    
    try {
      const response = await axios.get(API_URL, {
        timeout: 10000 // 10 second timeout
      });
      
      const rate = response.data.conversion_rates[toCurrency];
      setExchangeRate(rate);
      const converted = amount * rate;
      setConvertedAmount(converted);
      
      // Save to database
      await saveConversionToDb(rate, converted);
    } catch (error: any) {
      console.error('Error fetching exchange rate:', error);
      
      // Implement retry logic (max 2 retries)
      if (retryCount < 2) {
        setError(`Retrying... (${retryCount + 1}/2)`);
        setTimeout(() => fetchExchangeRate(retryCount + 1), 2000);
      } else {
        setError(`Failed to fetch exchange rate. ${error.message || 'Please try again later.'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const saveConversionToDb = async (rate: number, converted: number, retryCount = 0) => {
    setSavingToDb(true);
    try {
      const response = await axios.post('/api/conversion', {
        fromCurrency,
        toCurrency,
        amount,
        exchangeRate: rate,
        convertedAmount: converted
      }, {
        timeout: 8000 // 8 second timeout
      });
      
      if (response.data.success) {
        setSaveSuccess(true);
      }
    } catch (error: any) {
      console.error('Error saving to database:', error);
      
      // Implement retry logic (max 2 retries)
      if (retryCount < 2) {
        setTimeout(() => saveConversionToDb(rate, converted, retryCount + 1), 2000);
      } else {
        setError(`Conversion calculated, but failed to save to history. ${error.message || ''}`);
      }
    } finally {
      setSavingToDb(false);
    }
  };

  const handleConvert = () => {
    if (amount > 0) {
      fetchExchangeRate();
    } else {
      setError('Please enter a valid amount.');
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  // Check if both currencies are selected
  const isConvertDisabled = !fromCurrency || !toCurrency || loading;
  return (
    <>
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
      <h1>Currency Converter</h1>
      
      {error && (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
          <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      )}
      
      <div>
        <CurrencySelect
          value={fromCurrency}
          onChange={(e:any) => setFromCurrency(e.target.value)}
          currencies={currencies}
          label="From Country"
        />
      </div>
      <div>
        <CurrencySelect
          value={toCurrency}
          onChange={(e:any) => setToCurrency(e.target.value)}
          currencies={currencies}
          label="To Country"
        />
      </div>
      <div style={{display:'flex', margin: '10px'}}>
        <label>Transfer Amount:</label>
        <TextField style={{ padding: '5px' }} id="outlined-basic" label="Transfer Amount" variant="outlined" type="number" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))} />
      </div>
      <CustomButton 
          onClick={handleConvert} 
          disabled={isConvertDisabled}
          style={{ padding: '10px 20px', cursor: isConvertDisabled ? 'not-allowed' : 'pointer' }}
          loading={loading}
          text={loading ? 'Converting...' : 'Convert'}
        />
      
      {/* exchnage rate */}
      {exchangeRate !== null && convertedAmount !== null && (
        <div style={{ marginTop: '20px' }}>
          <p>Exchange Rate: 1 {fromCurrency} = {exchangeRate} {toCurrency}</p>
          <p>Converted Amount: {convertedAmount.toFixed(2)} {toCurrency}</p>
        </div>
      )}
    </div>
    <ConversionTable />
    </>
  );
};

export default CurrencyConverter;