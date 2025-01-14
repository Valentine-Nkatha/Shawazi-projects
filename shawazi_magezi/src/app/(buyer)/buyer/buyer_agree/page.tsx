"use client";

import React, { useEffect, useState, useCallback } from "react";
import { AgreementFormData, UserRole } from "@/app/utils/types";
import ContractReviewPopup from "@/app/components/Contractreviewpop";


const BuyerAgreed: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [recentAgreement, setRecentAgreement] =
    useState<AgreementFormData | null>(null);

  const fetchBuyerAgreements = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/agreements/");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: AgreementFormData[] = await response.json();

      if (data.length > 0) {
        const largestIdAgreement = data.reduce((prev, current) =>
          prev.agreement_id > current.agreement_id ? prev : current
        );
        setRecentAgreement(largestIdAgreement);
      } else {
        setRecentAgreement(null);
      }

      setLastRefresh(new Date());
    } catch (error) {
      console.error("Error fetching buyer agreements:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBuyerAgreements();
    const intervalId = setInterval(() => {
      fetchBuyerAgreements();
    }, 30000);
    return () => clearInterval(intervalId);
  }, [fetchBuyerAgreements]);

  const handleAgreementUpdate = () => {
    fetchBuyerAgreements();
  };

  const handleShowPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-primary">Buyer Dashboard</h1>
      <div className="bg-gray-100 p-6 rounded-lg shadow-inner">
        {recentAgreement ? (
          <div className="space-y-3">
            <p>
              <strong className="text-gray-700">Parcel Number:</strong>{" "}
              {recentAgreement.parcel_number || "N/A"}
            </p>
            <p>
              <strong className="text-gray-700">Listed Price:</strong> Ksh
              {recentAgreement.agreed_amount?.toLocaleString() || "N/A"}
            </p>
            <p>
              <strong className="text-gray-700">Contract Duration:</strong>{" "}
              {recentAgreement.contract_duration} months
            </p>
            <p>
              <strong className="text-gray-700">Down Payment:</strong> Ksh
              {recentAgreement.down_payment?.toLocaleString() || "N/A"}
            </p>
            <p>
              <strong className="text-gray-700">Status:</strong>
              <span
                className={`ml-2 px-2 py-1 rounded ${
                  recentAgreement.buyer_agreed
                    ? "bg-green-200 text-green-800"
                    : "bg-yellow-200 text-yellow-800"
                }`}
              >
                {recentAgreement.buyer_agreed ? "Agreed" : "Pending"}
              </span>
            </p>
            <p>
              <strong className="text-gray-700">Last Updated:</strong>{" "}
              {new Date(recentAgreement.date_created).toLocaleString()}
            </p>

            <button
              onClick={handleShowPopup}
              className="mt-4 w-full px-4 py-2 bg-hover text-white rounded hover:bg-customGreen transition duration-300 ease-in-out"
            >
              {recentAgreement.buyer_agreed
                ? "Agreement Already Reviewed"
                : "Review Agreement"}
            </button>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 italic mb-4">No listings found.</p>
          </div>
        )}
      </div>

      <p className="mt-4 text-sm text-gray-600 text-right">
        Last refreshed: {lastRefresh.toLocaleString()}
      </p>

      {showPopup && recentAgreement && (
        <ContractReviewPopup
          onClose={handleClosePopup}
          onAgreementUpdate={handleAgreementUpdate}
          agreement={recentAgreement}
          userRole={"buyer" as UserRole}
          onSubmit={async (response) => {
            console.log(response);
          }}
        />
      )}
    </div>
  );
};

export default BuyerAgreed;
