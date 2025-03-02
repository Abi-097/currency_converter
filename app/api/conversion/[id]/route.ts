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
    // Connect to the database
    await connectToDatabase();
    
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
      { error: 'Failed to delete conversion record' },
      { status: 500 }
    );
  }
}