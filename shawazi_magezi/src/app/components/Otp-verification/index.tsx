// app/components/OtpVerification.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const OtpVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    const tempLoginData = sessionStorage.getItem("tempLoginData");
    if (tempLoginData) {
      try {
        const { phone_number } = JSON.parse(tempLoginData);
        setPhoneNumber(phone_number);
      } catch (error) {
        console.error("Error parsing tempLoginData:", error);
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = async (otpString: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      throw new Error("BASE_URL environment variable is not set");
    }

    const response = await fetch(`${baseUrl}/api/otp-verification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        otp: otpString,
        phone_number: phoneNumber,
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to verify OTP");
      } else {
        throw new Error("Failed to verify OTP");
      }
    }

    return await response.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setError("Please enter all 6 digits");
      setLoading(false);
      return;
    }

    try {
      const response = await verifyOtp(otpString);
      
      const tempData = JSON.parse(sessionStorage.getItem("tempLoginData") || "{}");
      const userRole = tempData.role;

      // Only remove tempLoginData after successful verification
      sessionStorage.removeItem("tempLoginData");

      switch (userRole) {
        case "buyer":
          router.push("/buyer/land-display");
          break;
        case "seller":
          router.push("/seller/seller-page");
          break;
        case "lawyer":
          router.push("/lawyer/draft-contract");
          break;
        default:
          router.push("/login");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to verify OTP";
      setError(errorMessage);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // Rest of the JSX remains the same
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center relative overflow-hidden">
      <div className="border-2 border-primary rounded-lg p-6 sm:p-8 md:p-12 mx-auto w-[90%] md:w-[60%] lg:w-[40%] bg-white shadow-md">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-primary mb-6">
          Verify OTP
        </h2>
        <p className="text-center mb-4 sm:mb-6">
          Please enter the verification code sent to {phoneNumber}
        </p>
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-9">
          <div className="flex justify-center space-x-4 sm:space-x-6 mb-4 sm:mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-10 h-12 sm:w-12 sm:h-16 text-center text-2xl sm:text-3xl border-2 border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={loading}
                required
              />
            ))}
          </div>
          {error && (
            <p className="text-red-500 text-center font-medium">{error}</p>
          )}
          <button
            type="submit"
            className={`w-full bg-primary text-white py-3 sm:py-4 px-4 rounded-md text-lg sm:text-xl ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-opacity-90"
            }`}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpVerification;





























function verifyOtp(otpString: string) {
  throw new Error("Function not implemented.");
}
// "use client";

// import { useState, useRef, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { getCookie } from "cookies-next";

// const OtpVerification = () => {
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [userRole, setUserRole] = useState<string | null>(null);
//   const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
//   const router = useRouter();

//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const roleFromUrl = urlParams.get("role");

//     if (roleFromUrl) {
//       setUserRole(roleFromUrl);
//     } else {
//       const roleCookie = getCookie("role");
//       if (roleCookie) {
//         setUserRole(roleCookie.toString());
//       }
//     }
//   }, [router]);

//   const handleOtpChange = (index: number, value: string) => {
//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);
//     if (value && inputRefs.current[index + 1]) {
//       inputRefs.current[index + 1]?.focus();
//     }
//   };

//   const handleKeyDown = (
//     index: number,
//     e: React.KeyboardEvent<HTMLInputElement>
//   ) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const isVerified = await verifyOtp(otp.join(""));
//       if (isVerified) {
//         switch (userRole) {
//           case "buyer":
//             router.push('/buyer/land-display');
//             break;
//           case "seller":
//             router.push("/seller/seller-page");
//             break;
//           case "lawyer":
//             router.push("/lawyer/draft-contract");
//             break;
//           default:
//             setError("Invalid user role. Please log in again.");
//             router.push("/login");
//         }
//       } else {
//         setError("Invalid OTP. Please try again.");
//       }

//     } catch (err) {
//       console.error("Error during OTP verification:", err);
//       setError("Failed to verify OTP. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const verifyOtp = async (otpString: string) => {
//     console.log("Verifying OTP:", otpString);
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve(true); 
//       }, 1000);
//     });
//   };

//   return (
//     <div className="min-h-screen bg-white flex flex-col justify-center items-center relative overflow-hidden">
//       <div className="border-2 border-primary rounded-lg p-6 sm:p-8 md:p-12 mx-auto w-[90%] md:w-[60%] lg:w-[40%] bg-white shadow-md">
//         <h2 className="text-2xl sm:text-3xl font-bold text-center text-primary mb-6">Verify Code</h2>
//         <p className="text-center mb-4 sm:mb-6">
//           Please enter the verification code sent to your phone number.
//           {userRole && <span className="block mt-2">Verifying as: {userRole}</span>}
//         </p>
//         <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-9">
//           <div className="flex justify-center space-x-4 sm:space-x-6 mb-4 sm:mb-6">
//             {otp.map((digit, index) => (
//               <input
//                 key={index}
//                 ref={(el) => {
//                   inputRefs.current[index] = el;
//                 }}
//                 type="text"
//                 maxLength={1}
//                 value={digit}
//                 onChange={(e) => handleOtpChange(index, e.target.value)}
//                 onKeyDown={(e) => handleKeyDown(index, e)}
//                 className="w-10 h-12 sm:w-12 sm:h-16 text-center text-2xl sm:text-3xl border-2 border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//                 required
//               />
//             ))}
//           </div>
//           {error && <p className="text-red-500 text-center">{error}</p>}
//           <button
//             type="submit"
//             className={`w-full bg-primary text-white py-3 sm:py-4 px-4 rounded-md text-lg sm:text-xl ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
//             disabled={loading}
//           >
//             {loading ? "Verifying..." : "Verify OTP"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default OtpVerification;
