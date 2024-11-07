import { NextRequest, NextResponse } from 'next/server';

const baseUrl = process.env.BASE_URL;

export async function POST(request: NextRequest) {
  // Check if BASE_URL is set
  if (!baseUrl) {
    console.error('BASE_URL environment variable is not set.');
    return NextResponse.json(
      { error: 'BASE_URL environment variable is not set.' },
      { status: 500 }
    );
  }

  try {
    // Parse the request body
    const { first_name, last_name, phone_number, password, role } = await request.json();

    // Validate required fields
    if (!first_name || !last_name || !phone_number || !password || !role) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }

    // Make a POST request to the external registration API
    const response = await fetch(`${baseUrl}/api/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ first_name, last_name, phone_number, password, role }),
    });

    // Check the response from the external API
    const textResponse = await response.text();
    console.log('Backend response:', textResponse, 'Status:', response.status);

    // Handle errors from the external API
    if (!response.ok) {
      return NextResponse.json(
        { error: textResponse || 'Register failed. Invalid credentials.' },
        { status: response.status }
      );
    }

    // Parse the successful response
    const result = JSON.parse(textResponse);
    const userRole = result.role;

    // Return a success response
    return NextResponse.json(
      { message: 'User created successfully', role: userRole },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
