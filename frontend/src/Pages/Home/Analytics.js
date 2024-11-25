// import CardBox from "./CardBox";
import { Modal, Container, Row } from "react-bootstrap";
import CircularProgressBar from "../../components/CircularProgressBar";
import LineProgressBar from "../../components/LineProgressBar";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import MovingIcon from "@mui/icons-material/Moving";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import "./home.css";
import React, { useState } from 'react';

import { Line, Bar, Pie } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  PointElement,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Legend
);

const Analytics = ({ transactions, budgets, view }) => {

  // Model State
  const [showModal, setShowModal] = useState(false);
  const [modalChartType, setModalChartType] = useState('');
  const [modalChartData, setModalChartData] = useState(null);
  const [modalChartOptions, setModalChartOptions] = useState({});

    // Function to open modal with specific chart details
    const handleChartClick = (chartType, chartData, chartOptions) => {
      setModalChartType(chartType);
      setModalChartData(chartData);
      setModalChartOptions(chartOptions);
      setShowModal(true);
    };
  
    // Function to close modal
    const handleCloseModal = () => {
      setShowModal(false);
    };

  console.log("INSIDE ANAL");
  console.log(budgets);

  console.log("TRANSACTIONS");
  console.log(transactions);

  const TotalTransactions = transactions.length;
  const totalIncomeTransactions = transactions.filter(
    (item) => item.transactionType === "credit"
  );
  const totalExpenseTransactions = transactions.filter(
    (item) => item.transactionType === "expense"
  );

  let totalIncomePercent =
    (totalIncomeTransactions.length / TotalTransactions) * 100;
  let totalExpensePercent =
    (totalExpenseTransactions.length / TotalTransactions) * 100;

  // console.log(totalIncomePercent, totalExpensePercent);

  const totalTurnOver = transactions.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );
  const totalTurnOverIncome = transactions
    .filter((item) => item.transactionType === "credit")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const totalTurnOverExpense = transactions
    .filter((item) => item.transactionType === "expense")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const TurnOverIncomePercent = (totalTurnOverIncome / totalTurnOver) * 100;
  const TurnOverExpensePercent = (totalTurnOverExpense / totalTurnOver) * 100;

  const categories = [
    "Groceries",
    "Rent",
    "Salary",
    "Tip",
    "Food",
    "Medical",
    "Utilities",
    "Entertainment",
    "Transportation",
    "Other",
  ];

  const colors = {
    Groceries: "#FF6384",
    Rent: "#36A2EB",
    Salary: "#FFCE56",
    Tip: "#4BC0C0",
    Food: "#9966FF",
    Medical: "#FF9F40",
    Utilities: "#8AC926",
    Entertainment: "#6A4C93",
    Transportation: "#1982C4",
    Other: "#F45B69",
  };

  const getMaxBudgetsAndTransactionCum = (transactions, budgets) => {
    // Step 1: Extract unique budget months from the budgets array
    let budgetMonths = [
      ...new Set(
        budgets.map((b) => {
          const date = new Date(b.date);
          return date.toLocaleString("en-US", { month: "long", timeZone: "UTC" }); // Force UTC timezone
        })
      ),
    ];
    
    const monthOrder = [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ];
    
    // Sort months in ascending order
    budgetMonths = budgetMonths.sort(
      (a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)
    );

    // Step 2: Calculate maximum budget for each month
    const maxBudgets = budgetMonths.map((month) => {
      const monthBudgets = budgets.filter((b) => {
        const budgetMonth = new Date(b.date).toLocaleString("default", {
          month: "long",
          timeZone:"UTC"
        });
        return budgetMonth === month;
      });

      const maxBudget = monthBudgets.reduce(
        (max, b) => (b.amount > max ? b.amount : max),
        0
      );
      return maxBudget;
    });

    // Step 3: Filter transactions of type "expense" and group them by month
    const transactionCum = budgetMonths.map((month) => {
      const monthTransactions = transactions.filter((t) => {
        const transactionMonth = new Date(t.date).toLocaleString("default", {
          month: "long",
          timeZone: "UTC", // Ensure consistent month extraction in UTC
        });
        return t.transactionType === "expense" && transactionMonth === month;
      });
    
      const totalAmount = monthTransactions.reduce(
        (sum, t) => sum + t.amount,
        0
      );
      return totalAmount;
    });
    

    // Return months, maxBudgets, and transactionCum arrays
    return { months: budgetMonths, maxBudgets, transactionCum };
  };

  const { months, maxBudgets, transactionCum } = getMaxBudgetsAndTransactionCum(
    transactions,
    budgets
  );

  let monthBudgets = [...months]

  //Budget Usage Percentage Pie Chart
  
  const getPieChartData = (budgetData, transactionData, months) => {
    let monthData = {};
    
    
// Process Budget Data
budgetData.forEach(budget => {
  const month = new Date(budget.date).toLocaleString('default', { 
      month: 'long', 
      timeZone: 'UTC' // Ensure consistent month extraction
  });
  if (months.includes(month)) {
      if (!monthData[month]) {
          monthData[month] = { budget: 0, expenses: 0 };
      }
      monthData[month].budget += budget.amount;
  }
});

// Process Transaction Data
transactionData.forEach(transaction => {
  const month = new Date(transaction.date).toLocaleString('default', { 
      month: 'long', 
      timeZone: 'UTC' // Ensure consistent month extraction
  });
  if (months.includes(month)) {
      if (!monthData[month]) {
          monthData[month] = { budget: 0, expenses: 0 };
      }
      monthData[month].expenses += transaction.amount;
  }
});
console.log("MONTHS", monthData);

    // Prepare Pie Chart Data
    let pieChartData = months.map(month => {
        const used = monthData[month] ? monthData[month].expenses : 0;
        const remaining = monthData[month] ? monthData[month].budget - used : 0;
        return {
            label: month,
            data: [used, remaining],
            backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(75, 192, 192, 0.6)'],
            borderWidth: 1,
        };
    });

    // Filter out any data where remaining is negative
    let negativeChart = pieChartData
    .filter(data => data.data[1] <= 0)
    .map(data => ({
        ...data,
        data: [data.data[0], Math.abs(data.data[1])]
    }));

    pieChartData = pieChartData.filter(data => data.data[1] >= 0);

    // If no data for any month, return a default structure
    return {
      pieChartData: {
        labels: ['Used (Expenses)', 'Remaining Budget'],
        datasets: pieChartData.length > 0 ? pieChartData : [],
      },
      negativeChartData: {
        labels: ['Actual Expenses', 'Overshoot (Delta) from Budget'], // Replace with appropriate labels
        datasets: negativeChart.length > 0 ? negativeChart : [], // Same format as pieChartData
      },
    };
    
};


  const {pieChartData,negativeChartData} = getPieChartData(budgets, totalExpenseTransactions, monthBudgets);
  
  const data = {
    labels: months,
    datasets: [
      {
        label: "Cumulative Budget",
        data: maxBudgets,
        fill: true,
        backgroundColor: "rgba(75, 192, 192, 0.2)", // Light green
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.4,
      },
      {
        label: "Cumulative Expenses",
        data: transactionCum,
        fill: true,
        backgroundColor: "rgba(255, 99, 132, 0.2)", // Light red
        borderColor: "rgba(255, 99, 132, 1)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
        text: "Cumulative Budget vs. Expenses",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Amount ($)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Month",
        },
      },
    },
  };



  // Viz - 3

  const getCategoryChartData = (budgetData, transactionData) => {
    let categoryData = {};

    // Process Budget Data
    budgetData.forEach(budget => {
      if (!categoryData[budget.category]) {
        categoryData[budget.category] = { budget: 0, expenses: 0 };
      }
      categoryData[budget.category].budget += budget.amount;
    });

    // Process Transaction Data
    transactionData.forEach(transaction => {
      if (!categoryData[transaction.category]) {
        categoryData[transaction.category] = { budget: 0, expenses: 0 };
      }
      categoryData[transaction.category].expenses += transaction.amount;
    });

    // Prepare the datasets for the chart
    const categories = Object.keys(categoryData);
    const budgetValues = categories.map(category => categoryData[category].budget);
    const expenseValues = categories.map(category => categoryData[category].expenses);

    // Return the data structure for the chart
    return {
      labels: categories,
      datasets: [
        {
          label: 'Budget',
          data: budgetValues,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: 'Expenses',
          data: expenseValues,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        }
      ]
    };
  };


  const data2 = getCategoryChartData(budgets, totalExpenseTransactions);

  const options2 = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return `${tooltipItem.dataset.label}: $${tooltipItem.raw}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
      }
    }
  }
  



  return (
    <>
     <Container className="mt-5">
    {view ? (
      <Row>
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card h-100 custom-card">
            <div className="card-header bg-dark text-white custom-card-header">
              <span className="font-weight-bold">Total Transactions:</span> {TotalTransactions}
            </div>
            <div className="card-body">
              <h5 className="card-title text-success">
                Income: <ArrowDropUpIcon /> {totalIncomeTransactions.length}
              </h5>
              <h5 className="card-title text-danger">
                Expense: <ArrowDropDownIcon /> {totalExpenseTransactions.length}
              </h5>
              <div className="d-flex justify-content-center mt-3">
                <CircularProgressBar percentage={totalIncomePercent.toFixed(0)} color="green" />
              </div>
              <div className="d-flex justify-content-center mt-4 mb-2">
                <CircularProgressBar percentage={totalExpensePercent.toFixed(0)} color="red" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card h-100 custom-card">
            <div className="card-header bg-dark text-white custom-card-header">
              <span className="font-weight-bold">Total TurnOver:</span> {totalTurnOver}
            </div>
            <div className="card-body">
              <h5 className="card-title text-success">
                Income: <ArrowDropUpIcon /> <AttachMoneyIcon /> {totalTurnOverIncome}{" "}
              </h5>
              <h5 className="card-title text-danger">
                Expense: <ArrowDropDownIcon /> <AttachMoneyIcon /> {totalTurnOverExpense}{" "}
              </h5>
              <div className="d-flex justify-content-center mt-3">
                <CircularProgressBar percentage={TurnOverIncomePercent.toFixed(0)} color="green" />
              </div>
              <div className="d-flex justify-content-center mt-4 mb-4">
                <CircularProgressBar percentage={TurnOverExpensePercent.toFixed(0)} color="red" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card h-100 custom-card">
            <div className="card-header bg-dark text-white custom-card-header">
              <span className="font-weight-bold">Categorywise Income</span>
            </div>
            <div className="card-body">
              {categories.map((category) => {
                const income = transactions
                  .filter((transaction) => transaction.transactionType === "credit" && transaction.category === category)
                  .reduce((acc, transaction) => acc + transaction.amount, 0);
                const incomePercent = (income / totalTurnOver) * 100;

                return income > 0 ? (
                  <LineProgressBar
                    key={category}
                    label={category}
                    percentage={incomePercent.toFixed(0)}
                    lineColor={colors[category]}
                  />
                ) : null;
              })}
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card h-100 custom-card">
            <div className="card-header bg-dark text-white custom-card-header">
              <span className="font-weight-bold">Categorywise Expense</span>
            </div>
            <div className="card-body">
              {categories.map((category) => {
                const expenses = transactions
                  .filter((transaction) => transaction.transactionType === "expense" && transaction.category === category)
                  .reduce((acc, transaction) => acc + transaction.amount, 0);
                const expensePercent = (expenses / totalTurnOver) * 100;

                return expenses > 0 ? (
                  <LineProgressBar
                    key={category}
                    label={category}
                    percentage={expensePercent.toFixed(0)}
                    lineColor={colors[category]}
                  />
                ) : null;
              })}
            </div>
          </div>
        </div>
      </Row>
    ) : (
      <>
        <Row className="filterRow">
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="card h-100 custom-card" onClick={() => handleChartClick('pie', pieChartData, {})}>
            <div className="card-header bg-dark text-white custom-card-header">
                <span className="font-weight-bold">Monthly Budget Performance</span>
              </div>
              <div className="card-body">
                <Pie data={pieChartData} />
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 mb-4">
            <div className="card h-100 custom-card" onClick={() => handleChartClick('pie', negativeChartData, {})}>
            <div className="card-header bg-dark text-white custom-card-header">
                <span className="font-weight-bold">Over Expenditure</span>
              </div>
              <div className="card-body">
                <Pie data={negativeChartData} />
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 mb-4">
            <div className="card h-100 custom-card" onClick={() => handleChartClick('line', data, options)}>
              <div className="card-header bg-dark text-white custom-card-header">
                <span className="font-weight-bold">Cumulative Budget vs Expenses</span>
              </div>
              <div className="card-body">
                {data && Array.isArray(data.datasets) && data.datasets.length > 0 ? (
                  <Line data={data} options={options} />
                ) : (
                  <div className="text-white">Not enough proper data to display</div>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-12 mb-4">
            <div className="card h-100 custom-card" onClick={() => handleChartClick('bar', data2, options2)}>
              <div className="card-header bg-dark text-white custom-card-header">
                <span className="font-weight-bold">Budget vs Expenses by Category</span>
              </div>
              <div className="card-body">
                <Bar data={data2} options={options2} />
              </div>
            </div>
          </div>
        </Row>

        <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>Enlarged Chart View</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modalChartType === 'pie' && <Pie data={modalChartData} options={modalChartOptions} />}
            {modalChartType === 'line' && <Line data={modalChartData} options={modalChartOptions} />}
            {modalChartType === 'bar' && <Bar data={modalChartData} options={modalChartOptions} />}
          </Modal.Body>
        </Modal>
      </>
    )}
  </Container>

    </>
  );
};

export default Analytics;
