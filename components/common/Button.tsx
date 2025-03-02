import React from 'react';
import { Button, CircularProgress, ButtonProps } from '@mui/material';

interface CustomButtonProps extends ButtonProps {
  loading?: boolean;
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'primary' | 'secondary' | 'error' | 'inherit' | 'success' | 'info' | 'warning';
  text: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  loading = false,
  variant = 'contained',
  color = 'primary',
  text,
  disabled,
  ...props
}) => {
  return (
    <Button
      {...props}
      variant={variant}
      color={color}
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={24} color="inherit" /> : undefined}
    >
      {text}
    </Button>
  );
};

export default CustomButton;
