import React, {useEffect,useState} from 'react'
import { useNavigate } from "react-router-dom";
import { Button, Modal, Form, Container } from "react-bootstrap";
import { getBudgets,addBudget } from "../../utils/ApiRequest";
import { ToastContainer, toast } from "react-toastify";
import Header from "../../components/Header";
import TableData from "./TableData";
import DatePicker from "react-datepicker";
import Analytics from "./Analytics";
import axios from "axios";
const Budget = ({show,onHide,cUser,onDataSend}) => {
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

      const [view, setView] = useState("table");
    const [expenses, setExpenses] = useState([]); 
    const [budgetData, setBudgetData] = useState([]);
    // const [show, setShow] = useState(false);
    // const [cUser, setcUser] = useState();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [category,setCategory] = useState(null)

    const handleStartChange = (date) => {
        setStartDate(date);
      };
    
      const handleEndChange = (date) => {
        setEndDate(date);
      };
    
      // const handleClose = () => setShow(false);
      // const handleShow = () => setShow(true);
      
      const [values, setValues] = useState({
        title: "",
        amount: "",
        description: "",
        category: "",
        date: "",
        transactionType: "",
      });

      const handleChange = (event) => {
        const { name, value } = event.target;
    
        if (0 &&name === "date") {
            // Add "-01" to the selected month-year to ensure it’s saved as the 1st of the month
            const formattedDate = `${value}-01`;
            setValues({
                ...values,
                [name]: formattedDate,
            });
        } else {
            setValues({
                ...values,
                [name]: value,
            });
        }
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
          !category ||
          !date 
          // !transactionType
        ) {
          toast.error("Please enter all the fields", toastOptions);
        }
        // setLoading(true);
        
        console.log('cUser',cUser._id)
        const { data } = await axios.post(addBudget, {
          title: title,
          amount: amount,
          // description: description,
          category: category,
          date: date,
          transactionType: transactionType,
          userId: cUser._id,
        });
    
        if (data.success === true) {
          console.log(data)
          toast.success(data.message, toastOptions);
          // handleClose();
          // setRefresh(!refresh);
        } else {
          toast.error(data.message, toastOptions);
        }
    
        // setLoading(false);
      };

      useEffect(() => {

        const fetchBudgets = async () => {
          try {
            // setLoading(true);
            console.log('fetchBudgets')
            console.log(cUser._id, startDate, endDate,category);
            const { data } = await axios.post(getBudgets, {
              userId: cUser._id,
              startDate: startDate,
              endDate: endDate,
              expenses:expenses,
              category: category
            });
            console.log(data)
            setBudgetData(data.budgets);
            
            onDataSend(data.budgets)
            // setLoading(false);
          } catch (err) {
            toast.error("Error please Try again...", toastOptions);
            // setLoading(false);
          }
        };
    
        fetchBudgets();
      }, [startDate,category]);

      return (<>
      <Modal show={show} onHide={onHide} centered>
<Modal.Header closeButton>
  <Modal.Title>Add Budget Details</Modal.Title>
</Modal.Header>
<Modal.Body>
  <Form>
    <Form.Group className="mb-3" controlId="formName">
      <Form.Label>Title</Form.Label>
      <Form.Control
        name="title"
        type="text"
        placeholder="Enter Budget Title"
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

    <Form.Group className="mb-3" controlId="formMonthYear">
      <Form.Label>Date</Form.Label>
      <Form.Control
        type="month"
        name="date"
        value={values.date}
        onChange={handleChange}
      />
    </Form.Group>

    {/* Add more form inputs as needed */}
  </Form>
</Modal.Body>
<Modal.Footer>
  <Button variant="secondary" onClick={onHide}>
    Close
  </Button>
  <Button variant="primary" onClick={handleSubmit}>
    Submit
  </Button>
</Modal.Footer>
</Modal>


      </>)
}

export default Budget

