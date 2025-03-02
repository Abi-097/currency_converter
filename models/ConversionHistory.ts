import mongoose, { Schema } from 'mongoose';

// Define the interface for the document
export interface IConversionHistory {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  exchangeRate: number;
  convertedAmount: number;
  timestamp: Date;
}

// Define the schema
const ConversionHistorySchema = new Schema<IConversionHistory>({
  fromCurrency: { type: String, required: true },
  toCurrency: { type: String, required: true },
  amount: { type: Number, required: true },
  exchangeRate: { type: Number, required: true },
  convertedAmount: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

// Create and export the model
export default mongoose.models.ConversionHistory || 
  mongoose.model<IConversionHistory>('ConversionHistory', ConversionHistorySchema);