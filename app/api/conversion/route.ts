import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ConversionHistory from '@/models/ConversionHistory';

export async function POST(request: Request) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Parse the request body
    const body = await request.json();
    const { fromCurrency, toCurrency, amount, exchangeRate, convertedAmount } = body;
    
    // Validate the required fields
    if (!fromCurrency || !toCurrency || !amount || !exchangeRate || !convertedAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create a new conversion history record
    const conversionRecord = await ConversionHistory.create({
      fromCurrency,
      toCurrency,
      amount,
      exchangeRate,
      convertedAmount,
      timestamp: new Date()
    });
    
    // Return the created record
    return NextResponse.json(
      { success: true, data: conversionRecord },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving conversion history:', error);
    return NextResponse.json(
      { error: 'Failed to save conversion history' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Get all conversion history records, sorted by timestamp (newest first)
    const conversionHistory = await ConversionHistory.find({})
      .sort({ timestamp: -1 })
      .limit(10);
    
    // Return the records
    return NextResponse.json(
      { success: true, data: conversionHistory },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching conversion history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversion history' },
      { status: 500 }
    );
  }
}