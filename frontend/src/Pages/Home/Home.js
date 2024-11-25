import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Form, Container } from "react-bootstrap";
// import loading from "../../assets/loader.gif";
import "./home.css";
import { addTransaction, getTransactions } from "../../utils/ApiRequest";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../../components/Spinner";
import TableData from "./TableData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import BarChartIcon from "@mui/icons-material/BarChart";
import Analytics from "./Analytics";
import { convertToCSV, downloadCSV, exportToPDF } from "../../utils/export";
import Budget from "./Budget";

const Home = () => {
  const navigate = useNavigate();

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };
  const [cUser, setcUser] = useState();
  const [show, setShow] = useState(false);
  //Budget Model State

  const [budgetData, setBudgetData] = useState([]);

  const [budgetShow, setBudgetShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [frequency, setFrequency] = useState("7");
  const [type, setType] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [view, setView] = useState("table");
  const [category, setCategory] = useState(null);

  const [toggleBudget, setToggle] = useState(false);

  //Budget Show or Hide
  const handleBudgetClose = () => setBudgetShow(false);
  const handleBudgetShow = () => setBudgetShow(true);


  const [newInput, setNewInput] = useState(""); // New state for the input

  const handleNewInputChange = (e) => {
    setValues({
      ...values,
      newInput: e.target.value, // Update the new input field value in the state
    });
  };
  
  

  const handleStartChange = (date) => {
    setStartDate(date);
  };

  const handleEndChange = (date) => {
    setEndDate(date);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const avatarFunc = async () => {
      if (localStorage.getItem("user")) {
        const user = JSON.parse(localStorage.getItem("user"));
        console.log(user);

        if (user.isAvatarImageSet === false || user.avatarImage === "") {
          navigate("/setAvatar");
        }
        setcUser(user);
        setRefresh(true);
      } else {
        navigate("/login");
      }
    };

    avatarFunc();
  }, [navigate]);

  const [values, setValues] = useState({
    title: "",
    amount: "",
    description: "",
    category: "",
    date: "",
    transactionType: "",
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleChangeFrequency = (e) => {
    setFrequency(e.target.value);
  };

  const handleSetType = (e) => {
    setType(e.target.value);
  };

  const handleSetCategory = (e) => {
    setCategory(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, amount, description, category, date, transactionType } =
      values;

    if (
      !title ||
      !amount ||
      !description ||
      !category ||
      !date ||
      !transactionType
    ) {
      toast.error("Please enter all the fields", toastOptions);
    }
    setLoading(true);

    const { data } = await axios.post(addTransaction, {
      title: title,
      amount: amount,
      description: description,
      category: category,
      date: date,
      transactionType: transactionType,
      userId: cUser._id,
    });

    if (data.success === true) {
      toast.success(data.message, toastOptions);
      handleClose();
      setRefresh(!refresh);
    } else {
      toast.error(data.message, toastOptions);
    }

    setLoading(false);
  };

  const handleReset = () => {
    setType("all");
    setStartDate(null);
    setEndDate(null);
    setFrequency("7");
  };

  const handleExport = () => {
    const formattedTransactions = transactions.map((transaction) => {
      return {
        ...transaction,
        date: moment(transaction.date).format("MMM D, YYYY"),
      };
    });

    const csvData = convertToCSV(formattedTransactions);
    downloadCSV(csvData);
  };

  const handleExportPDF = () => {
    const formattedTransactions = transactions.map((transaction) => {
      return {
        ...transaction,
        date: moment(transaction.date).format("MMM D, YYYY"),
      };
    });

    exportToPDF(formattedTransactions);
  };

  useEffect(() => {
    const fetchAllTransactions = async () => {
      try {
        setLoading(true);
        console.log("fetchAllTransactions");
        console.log(cUser._id, frequency, startDate, endDate, type, category);
        const { data } = await axios.post(getTransactions, {
          userId: cUser._id,
          frequency: frequency,
          startDate: startDate,
          endDate: endDate,
          type: type,
          category: category,
        });
        console.log(data);

        setTransactions(data.transactions);

        setLoading(false);
      } catch (err) {
        console.log(err, "error");
        // toast.error("Error please Try again...", toastOptions);
        setLoading(false);
      }
    };

    fetchAllTransactions();
  }, [refresh, frequency, endDate, type, startDate, category]);

  const handleTableClick = (e) => {
    setView("table");
  };

  const handleChartClick = (e) => {
    setView("chart");
  };

  const handleNewSubmit = async (e) => {
    e.preventDefault();
    const { newInput } = values;
  
    if (!newInput) {
      toast.error("Please enter a value", toastOptions);
      return;
    }
  
    // Logic to handle submission of the new input
    // Example: posting to an API or updating the state
    console.log("New Input Submitted:", newInput);
  
    // Fetch the transactions based on the new input or other parameters
    try {
      setLoading(true);
  
      const { data } = await axios.post(getTransactions, {
        userId: cUser._id,
        frequency: frequency,
        startDate: startDate,
        endDate: endDate,
        type: type,
        category: category,
        newInput: newInput, // You can use the newInput in the request here
      });
  
      setTransactions(data.transactions);
  
      // Reset the input after submission
      setValues({ ...values, newInput: "" });
  
      toast.success("Input Submitted and Transactions Fetched Successfully!", toastOptions);
    } catch (err) {
      setLoading(false);
      toast.error("Failed to fetch transactions", toastOptions);
    }
  
    setLoading(false);
  };
  
  

  return (
    <>
      <Header />

      {loading ? (
        <>
          <Spinner />
        </>
      ) : (
        <>
          <Container
            style={{ position: "relative", zIndex: "2 !important" }}
            className="mt-3"
          >
            <div className="filterRow">
              <div className="text-white">
                <Form.Group
                  className="mb-3 custom-form-group"
                  controlId="formSelectFrequency"
                >
                  <Form.Label className="custom-form-label">
                    Select Frequency
                  </Form.Label>
                  <Form.Select
                    className="custom-select"
                    name="frequency"
                    value={frequency}
                    onChange={handleChangeFrequency}
                  >
                    <option value="7">Last Week</option>
                    <option value="30">Last Month</option>
                    <option value="365">Last Year</option>
                    <option value="custom">Custom</option>
                  </Form.Select>
                </Form.Group>
              </div>
            
              <div className="text-white">
              <Form.Group className="mb-3 custom-form-group" controlId="formNewInput">
                <Form.Label className="custom-form-label">Filter Transaction By Title</Form.Label>
                <Form.Control
                  name="newInput"
                  type="text"
                  className="custom-select text-white"
                  placeholder="Search"
                  value={values.newInput}
                  onChange={handleNewInputChange}
                />
              </Form.Group>
              
              <Button variant="primary" onClick={handleNewSubmit}>
                Submit
              </Button>
              </div>
              <div className="text-white type">
                <Form.Group
                  className="mb-3 custom-form-group"
                  controlId="formSelectType"
                >
                  <Form.Label className="custom-form-label">Type</Form.Label>
                  <Form.Select
                    className="custom-select"
                    name="type"
                    value={type}
                    onChange={handleSetType}
                  >
                    <option value="all">All</option>
                    <option value="expense">Expense</option>
                    <option value="credit">Income</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="text-white type">
                <Form.Group
                  className="mb-3 custom-form-group"
                  controlId="formSelectCategory"
                >
                  <Form.Label className="custom-form-label">
                    Category
                  </Form.Label>
                  <Form.Select
                    className="custom-select"
                    name="type"
                    value={category}
                    onChange={handleSetCategory}
                  >
                    <option value="all">All</option>
                    <option value="Groceries">Groceries</option>
                    <option value="Rent">Rent</option>
                    <option value="Salary">Salary</option>
                    <option value="Tip">Tip</option>
                    <option value="Food">Food</option>
                    <option value="Medical">Medical</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="text-white iconBtnBox">
                <FormatListBulletedIcon
                  sx={{ cursor: "pointer" }}
                  onClick={handleTableClick}
                  className={`${
                    view === "table" ? "iconActive" : "iconDeactive"
                  }`}
                />
                <BarChartIcon
                  sx={{ cursor: "pointer" }}
                  onClick={handleChartClick}
                  className={`${
                    view === "chart" ? "iconActive" : "iconDeactive"
                  }`}
                />
              </div>
              <div>
                <Button
                  onClick={handleShow}
                  className="addNew prominent-btn"
                  variant="success"
                >
                  Add Transaction
                </Button>
                <Button onClick={handleShow} className="mobileBtn">
                  +
                </Button>
                <Modal show={show} onHide={handleClose} centered>
                  <Modal.Header closeButton>
                    <Modal.Title>Add Transaction Details</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                          name="title"
                          type="text"
                          placeholder="Enter Transaction Name"
                          value={values.name}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formAmount">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control
                          name="amount"
                          type="number"
                          placeholder="Enter your Amount"
                          value={values.amount}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formSelect">
                        <Form.Label>Category</Form.Label>
                        <Form.Select
                          name="category"
                          value={values.category}
                          onChange={handleChange}
                        >
                          <option value="">Choose...</option>
                          <option value="Groceries">Groceries</option>
                          <option value="Rent">Rent</option>
                          <option value="Salary">Salary</option>
                          <option value="Tip">Tip</option>
                          <option value="Food">Food</option>
                          <option value="Medical">Medical</option>
                          <option value="Utilities">Utilities</option>
                          <option value="Entertainment">Entertainment</option>
                          <option value="Transportation">Transportation</option>
                          <option value="Other">Other</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          type="text"
                          name="description"
                          placeholder="Enter Description"
                          value={values.description}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formSelect1">
                        <Form.Label>Transaction Type</Form.Label>
                        <Form.Select
                          name="transactionType"
                          value={values.transactionType}
                          onChange={handleChange}
                        >
                          <option value="">Choose...</option>
                          <option value="credit">Credit</option>
                          <option value="expense">Expense</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formDate">
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="date"
                          value={values.date}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      {/* Add more form inputs as needed */}
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                      Submit
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
            <br style={{ color: "white" }}></br>

            {frequency === "custom" ? (
              <>
                <div className="date">
                  <div className="form-group">
                    <label htmlFor="startDate" className="text-white">
                      Start Date:
                    </label>
                    <div>
                      <DatePicker
                        selected={startDate}
                        onChange={handleStartChange}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="endDate" className="text-white">
                      End Date:
                    </label>
                    <div>
                      <DatePicker
                        selected={endDate}
                        onChange={handleEndChange}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}

            <div className="buttonContainer">
              <div className="containerBtn">
                <Button
                  variant="secondary"
                  className="custom-gray-button"
                  onClick={handleReset}
                >
                  Reset Filter
                </Button>
              </div>

              <div className="containerBtn">
                <Button
                  variant="secondary"
                  className="custom-gray-button"
                  onClick={handleExport}
                >
                  Export as Excel
                </Button>
              </div>

              <div className="containerBtn">
                <Button
                  variant="secondary"
                  className="custom-gray-button"
                  onClick={handleExportPDF}
                >
                  Export PDF
                </Button>
              </div>

              <div className="containerBtn">
                <Button
                  onClick={handleBudgetShow}
                  className="addNew prominent-btn"
                  variant="success"
                >
                  Add Budget
                </Button>
              </div>
              <Budget
                show={budgetShow}
                onHide={handleBudgetClose}
                cUser={cUser}
                onDataSend={(data) => {
                  console.log("INSIDE HOME", data);
                  setBudgetData(data);
                }}
              />
            </div>

            <div className="containerBtn">
              <Button
                variant="primary"
                onClick={() => setToggle(!toggleBudget)}
              >
                {toggleBudget ? "Show Budgets" : "Show Transactions"}
              </Button>
            </div>

            {view === "table" ? (
              <>
                <TableData
                  data={transactions}
                  user={cUser}
                  view={toggleBudget}
                  budgets={budgetData}
                />
              </>
            ) : (
              <>
                <Analytics
                  transactions={transactions}
                  user={cUser}
                  view={toggleBudget}
                  budgets={budgetData}
                />
              </>
            )}
            <ToastContainer />
          </Container>
        </>
      )}
    </>
  );
};

export default Home;
