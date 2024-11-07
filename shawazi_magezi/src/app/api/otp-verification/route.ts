// app/api/otp_verification/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { otp, phone_number } = await request.json();
        console.log("Received OTP:", otp, "Received Phone Number:", phone_number);

        // Check if both OTP and phone number are provided
        if (!otp || !phone_number) {
            return NextResponse.json(
                { message: "OTP and phone number are required." },
                { status: 400 }
            );
        }

        // Call the function to verify OTP
        const response = await verifyOtpAPI(otp, phone_number);
        
        // Check the response from the OTP verification service
        const contentType = response.headers.get("content-type");
        if (!contentType?.includes("application/json")) {
            console.error("Received non-JSON response:", await response.text());
            return NextResponse.json(
                { message: "Invalid response from verification service" },
                { status: 500 }
            );
        }

        const responseData = await response.json();

        // Handle successful verification
        if (response.ok) {
            return NextResponse.json(
                { message: "Verification successful!", ...responseData },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { message: responseData.message || "Verification failed" },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("Server error during OTP verification:", error);
        return NextResponse.json(
            { message: "Error has occurred, kindly try again." },
            { status: 500 }
        );
    }
}

async function verifyOtpAPI(otp: string, phone_number: string) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
        throw new Error("BASE_URL environment variable is not set");
    }

    // Call your backend API to verify OTP
    const response = await fetch(`${baseUrl}/api/otp_verification`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({ otp, phone_number }),
        cache: 'no-store',
    });

    return response;
}
