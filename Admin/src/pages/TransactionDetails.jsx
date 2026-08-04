import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as htmlToImage from "html-to-image";
import { AdminContext } from "../context/AdminContext";
import { formatTransactionType, formatDateTimelong } from "../utils/format";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Loader from "../components/common/Loader";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import assets from "../assets/assets";

const TransactionDetails = () => {

  const { transactionId } = useParams();

  const navigate = useNavigate();
const receiptRef = useRef(null);
const [isDownloading, setIsDownloading] = useState(false);
  const {
    transactionDetails,
    loadTransactionDetails,
  } = useContext(AdminContext);

  useEffect(() => {
    loadTransactionDetails(transactionId);
  }, [transactionId]);

  if (!transactionDetails) {
    return <Loader/>
  }
  const downloadReceipt = async () => {
  if (!receiptRef.current) return;
  setIsDownloading(true);
  setTimeout(async () => {
    try {
      const dataUrl = await htmlToImage.toPng(receiptRef.current,{
        cacheBust:true,
        pixelRatio:2,
        backgroundColor:"#ffffff",
      });
      const link=document.createElement("a");
      link.download=`Transaction-${transactionDetails._id}.png`;
      link.href=dataUrl;
      link.click();
      setIsDownloading(false);
    } catch(err){
      console.log(err);
      setIsDownloading(false);
    }
  },100);
};
const printReceipt=()=>{
    window.print();
};
  const account =
  transactionDetails.toAccount ||
  transactionDetails.fromAccount;

  return (

    <div className="container-fluid transaction-Details">
      <div className="text">
          <h3>Transaction Details</h3>
      </div>
<div className="transac-details">
          <div className="receipt"
          ref={receiptRef}
    id="receipt">

<div className="receipt-container">

  <div className="blue-bar"></div>

  <div className="receipt-main-content">

    <div className="stamp">
      <img src={assets.stamp} alt="Stamp" />
    </div>

    <div className="check-icon">
      <CheckCircleIcon fontSize="inherit" />
    </div>

   <div className="text">
      <h2>{formatTransactionType(transactionDetails.transactionType)} Slip</h2>
      <p>Ref#{transactionDetails._id}</p>
      <p>{formatDateTimelong(transactionDetails.createdAt)}</p>
    </div>
        <div className="customer-section">

      <div className="detail-row">
        <span>Name:</span>
        <span>{account?.user?.name}</span>
      </div>

      <div className="detail-row">
        <span>Email:</span>
        <span>{account?.user?.email}</span>
      </div>

      <div className="detail-row">
        <span>Acc. No:</span>
        <span>{account?._id}</span>
      </div>

    </div>

    <div className="dashed-line"></div>

     <h1>
      PKR{" "}
      {Number(transactionDetails.amount).toLocaleString("en-PK")}
    </h1>
    <div className="dashed-line"></div>

    <div className="performed-section">

      <h3>Performed by</h3>

      <div className="detail-row">
        <span>Name:</span>
        <span>{transactionDetails.performedBy?.name}</span>
      </div>

      <div className="detail-row">
        <span>Email:</span>
        <span>{transactionDetails.performedBy?.email}</span>
      </div>

      <div className="detail-row">
        <span>Role:</span>
        <span>
{transactionDetails.performedBy?.role} 
        </span>
      </div>

      <div className="detail-row">
        <span>ID:</span>
        <span>{transactionDetails.performedBy?._id}</span>
      </div>

    </div>


    </div>
    {
isDownloading ? (

<div className="image-footer">

    <div className="image">
        <img
            src={assets.logo}
            alt="Logo"
        />
    </div>

    <div className="text">
        <p>Excellence Bank</p>
        <p>for Digital Transaction</p>
    </div>

</div>

) : (

<div className="footer-button">

    <div onClick={downloadReceipt}>
        <DownloadIcon/>
        <span>Download</span>
    </div>

    <div onClick={printReceipt}>
        <PrintIcon/>
        <span>Print</span>
    </div>

    <div onClick={()=>navigate(-1)}>
        <ArrowBackIcon/>
        <span>Back</span>
    </div>

</div>

)
}          
    </div>          

        </div>
</div>

      </div>


  );

};

export default TransactionDetails;