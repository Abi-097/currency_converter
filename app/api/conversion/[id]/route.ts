import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ConversionHistory from '@/models/ConversionHistory';
import { NextRequest } from 'next/server';

// Using the correct type definitions for Next.js App Router
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to the database with a timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database connection timeout')), 5000)
    );
    
    const dbPromise = connectToDatabase();
    
    // Race the connection against a timeout
    await Promise.race([dbPromise, timeoutPromise]);
    
    const id = params.id;
    
    // Validate the ID
    if (!id) {
      return NextResponse.json(
        { error: 'Missing record ID' },
        { status: 400 }
      );
    }
    
    // Delete the record
    const result = await ConversionHistory.findByIdAndDelete(id);
    
    if (!result) {
      return NextResponse.json(
        { error: 'Record not found' },
        { status: 404 }
      );
    }
    
    // Return success response
    return NextResponse.json(
      { success: true, message: 'Record deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting conversion record:', error);
    return NextResponse.json(
      { error: 'Failed to delete conversion record', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}