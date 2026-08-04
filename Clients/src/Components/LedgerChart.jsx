import React, { useContext, useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { AppContext } from '../context/AppContext';
import Loader from "../Components/Loader"

const LedgerChart = () => {
  const { dashboard } = useContext(AppContext);
  
  const [isDomReady, setIsDomReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDomReady(true);
    }, 100); 
    return () => clearTimeout(timer);
  }, []);

  if (!dashboard || !dashboard.latestTransactions || !dashboard.myAccounts || !isDomReady) {
    return (
      <div>
        <div><Loader/></div>

      </div>
    );
  }

  const transactions = dashboard.latestTransactions;
  const myAccountIds = dashboard.myAccounts;

  // Data Processing Logic
  const processDateWiseData = () => {
    const dailyData = {};

    if (transactions.length > 0 && myAccountIds.length > 0) {
      const sortedTransactions = [...transactions].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );

      sortedTransactions.forEach((tx) => {
        const isCompleted = !tx.status || tx.status === "COMPLETED" || tx.status === "success";

        if (isCompleted) {
          const dateObj = new Date(tx.createdAt);
          const formattedDate = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

          const fromAccId = tx.fromAccount?._id || tx.fromAccount;
          const toAccId = tx.toAccount?._id || tx.toAccount;

          const isSender = myAccountIds.includes(fromAccId?.toString());
          const isReceiver = myAccountIds.includes(toAccId?.toString());

          if (isSender || isReceiver) {
            if (!dailyData[formattedDate]) {
              dailyData[formattedDate] = { debit: 0, credit: 0 };
            }

            if (isSender) {
              dailyData[formattedDate].debit += Number(tx.amount);
            }
            if (isReceiver) {
              dailyData[formattedDate].credit += Number(tx.amount);
            }
          }
        }
      });
    }

    const dates = Object.keys(dailyData);
    const debits = dates.map(d => dailyData[d].debit);
    const credits = dates.map(d => dailyData[d].credit);

    return { dates, debits, credits };
  };

  const { dates, debits, credits } = processDateWiseData();
  const hasData = dates.length > 0;
  
  const finalDates = hasData ? dates : ["No Data"];
  const finalDebits = hasData ? debits : [0];
  const finalCredits = hasData ? credits : [0];

  // Unique key to prevent instance clashing
  const uniqueChartToken = hasData ? dates.join('-') : 'empty-ledger-state';

  const chartConfig = {
    series: [
      { name: 'Money Sent (Debit)', data: finalDebits },
      { name: 'Money Received (Credit)', data: finalCredits }
    ],
    options: {
      chart: {
        id: 'ledger-spline-wave-v2',
        type: 'area',
        toolbar: { show: false },
        zoom: { enabled: false }
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 3 },
      colors: ["#198754", "#6F42C1"],
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.35,
          opacityTo: 0.05,
          stops: [0, 90, 100]
        }
      },
      xaxis: {
        categories: finalDates,
        labels: { style: { colors: '#6c757d', fontFamily: 'system-ui' } }
      },
      yaxis: {
        labels: {
          formatter: (val) => "PKR " + Math.round(val).toLocaleString(),
          style: { colors: '#6c757d', fontFamily: 'system-ui' }
        }
      },
      tooltip: {
        y: { formatter: (val) => "PKR " + Math.round(val).toLocaleString() }
      },
      legend: { position: 'top', horizontalAlign: 'right', fontFamily: 'system-ui' }
    }
  };

  return (
    <div className="card shadow-sm p-4 mb-4" style={{ borderRadius: "12px", backgroundColor: "#fff", border: "none" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h6 className="fw-bold m-0" style={{ color: "#333", fontSize: "16px" }}>
            Personal Timeline Analytics
          </h6>
          <small className="text-muted" style={{ fontSize: "12px" }}>Date-wise live spline wave configuration</small>
        </div>
        {!hasData && (
          <span className="badge bg-secondary" style={{ fontSize: "10px" }}>
            No Activity Found
          </span>
        )}
      </div>

      <div key={uniqueChartToken} style={{ width: '100%', overflow: 'hidden' }}>
        <Chart 
          options={chartConfig.options} 
          series={chartConfig.series} 
          type="area" 
          height="300" 
        />
      </div>
    </div>
  );
};

export default LedgerChart;