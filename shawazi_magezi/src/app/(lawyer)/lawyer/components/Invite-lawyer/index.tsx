import React, { useState } from "react";

interface InviteLawyerModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    firstName: string,
    lastName: string,
    invitedBy: string,
    phoneNumber: string
  ) => Promise<void>;
}

const InviteLawyerModal: React.FC<InviteLawyerModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [invitedBy, setInvitedBy] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(firstName, lastName, invitedBy, phoneNumber);
      resetForm();
      onClose();
    } catch (error) {
      console.error("Failed to send invitation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setInvitedBy("");
    setPhoneNumber("");
  };

  return (
    open && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white p-4 rounded-xl shadow-xl max-w-[80%] sm:max-w-[400px] md:max-w-[450px] lg:max-w-[500px] w-full sm:p-6 transition-all transform scale-105 hover:scale-100">
          <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
            Invite a Lawyer
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col">
                <label htmlFor="firstName" className="text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="lastName" className="text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="invitedBy" className="text-gray-700 mb-2">
                  Invited By
                </label>
                <input
                  type="text"
                  id="invitedBy"
                  value={invitedBy}
                  onChange={(e) => setInvitedBy(e.target.value)}
                  required
                  className="p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="phoneNumber" className="text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 border-2 border-primary text-primary rounded-lg hover:bg-gray-200 transition duration-200 ease-in-out w-full sm:w-auto mb-4 sm:mb-0"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:border-primary hover:border-2 hover:bg-white hover:text-primary transition duration-200 ease-in-out w-full sm:w-auto"
              >
                {isSubmitting ? "Sending..." : "Send Invitation"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default InviteLawyerModal;
