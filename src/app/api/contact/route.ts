import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const contactUrl = process.env.NEXT_PUBLIC_CONTACT_URL;

  if (!contactUrl) {
    console.error('NEXT_PUBLIC_CONTACT_URL is not defined');
    return NextResponse.json(
      { message: 'Contact URL not configured' },
      { status: 500 }
    );
  }

  try {

    // Get form data from the request
    const formData = await request.formData();

    // Forward the form data to WordPress Contact Form 7
    // Use the same approach as the client-side fetch
    const response = await fetch(contactUrl, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - let fetch set it automatically with boundary
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    if (!response.ok) {
      const errorText = await response.text();
      console.error('WordPress CF7 error:', {
        status: response.status,
        statusText: response.statusText,
        contentType,
        errorText: errorText.substring(0, 500), // Limit log size
      });
      
      return NextResponse.json(
        { 
          message: 'Form submission failed', 
          error: errorText.substring(0, 200),
          status: response.status 
        },
        { status: response.status }
      );
    }

    // Try to parse as JSON, fallback to text if not JSON
    let result;
    if (isJson) {
      try {
        result = await response.json();
      } catch {
        const textResult = await response.text();
        console.error('Failed to parse JSON response:', textResult.substring(0, 500));
        return NextResponse.json(
          { message: 'Invalid JSON response from server', raw: textResult.substring(0, 200) },
          { status: 500 }
        );
      }
    } else {
      const textResult = await response.text();
      console.warn('Non-JSON response received:', textResult.substring(0, 500));
      // WordPress CF7 might return HTML success page, treat as success
      result = { status: 'mail_sent', message: 'Message sent successfully' };
    }

    return NextResponse.json(result);
  } catch (error) {
    // Enhanced error logging
    const errorDetails = error instanceof Error ? {
      message: error.message,
      name: error.name,
      cause: (error as any).cause,
      stack: error.stack?.split('\n').slice(0, 3).join('\n'), // First 3 lines of stack
    } : { message: 'Unknown error', error };

    console.error('Error proxying contact form:', {
      ...errorDetails,
      contactUrl: contactUrl ? new URL(contactUrl).origin : 'not configured',
    });

    // Provide more specific error messages
    let errorMessage = 'Internal server error';
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.name === 'AbortError' || error.message.includes('timeout')) {
        errorMessage = 'Request timeout: The server took too long to respond';
        statusCode = 504;
      } else if (error.message.includes('ECONNREFUSED') || error.message.includes('fetch failed')) {
        errorMessage = 'Connection refused: Unable to reach the WordPress server. Please check server configuration.';
        statusCode = 502;
      } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
        errorMessage = 'DNS resolution failed: Unable to resolve the server address';
        statusCode = 502;
      } else {
        errorMessage = `Network error: ${error.message}`;
      }
    }

    return NextResponse.json(
      { 
        message: errorMessage,
        error: process.env.NODE_ENV === 'development' ? errorDetails.message : undefined,
      },
      { status: statusCode }
    );
  }
}

