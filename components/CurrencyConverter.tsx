"use client"
import { useState } from 'react';
import axios from 'axios';
import CurrencySelect from './common/Select';
import { TextField } from '@mui/material';
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

  const API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY;
  const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency}`;

  const currencies = [
    { code: 'USD', name: 'United States Dollar' },
    { code: 'LKR', name: 'Sri Lankan Rupee' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'INR', name: 'Indian Rupee' },
  ];

  const fetchExchangeRate = async () => {
    setLoading(true);
    setSaveSuccess(false);
    try {
      const response = await axios.get(API_URL);
      const rate = response.data.conversion_rates[toCurrency];
      setExchangeRate(rate);
      const converted = amount * rate;
      setConvertedAmount(converted);
      
      // Save to database
      await saveConversionToDb(rate, converted);
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveConversionToDb = async (rate: number, converted: number) => {
    setSavingToDb(true);
    try {
      const response = await axios.post('https://currency-converter-xxl7.vercel.app/dashboard/currency-converter/api/conversion', {
        fromCurrency,
        toCurrency,
        amount,
        exchangeRate: rate,
        convertedAmount: converted
      });
      
      if (response.data.success) {
        setSaveSuccess(true);
      }
    } catch (error) {
      console.error('Error saving to database:', error);
    } finally {
      setSavingToDb(false);
    }
  };

  const handleConvert = () => {
    if (amount > 0) {
      fetchExchangeRate();
    } else {
      alert('Please enter a valid amount.');
    }
  };

  // Check if both currencies are selected
  const isConvertDisabled = !fromCurrency || !toCurrency || loading;
  return (
    <>
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
      <h1>Currency Converter</h1>
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