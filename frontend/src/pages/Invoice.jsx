import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dealAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';
import { LuPrinter, LuArrowLeft, LuDownload } from 'react-icons/lu';

export default function Invoice() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef();

  useEffect(() => {
    dealAPI.getOne(id)
      .then(({ data }) => setDeal(data))
      .catch(() => { toast.error('Deal not found'); navigate('/my-deals'); })
      .finally(() => setLoading(false));
  }, [id]);

  const handlePrint = () => window.print();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Spinner />
    </div>
  );
  if (!deal) return null;

  const invoiceNo = `INV-${deal._id.slice(-8).toUpperCase()}`;
  const date = new Date(deal.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const dueDate = new Date(deal.createdAt);
  dueDate.setDate(dueDate.getDate() + 7);
  const dueDateStr = dueDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <>
      {/* No Navbar - Clean Invoice View */}
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        {/* Action bar — hidden on print */}
        <div className="flex items-center gap-3 mb-8 max-w-4xl mx-auto print:hidden">
          <button onClick={() => navigate('/my-deals')}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition text-sm font-medium">
            <LuArrowLeft size={16} /> Back to Deals
          </button>
          <button onClick={handlePrint}
            className="ml-auto flex items-center gap-2 px-4 py-2 text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition text-sm font-medium">
            <LuPrinter size={16} /> Print Invoice
          </button>
        </div>

        {/* Professional Invoice */}
        <div ref={printRef} className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto print:rounded-none print:shadow-none print:bg-white">
          
          {/* Header Section */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center font-black text-sm">S</div>
                  <div>
                    <h1 className="text-2xl font-black">ScrapMetal <span className="text-orange-400">Pro</span></h1>
                    <p className="text-gray-300 text-xs">Scrap Metal Trading Platform</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-4xl font-black mb-1">INVOICE</p>
                <p className="text-orange-400 font-bold">{invoiceNo}</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8">
            
            {/* Invoice Details Grid */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              {/* Bill From */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Bill From</p>
                <div className="space-y-1">
                  <p className="font-bold text-gray-900 text-sm">ScrapMetal Pro</p>
                  <p className="text-gray-600 text-sm">Scrap Metal Trading Platform</p>
                  <p className="text-gray-600 text-sm">Phone: +91-XXXX-XXXX-XX</p>
                  <p className="text-gray-600 text-sm">Email: contact@scrapmetalpro.com</p>
                </div>
              </div>

              {/* Bill To */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Bill To</p>
                <div className="space-y-1">
                  <p className="font-bold text-gray-900 text-sm">{deal.companyName}</p>
                  <p className="text-gray-600 text-sm">{deal.companyAddress}</p>
                  <p className="text-gray-600 text-sm">Phone: {deal.phone}</p>
                  <p className="text-gray-600 text-sm">Email: {user?.email}</p>
                </div>
              </div>
            </div>

            {/* Invoice Info */}
            <div className="grid grid-cols-4 gap-4 mb-8 p-6 bg-gray-50 rounded-lg">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Invoice No.</p>
                <p className="font-semibold text-gray-900">{invoiceNo}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Invoice Date</p>
                <p className="font-semibold text-gray-900">{date}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Due Date</p>
                <p className="font-semibold text-gray-900">{dueDateStr}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Status</p>
                <p className={`font-semibold text-sm px-3 py-1 rounded-full w-fit ${
                  deal.status === 'Completed' ? 'bg-green-100 text-green-700' :
                  deal.status === 'Accepted' ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {deal.status}
                </p>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 px-4 font-bold text-gray-900 text-sm">Description</th>
                    <th className="text-right py-3 px-4 font-bold text-gray-900 text-sm">Quantity</th>
                    <th className="text-right py-3 px-4 font-bold text-gray-900 text-sm">Unit Price</th>
                    <th className="text-right py-3 px-4 font-bold text-gray-900 text-sm">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="py-4 px-4">
                      <p className="font-semibold text-gray-900">{deal.metalType}</p>
                      <p className="text-gray-500 text-xs">High-quality scrap metal</p>
                    </td>
                    <td className="text-right py-4 px-4 text-gray-700">{deal.weight} {deal.weightUnit}</td>
                    <td className="text-right py-4 px-4 text-gray-700">₹{deal.rate.toLocaleString()}</td>
                    <td className="text-right py-4 px-4 font-semibold text-gray-900">₹{deal.totalAmount.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Totals Section */}
            <div className="flex justify-end mb-8">
              <div className="w-80">
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-700 text-sm border-b border-gray-200 pb-3">
                    <span>Subtotal</span>
                    <span>₹{deal.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 text-sm border-b border-gray-200 pb-3">
                    <span>Tax (0%)</span>
                    <span>₹0</span>
                  </div>
                  <div className="flex justify-between bg-orange-50 p-4 rounded-lg">
                    <span className="font-bold text-gray-900">Total Amount Due</span>
                    <span className="font-bold text-orange-600 text-lg">₹{deal.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Notes</p>
                <p className="text-gray-600 text-sm">Thank you for your business. Payment terms are Net 7 days from invoice date.</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Payment Instructions</p>
                <p className="text-gray-600 text-sm">Please make payment to the account details provided separately. Reference the invoice number with your payment.</p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 mt-8 pt-6 text-center space-y-1">
              <p className="text-gray-500 text-xs">© 2026 ScrapMetal Pro. All rights reserved.</p>
              <p className="text-gray-400 text-xs">This is a computer-generated invoice. No signature required.</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body {
            background: white;
            margin: 0;
            padding: 0;
          }
          .print\\:hidden {
            display: none !important;
          }
          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>
    </>
  );
}
