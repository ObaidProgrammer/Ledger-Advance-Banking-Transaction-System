import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import Loader from "../components/common/Loader";
import {formatTransactionType, formatDateTimelong} from "../utils/format";

const CashBookDetails = () => {

  const { cashBookId } = useParams();

  const navigate = useNavigate();

  const {

    cashBookDetails,

    loadCashBookDetails,

  } = useContext(AdminContext);

  useEffect(() => {

    loadCashBookDetails(cashBookId);

  }, [cashBookId]);

  if (!cashBookDetails) {

    return <Loader/>;

  }

  return (

    <div className="container-fluid">

      <div className="mainDetails">
          <h2>Cash Book Details</h2>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th width="35%">Entry ID</th>
                <td>{cashBookDetails._id}</td>
              </tr>
              <tr>
                <th>Amount</th>
                <td>
                  Rs.{" "}
                  {Number(cashBookDetails.amount).toLocaleString("en-PK")}
                </td>
              </tr>
              <tr>
                <th>Created At</th>
                <td>
                  {formatDateTimelong(
                    cashBookDetails.createdAt)}
                </td>

              </tr>

              <tr>
                <th width="35%">Customer Name</th>
                <td>{cashBookDetails.account.user.name}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td>{cashBookDetails.account.user.email}</td>
              </tr>
              <tr>
                <th>Account ID</th>
                <td>{cashBookDetails.account._id}</td>
              </tr>
               <tr>
                <th width="35%">Name</th>
                <td>{cashBookDetails.cashier.name}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td>{cashBookDetails.cashier.email}</td>
              </tr>
              <tr>
                <th>Role</th>
                <td>{formatTransactionType( cashBookDetails.cashier.role)}</td>
              </tr>
              <tr>
                <th>User ID</th>
                <td>{cashBookDetails.cashier._id}</td>
              </tr>
               <tr>
                <th width="35%">Transaction ID</th>
                <td>{cashBookDetails.transaction._id}</td>
              </tr>
              <tr>
                <th>Transaction Type</th>
                <td>{formatTransactionType(cashBookDetails.transaction.transactionType)}</td>
              </tr>
              <tr>
                <th>Status</th>
                <td>{cashBookDetails.transaction.status}</td>
              </tr>
            </tbody>
          </table>
                   

        </div>

      </div>

  );

};

export default CashBookDetails;