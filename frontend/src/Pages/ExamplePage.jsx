import React, { useEffect, useState } from "react";
import { Table, Form, Button, Modal } from "react-bootstrap";
import axios from "axios";

const ExamplePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    hobbies: "",
  });
  const [tableData, setTableData] = useState([]); 
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [emailAddress, setEmailAddress] = useState("info@redpositive.in");
  const [show,setShow] = useState(false);

  const [updatedUserData, setUpdatedUserData] = useState({
    name: "",
    phone: "",
    email: "",
    hobbies: "",
  });
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newEntry = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      hobbies: formData.hobbies,
    };
    if(formData.name===""||formData.email===""||formData.phone===""||formData.hobbies===""){
      return alert("No Fields could be left blank")
    }
    setTableData([...tableData, newEntry]);
    setFormData({ name: "", phone: "", email: "", hobbies: "" });

    // Send form data via POST request to another API
    fetch("https://it-studio-assig-backend.onrender.com/api/user/createuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEntry),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to send form data.");
        }
      })
      .catch((error) => {
        console.log("Error sending form data:", error);
      });
  };

  useEffect(() => {
    // Fetch all users from API
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const response = await fetch("https://it-studio-assig-backend.onrender.com/api/user/allusers");
      const data = await response.json();
      setTableData(data.users);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateClick = (userId) => {
    // Set selected user ID and show the modal
    const row = tableData.find((data) => data._id === userId);
    setShowModal(true);
    setUpdatedUserData({ name: row.name, phone: row.phone, email: row.email, hobbies: row.hobbies });
    setSelectedUserId(userId);
    console.log(selectedUserId)
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveChanges = () => {
    // Send PUT request to update the user
    // console.log(selectedUserId);
    fetch(`https://it-studio-assig-backend.onrender.com/api/user/updateuser/${selectedUserId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUserData),
    })
      .then((response) => {
        if (response.ok) {
          // Update the corresponding user in the tableData state
          const updatedTableData = tableData.map((data) =>
            data.id === selectedUserId ? { ...data, ...updatedUserData } : data
          );
          setTableData(updatedTableData);
          handleCloseModal();
          window.location.reload();
        } else {
          throw new Error("Failed to update user.");
        }
      })
      .catch((error) => {
        console.log("Error updating user:", error);
      });
  };

  // Delete Function
  const handleDeleteClick = (userId) => {
    // Send DELETE request to delete the user
    fetch(`https://it-studio-assig-backend.onrender.com/api/user/deleteuser/${userId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          // Remove the deleted user from the tableData state
          const updatedTableData = tableData.filter(
            (data) => data.id !== userId
          );
          setTableData(updatedTableData);
          window.location.reload();
        } else {
          throw new Error("Failed to delete user.");
        }
      })
      .catch((error) => {
        console.log("Error deleting user:", error);
      });
  };

  // Mail Logic
  const handleCheckboxChange = (e, id) => {
    const isChecked = e.target.checked;
    const row = tableData.find((data) => data._id === id);

    if (isChecked) {
      setSelectedRows([...selectedRows, row]);
    } else {
      setSelectedRows(selectedRows.filter((rowData) => rowData._id !== id));
    }
    // console.log(selectedRows)
  };

  const handleSendEmail = () => {
    setShow(true);
    if (selectedRows.length === 0 || !emailAddress) {
      return;
    }
    axios
      .post("https://it-studio-assig-backend.onrender.com/api/user/sendemail", {
        rows: selectedRows,
        email: emailAddress,
      })
      .then((response) => {
        // Reset selected rows and email address
        setSelectedRows([]);
        setEmailAddress("");
        // console.log("Buttion")
        setShow(false)
        window.location.reload();
      })
      .catch((error) => {
        console.log(emailAddress);
        console.error("Error sending email:", error);
      });
  };

  return (
    <div>
      <h1>Home Page</h1>
      <Form onSubmit={handleFormSubmit}>
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="formPhone">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="formHobbies">
          <Form.Label>Hobbies</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Hobbies"
            name="hobbies"
            value={formData.hobbies}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Button variant="primary my-3" type="submit">
          Save
        </Button>
      </Form>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Select</th>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Hobbies</th>
            <th>Update/Delete</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((data) => (
            <tr key={data._id}>
              <td>
                <Form.Check
                  type="checkbox"
                  name="select"
                  onChange={(e) => handleCheckboxChange(e, data._id)}
                />
              </td> 
              {/* <td>{data._id}</td> */}
              <td>{data.name}</td>
              <td>{data.phone}</td>
              <td>{data.email}</td>
              <td>{data.hobbies}</td>
              <td>
                <Button
                  variant="outline-danger"
                  onClick={() => handleDeleteClick(data._id)}
                >
                  Delete
                </Button>{" "}
                <Button
                  variant="outline-primary"
                  onClick={() => handleUpdateClick(data._id)}
                >
                  Update
                </Button>{" "}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="modalName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Name"
                name="name"
                value={updatedUserData.name}
                onChange={(e) =>
                  setUpdatedUserData({
                    ...updatedUserData,
                    name: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="modalPhone">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Phone Number"
                name="phone"
                value={updatedUserData.phone}
                onChange={(e) =>
                  setUpdatedUserData({
                    ...updatedUserData,
                    phone: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="modalEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Email"
                name="email"
                value={updatedUserData.email}
                onChange={(e) =>
                  setUpdatedUserData({
                    ...updatedUserData,
                    email: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="modalHobbies">
              <Form.Label>Hobbies</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Hobbies"
                name="hobbies"
                value={updatedUserData.hobbies}
                onChange={(e) =>
                  setUpdatedUserData({
                    ...updatedUserData,
                    hobbies: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <Form.Group controlId="formEmail">
        <Form.Label>Email Address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter Email Address"
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
        />
        {show?(<h6>Wait!!!</h6>):(<></>)}
      </Form.Group>
      <Button className="my-3" variant="primary" onClick={handleSendEmail}>
        Send Email
      </Button>
    </div>
  );
};
export default ExamplePage;
