
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
  
  const CurrencySelect = ({ value, onChange, currencies, label }: any) => {
    return (
        <FormControl fullWidth style={{ margin: '10px' }}>
        <InputLabel>{label}</InputLabel>
        <Select
          value={value}
          onChange={onChange}
          label={label}
          style={{ padding: '5px' }}
        >
          {currencies.map((currency: any) => (
            <MenuItem key={currency.code} value={currency.code}>
              {currency.name} ({currency.code})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    )
  }
  
  export default CurrencySelect