import React, { useContext, useState, useRef } from "react";
import { AppContext } from "../context/AppContext";
import assets from "../assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import HomeIcon from '@mui/icons-material/Home';
// html-to-image import
import { toPng } from 'html-to-image'; 

function Transfer() {
  const { lookupAccount, executeTransfer, accounts, user } = useContext(AppContext);
  const navigate = useNavigate();

  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showModal, setShowModal] = useState(false); 
  const [receiptData, setReceiptData] = useState(null); 
  
  // New state: Download ke dauran UI badalne ke liye
  const [isDownloading, setIsDownloading] = useState(false);

  const receiptRef = useRef(null);

  const handleVerifyAccount = async () => {
    if (!toAccount || toAccount.length < 12) return;
    if (accounts[0]?._id === toAccount) {
      toast.warning("You cannot transfer funds to your own account!");
      return;
    }
    setIsVerifying(true);
    setReceiverName(""); 
    const result = await lookupAccount(toAccount);
    setIsVerifying(false);

    if (result.success) {
      if (result.data.status !== "ACTIVE") {
        toast.error("This account is currently INACTIVE/SUSPENDED");
      } else {
        setReceiverName(result.data.receiverName);
        toast.success("Recipient Account Verified!");
      }
    } else {
      toast.error(result.message);
    }
  };

 const handleTransferSubmit = async () => {
    setIsSending(true);
    setShowModal(false);
    const result = await executeTransfer(toAccount, amount);
    setIsSending(false);

    if (result.success && result.transaction) {
      toast.success("Transaction Processed Successfully!");
      
      const tx = result.transaction; // Database object

      const dbDate = tx.createdAt ? new Date(tx.createdAt) : new Date();
      const formattedDate = dbDate.toLocaleDateString('en-GB', {
        day: '2-digit', month: 'long', year: 'numeric'
      }).replace(/ /g, '-');
      const formattedTime = dbDate.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
      });

      // Purely database standard values se mapping
      setReceiptData({
        refNo: tx._id, // Actual database Transaction ObjectId
        date: `${formattedDate}  ${formattedTime}`, // Database created time
        amount: tx.amount, // Database standard amount
        fromName: tx.senderName, // Controller passed sender name
        fromId: tx.fromAccount, // Database actual sender account ObjectId
        toName: receiverName || tx.receiverName, // Verified receiver name
        toId: tx.toAccount // Database actual receiver account ObjectId
      });
    } else {
      toast.error(result.message || "Transfer failed");
    }
  };

  // Fixed & Render-Safe Download Function
  const downloadReceiptImage = () => {
    if (!receiptRef.current) return;

    // 1. Pehle state change karein taake buttons hide hon aur logo show ho
    setIsDownloading(true);

    // Thoda sa timeout taake React DOM render complete karle
    setTimeout(() => {
      toPng(receiptRef.current, { 
        quality: 1,
        backgroundColor: '#ffffff',
        width: 380, 
        height: 580, 
        style: {
          transform: 'scale(1)',
          left: '0',
          top: '0',
          margin: '0'
        }
      })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `Receipt-${receiptData?.refNo || "transaction"}.png`;
        link.href = dataUrl;
        link.click();
        
        // 2. Download ke baad wapas buttons wala normal UI dikhao
        setIsDownloading(false);
      })
      .catch((err) => {
        console.error('Download failed:', err);
        toast.error("Receipt download nahi ho saki");
        setIsDownloading(false);
      });
    }, 100);
  };

  if (receiptData) {
    return (
      <div className="receipt">
        
        {/* Main Receipt Node Container */}
        <div 
          ref={receiptRef} 
          className="receipt-container">
          {/* Top Blue Bar */}
          <div className="blue-bar"></div>
          
          <div className="receipt-main-content">
            {/* Green Stamp */}
            <div className="paid-stamp">
            <img src={assets.PaidStamp} alt="Paid Stamp" />
            </div>

            {/* Check Icon */}
            <div className="check-icon">
              <CheckCircleIcon fontSize="inherit" />
            </div>
            
            <div className="text">

            <h2>Transaction Successful</h2>
            <p>Ref#{receiptData.refNo}</p>
            <p>{receiptData.date}</p>
</div>
            
<h1>PKR {Number(receiptData.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h1>
          </div>

          {/* Dashed Line */}
          <div className="dashed-line"></div>

          {/* Details Section */}
          <div className="details-section">
          <div className="acc-details">
            <span>From</span>
            <div className="details">
              <span>{receiptData.fromName}</span>
              <span>{receiptData.fromId}</span>
            </div>
          </div>

          <div className="acc-details">
            <span>To</span>
            <div className="details">
              <span>{receiptData.toName}</span>
              <span>{receiptData.toId}</span>
            </div>
          </div>
        </div>

          {/* Conditional Footer Render */}
          {isDownloading ? (
            /* IMAGE 1 FOOTER: Logo aur Text (Sirf download image file me save hoga) */
            <div className="image-footer">
              <div className="image">
                <span>
              <img src={assets.logo} alt="Excellence Bank" />
                  </span>
              </div>
              <div className="text">
                <p>Excellence Bank</p>
                <p>for Digital Transaction</p>
              </div>
            </div>
          ) : (
            <div className="footer-button" >
              <div onClick={downloadReceiptImage}>
                <DownloadIcon />
                <div>Download</div>
              </div>
              <div>
                <ShareIcon />
                <div>Share</div>
              </div>
              <div onClick={() => navigate("/dashboard")}>
                <HomeIcon />
                <div>Go Home</div>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid Transfer">
      <div className="row">
        <div className="card">
           <div className="col-xl-12">
                    <div className="text">
                      <h3>Transfer</h3>
         <span>Please enter the account no. of payee</span>
                    </div>
            </div>        
            <form onSubmit={(e) => { e.preventDefault(); setShowModal(true); }}>
              {/* Account Section */}
              <div className="col-xl-12">
               <div className="Recipient-account">
                <label>Recipient Account Number</label>
                <div className="Recipient-account-deatails">
                  <input
                    type="text"
                    className="form-control"
                    value={toAccount}
                    onChange={(e) => { setToAccount(e.target.value); setReceiverName(""); }}
                    onBlur={handleVerifyAccount}
                    placeholder="************************"
                  />

                  <button 
                    className="btn" 
                    type="button" 
                    onClick={handleVerifyAccount} 
                    disabled={isVerifying}
                  >
                    {isVerifying ? "Verifying..." : "Verify"}
                  </button>
                </div>
               </div>
              </div>

              {/* Receiver Info */}
              {receiverName && (
                <div className="col-xl-12">
                  <div className="Recipient-details">
                    <div className="Person-icon">
                      <PersonIcon />
                    </div>
                    <div className="text">
                      <small>Recipient  </small>
                      <span>{receiverName}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Amount Section */}
              <div className="col-xl-12">
                <div className="Recipient-amount">
                  <label>Amount to Transfer</label>
                  <div className={`mb-4 ${!receiverName && "opacity-50"}`}>
                    <input
                      type="number"
                      className="form-control"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      disabled={!receiverName}
                      required
                    />
                  </div>

                  <button 
                    className="btn" 
                    type="submit"
                    disabled={isSending || !receiverName || !amount}
                  >
                    {isSending ? "Processing..." : "Transfer Now"}
                  </button>
                </div>
              </div>
            </form>

            {/* CONFIRMATION MODAL */}
            {showModal && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <div className="modal-header"><h5 className="modal-title">Confirm Transfer</h5></div>
                  <div className="modal-body">
                    <p>Are you sure you want to send <strong>PKR {amount}</strong> to <strong>{receiverName}</strong>?</p>
                  </div>
                  <div className="modal-footer">
                    <div className="cancel-btn">
                      <button className="btn " onClick={() => setShowModal(false)}>Cancel</button>
                    </div>
                    <button className="btn" onClick={handleTransferSubmit} disabled={isSending}>
                      {isSending ? "Processing..." : "Confirm"}
                    </button>
                  </div>
                </div>
              </div>
            )}
       </div>
      </div>
    </div>
  );
}

export default Transfer;