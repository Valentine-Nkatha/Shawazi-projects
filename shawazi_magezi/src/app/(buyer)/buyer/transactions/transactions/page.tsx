"use client";
import { formatDate } from "@/app/utils/formatDate";
import Link from "next/link";
import useTransactions from "@/app/hooks/useTransactions";

import ProgressBar from "@/app/components/Progressbar";
import BuyerSidebar from "../../components/buyerSidebar";

const TransactionsDisplay = () => {
  const { transactions, isLoading, error } = useTransactions();

  return (
    <div className="flex flex-col min-h-screen bg-white">
     
      <div className="fixed w-16 xs:w-20 sm:w-[200px] md:w-[250px] lg:w-[300px] h-full">
        <BuyerSidebar />
      </div>

      
      <div className="flex-grow p-1 xs:p-2 sm:p-4 ml-16 xs:ml-20 sm:ml-[200px] md:ml-[250px] lg:ml-[300px]">
        <header className="flex justify-center items-center p-1 xs:p-2 sm:p-4 w-full max-w-5xl">
          <h1 className="custom-header text-center text-base xs:text-lg sm:text-xl md:text-2xl lg:text-4xl font-bold text-primary">
            Transactions
          </h1>
        </header>

        
        <div className="w-full max-w-5xl mx-auto mt-4 sm:mt-8">
          <ProgressBar />
        </div>

        
        <div className="w-full max-w-5xl mt-8 sm:mt-16 mx-auto">
          <div className="flex flex-col xs:flex-row justify-between gap-2 xs:gap-4 mb-2 sm:mb-4">
            <Link
              href="/transactions/history-of-transactions"
              className="w-[180px] xs:w-auto"
            >
              <button className="custom-button bg-hover text-white w-[180px] xs:w-[140px] py-1.5 xs:py-2 px-2 xs:px-3 sm:px-4 text-xs xs:text-sm rounded-lg">
                History Of Transactions
              </button>
            </Link>
            <Link
              href="/buyer/transactions/upload_transactions"
              className="w-[180px] xs:w-auto"
            >
              <button className="custom-button bg-hover text-white w-[180px] xs:w-[140px] py-1.5 xs:py-2 px-2 xs:px-3 sm:px-4 text-xs xs:text-sm rounded-lg">
                Upload Payments
              </button>
            </Link>
            <Link
              href="/buyer/transactions/history-of-transactions"
              className="w-[180px] xs:w-auto"
            >
              <button className="custom-button bg-hover text-white w-[180px] xs:w-[140px] py-1.5 xs:py-2 px-2 xs:px-3 sm:px-4 text-xs xs:text-sm rounded-lg">
                View More
              </button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[300px]">
              <thead>
                <tr className="border-b">
                  <th className="p-1 xs:p-2 text-black text-xs xs:text-sm md:text-base lg:text-lg">
                    Date
                  </th>
                  <th className="p-1 xs:p-2 text-black text-xs xs:text-sm md:text-base lg:text-lg">
                    Status
                  </th>
                  <th className="p-1 xs:p-2 text-black text-xs xs:text-sm md:text-base lg:text-lg">
                    Amount
                  </th>
                  <th className="p-1 xs:p-2 text-black text-xs xs:text-sm md:text-base lg:text-lg">
                    Code
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td className="p-1 xs:p-2" colSpan={4}>
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td className="p-1 xs:p-2" colSpan={4}>
                      Error: {error}
                    </td>
                  </tr>
                ) : transactions.length > 0 ? (
                  transactions
                    .sort(
                      (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                    )
                    .slice(0, 5)
                    .map((transaction, idx) => (
                      <tr key={idx} className="border-b border-primary">
                        <td className="p-1 xs:p-2 text-xs xs:text-sm md:text-base lg:text-lg">
                          {formatDate(transaction.date)}
                        </td>
                        <td className="p-1 xs:p-2">
                          <span
                            className={`w-16 xs:w-20 sm:w-24 h-6 xs:h-8 sm:h-10 flex items-center justify-center px-1 xs:px-2 py-0.5 xs:py-1 rounded-lg text-white text-xs xs:text-sm md:text-base ${
                              transaction.status === "Complete"
                                ? "bg-hover"
                                : transaction.status === "Pending"
                                ? "bg-secondary"
                                : transaction.status === "rejected"
                                ? "bg-red-500"
                                : ""
                            }`}
                          >
                            {transaction.status === "Complete"
                              ? "Complete"
                              : transaction.status}
                          </span>
                        </td>
                        <td className="p-1 xs:p-2 text-xs xs:text-sm md:text-base lg:text-lg">
                          {transaction.amount}
                        </td>
                        <td className="p-1 xs:p-2 text-xs xs:text-sm md:text-base lg:text-lg">
                          {transaction.unique_code}
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td className="p-1 xs:p-2" colSpan={4}>
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsDisplay;




















// "use client";
// import { formatDate } from "@/app/utils/formatDate";
// import Link from "next/link";
// import useTransactions from "@/app/hooks/useTransactions";

// import ProgressBar from "@/app/components/Progressbar";
// import BuyerSidebar from "../../components/buyerSidebar";

// const TransactionsDisplay = () => {
//   const { transactions, isLoading, error } = useTransactions();

//   return (
//     <div className="flex flex-col min-h-screen bg-white ">
//       {/* Sidebar */}
//       <div className="fixed w-16 xs:w-20 sm:w-[200px] md:w-[250px] lg:w-[300px]">
//         <BuyerSidebar />
//       </div>

//       {/* Main Content */}
//       <div className="flex-grow p-1 xs:p-2 sm:p-4 ml-16 xs:ml-20 sm:ml-[200px] md:ml-[250px] lg:ml-[300px]">
//         <header className="flex justify-center items-center p-1 xs:p-2 sm:p-4 w-full max-w-5xl">
//           <h1 className="custom-header text-center text-base xs:text-lg sm:text-xl md:text-2xl lg:text-4xl font-bold text-primary">
//             Transactions
//           </h1>
//         </header>

//         <ProgressBar />

//         <div className="w-full max-w-5xl mt-2 xs:mt-4 sm:mt-10 mx-auto">
//           <div className="flex flex-col xs:flex-row justify-between gap-2 xs:gap-4 mb-2 sm:mb-4">
//             <Link
//               href="/transactions/history-of-transactions"
//               className="w-[180px] xs:w-auto"
//             >
//               <button className="custom-button bg-hover text-white w-[180px] xs:w-[140px] py-1.5 xs:py-2 px-2 xs:px-3 sm:px-4 text-xs xs:text-sm rounded-lg">
//                 History Of Transactions
//               </button>
//             </Link>
//             <Link
//               href="/buyer/transactions/upload_transactions"
//               className="w-[180px] xs:w-auto"
//             >
//               <button className="custom-button bg-hover text-white w-[180px] xs:w-[140px] py-1.5 xs:py-2 px-2 xs:px-3 sm:px-4 text-xs xs:text-sm rounded-lg">
//                 Upload Payments
//               </button>
//             </Link>
//             <Link
//               href="/buyer/transactions/history-of-transactions"
//               className="w-[180px] xs:w-auto"
//             >
//               <button className="custom-button bg-hover text-white w-[180px] xs:w-[140px] py-1.5 xs:py-2 px-2 xs:px-3 sm:px-4 text-xs xs:text-sm rounded-lg">
//                 View More
//               </button>
//             </Link>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse min-w-[300px]">
//               <thead>
//                 <tr className="border-b">
//                   <th className="p-1 xs:p-2 text-black text-xs xs:text-sm md:text-base lg:text-lg">
//                     Date
//                   </th>
//                   <th className="p-1 xs:p-2 text-black text-xs xs:text-sm md:text-base lg:text-lg">
//                     Status
//                   </th>
//                   <th className="p-1 xs:p-2 text-black text-xs xs:text-sm md:text-base lg:text-lg">
//                     Amount
//                   </th>
//                   <th className="p-1 xs:p-2 text-black text-xs xs:text-sm md:text-base lg:text-lg">
//                     Code
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {isLoading ? (
//                   <tr>
//                     <td className="p-1 xs:p-2" colSpan={4}>
//                       Loading...
//                     </td>
//                   </tr>
//                 ) : error ? (
//                   <tr>
//                     <td className="p-1 xs:p-2" colSpan={4}>
//                       Error: {error}
//                     </td>
//                   </tr>
//                 ) : transactions.length > 0 ? (
//                   transactions
//                     .sort(
//                       (a, b) =>
//                         new Date(b.date).getTime() - new Date(a.date).getTime()
//                     )
//                     .slice(0, 5)
//                     .map((transaction, idx) => (
//                       <tr key={idx} className="border-b border-primary">
//                         <td className="p-1 xs:p-2 text-xs xs:text-sm md:text-base lg:text-lg">
//                           {formatDate(transaction.date)}
//                         </td>
//                         <td className="p-1 xs:p-2">
//                           <span
//                             className={`w-16 xs:w-20 sm:w-24 h-6 xs:h-8 sm:h-10 flex items-center justify-center px-1 xs:px-2 py-0.5 xs:py-1 rounded-lg text-white text-xs xs:text-sm md:text-base ${
//                               transaction.status === "Complete"
//                                 ? "bg-hover"
//                                 : transaction.status === "Pending"
//                                 ? "bg-secondary"
//                                 : transaction.status === "rejected"
//                                 ? "bg-red-500"
//                                 : ""
//                             }`}
//                           >
//                             {transaction.status === "Complete"
//                               ? "Complete"
//                               : transaction.status}
//                           </span>
//                         </td>
//                         <td className="p-1 xs:p-2 text-xs xs:text-sm md:text-base lg:text-lg">
//                           {transaction.amount}
//                         </td>
//                         <td className="p-1 xs:p-2 text-xs xs:text-sm md:text-base lg:text-lg">
//                           {transaction.unique_code}
//                         </td>
//                       </tr>
//                     ))
//                 ) : (
//                   <tr>
//                     <td className="p-1 xs:p-2" colSpan={4}>
//                       No transactions found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TransactionsDisplay;
