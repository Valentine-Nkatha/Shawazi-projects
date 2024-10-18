"use client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import { MdClose } from "react-icons/md";
import { LandDetails, UserDatas } from "@/app/utils/types";
import Cookies from 'js-cookie';

interface LandDetailsModalProps {
  land: LandDetails | null;
  onClose: () => void;
}

const LandDetailsModal: React.FC<LandDetailsModalProps> = ({ land, onClose }) => {
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    console.log("Google Maps API Key:", process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
  }, []);

  if (!land || !land.latitude || !land.longitude) {
    console.error("Invalid land details or missing latitude/longitude.");
    return null; 
  }

  const containerStyle = {
    width: '100%',
    height: '100%',
  };

  const formatDate = (dateStr: string | undefined) => {
    return dateStr ? new Date(dateStr).toLocaleDateString() : "N/A";
  };

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const handleInterestClick = async (land: LandDetails) => {
    setLoadingStates((prev) => ({ ...prev, [land.land_details_id]: true }));
  
    try {
      const userPhone = Cookies.get("phone_number"); 
      if (!userPhone) {
        toast.error("User is not logged in!");
        return;
      }
  
      const response = await fetch(`${BASE_URL}/api/users/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch user data.");
      }
  
      const users: UserDatas[] = await response.json();
      const currentUser = users.find((user) => user.phone_number === userPhone);
      if (!currentUser) {
        toast.error("User not found!");
        return;
      }
  
      if (!currentUser.first_name || !currentUser.last_name) {
        toast.error("Invalid buyer data!");
        return;
      }
  
      const buyerName = `${currentUser.first_name} ${currentUser.last_name}`;
      const notificationData = {
        message: `A buyer named ${buyerName} is interested in your land in ${land.location_name}!`,
        timestamp: new Date().toISOString(),
      };
      
      console.log('Notification Data:', notificationData); 
  
      const postResponse = await fetch(
        `${BASE_URL}/api/notify-seller/${land.land_details_id}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(notificationData),
        }
      );
  
      if (!postResponse.ok) {
        const errorMessage = await postResponse.text();
        console.error("Error response:", errorMessage);
        throw new Error("Failed to send notification.");
      }
  
      Cookies.set('buyerNotification', JSON.stringify(notificationData), { expires: 7 });
      toast.success("Interest expressed successfully. Notification sent to seller.");
    } catch (error) {
      console.error("Error:", error);
      toast.error("This land is already under consideration by another buyer.");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [land.land_details_id]: false }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-3xl mx-auto relative h-[80vh] w-[80vw] overflow-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
          aria-label="Close Modal"
        >
          <MdClose className="h-6 w-6 text-gray-500 hover:text-black" />
        </button>
        <h2 className="text-2xl font-bold mb-6">Land Details</h2>
        <div className="h-72 mb-4 border-4 border-blue-500 rounded-lg overflow-hidden">
          <LoadScript
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
            onLoad={() => console.log('Google Maps script loaded successfully')}
            onError={() => console.error('Failed to load Google Maps script')}
          >
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={{ lat: Number(land.latitude), lng: Number(land.longitude) }}
              zoom={13}
              onLoad={() => console.log('Google Map loaded')}
            >
              <Marker position={{ lat: Number(land.latitude), lng: Number(land.longitude) }} />
            </GoogleMap>
          </LoadScript>
        </div>
        <div className="text-xl leading-relaxed space-y-4">
          <p><strong>Location:</strong> {land.location_name || "N/A"}</p>
          <p><strong>Parcel Number:</strong> {land.parcel_number || "N/A"}</p>
          <p><strong>Current Owner:</strong> {land.owner_name || "N/A"}</p>
          <p><strong>Date Acquired:</strong> {formatDate(land.date_acquired)}</p>
          <p><strong>Previous Owner:</strong> {land.previous_owner || "N/A"}</p>
          <p><strong>Address:</strong> {land.address || "N/A"}</p>
          <p><strong>National ID:</strong> {land.national_id || "N/A"}</p>
        </div>
        <button 
          onClick={() => handleInterestClick(land)}
          className="bg-foreground hover:bg-primary text-white font-bold py-2 px-4 rounded mt-4"
          disabled={loadingStates[land.land_details_id] || false} 
        >
          {loadingStates[land.land_details_id] ? 'Loading...' : 'Interested'}
        </button>
      </div>
    </div>
  );
};

export default LandDetailsModal;
