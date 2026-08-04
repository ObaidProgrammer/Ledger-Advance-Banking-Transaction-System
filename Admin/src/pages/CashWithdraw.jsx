import React from 'react';
import { useContext, useState } from "react";
import { AdminContext } from "../context/AdminContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CashWithdraw = () => {

const {
  verifyAccount, cashWithdraw, withdrawLoading,
} = useContext(AdminContext);
const [formData, setFormData] = useState({ fromAccount: "", amount: "", });
const navigate = useNavigate();

const [receiver, setReceiver] = useState(null);
const [verifyLoading, setVerifyLoading] = useState(false);
const [showConfirmModal, setShowConfirmModal] = useState(false);


const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });

};
const handleVerifyAccount = async () => {

  if (!formData.fromAccount) {
    return toast.error("Enter Account ID");
  }

  setVerifyLoading(true);

  const result = await verifyAccount(formData.fromAccount);

  if (result?.success) {

    setReceiver(result.account);

    toast.success("Account verified successfully");

  } else {

    setReceiver(null);

  }

  setVerifyLoading(false);

};
const handleWithdraw = async () => {

  if (!formData.amount) {
    return toast.error("Enter Amount");
  }

  if (Number(formData.amount) <= 0) {
    return toast.error("Invalid Amount");
  }

  await handleConfirmWithdraw();

};
const handleConfirmWithdraw = async () => {
  const result = await cashWithdraw({
  fromAccount: formData.fromAccount,
  amount: Number(formData.amount),
  idempotencyKey: crypto.randomUUID(),
});
if (result.success) {

    setShowConfirmModal(false);

    navigate(
`/cash-withdraw/receipt/${result.transaction._id}`
)

}
};
return (
<div className="container-fluid cash-flow">
        <div className="row">
        <div className="card">
<div className="text">
<h3>Cash Withdraw</h3>
         <span>Please enter the account no. of customer</span>
</div>
<form>
  <div className="col-xl-12">
<div className="Recipient-account">
<label>Account ID</label>
<div className="Recipient-account-details">
<input className="form-control" name="fromAccount" 
type="text"
  placeholder="************************"
value={formData.fromAccount}onChange={handleChange}/>
<button className="btn" type="button"
 onClick={handleVerifyAccount}>
  { verifyLoading ? "Verifying..." : "Verify" }
</button>
</div>
</div>
</div>
{
receiver && (
<div className='col-xl-12'>
<div className="Recipient-details">
                    <div className="text">
<h5>Customer Details</h5>
<div className="verify-details"><small>Name:      </small><span>{receiver.name}</span></div>
<div className="verify-details"><small>Email:     </small><span>{receiver.email}</span></div>
<div className="verify-details"><small>Account:   </small><span> {receiver.accountId}</span></div>
<div className="verify-details"><small>Status:    </small><span> {receiver.status}</span></div>
<div className="verify-details"><small>Balance:   </small><span> Rs. {receiver.balance}</span></div>
<div className="verify-details"><small>Currency:  </small><span> {receiver.currency}</span></div>
 </div>
 </div>
 </div>
)
}
<div className="col-xl-12">
<div className="Recipient-amount">
<label className="form-label">Amount</label>
<input
  type="number"
  className="form-control"
  name="amount"
  value={formData.amount}
  onChange={handleChange}
  placeholder="Enter Amount"
  disabled={!receiver}
  placeholder="0.00"
/>
<button className="btn" type="button"
  onClick={handleWithdraw} disabled={!receiver || withdrawLoading}>  
  {withdrawLoading ? "Withdrawing..." : "Cash Withdraw"}
</button>
</div>
</div>
</form>
</div>

</div>
</div>



);
}

export default CashWithdraw
