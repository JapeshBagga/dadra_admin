import React, { useState, useEffect } from "react";
import SERVER_URL from "../env";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const OpdForm = () => {
  const { testId } = useParams();
  const navigateTo = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    patientName: "",
    case_id: "",
    price: "",
    sample_collected_date: "",
    expected_date: "",
  });

  useEffect(() => {
    if (testId) {
      const fetchTest = async () => {
        try {
          const { data } = await axios.get(
            `${SERVER_URL}/api/v1/pathology/${testId}`,
            { withCredentials: true }
          );
          setFormData({
            name: data.name,
            case_id: data.case_id,
            sample_collected_date: data.sample_collected_date?.split("T")[0],
            expected_date: data.expected_date?.split("T")[0],
          });
        } catch (error) {
          toast.error("Error:", error);
        }
      };

      fetchTest();
    }
  }, [testId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = testId ? "PUT" : "POST";
      const url = testId
        ? `${SERVER_URL}/api/v1/pathology/${testId}`
        : `${SERVER_URL}/api/v1/pathology/add`;
      const response = await axios({
        method,
        url,
        data: formData,
        withCredentials: true,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success(`Test ${testId ? "updated" : "added"} successfully`);
        navigateTo("/pathology");
      } else {
        toast.error(`Error: Something went wrong: ${errorData.error}`);
      }
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error:", error.response.data.message);
      toast.error(
        `Error: ${
          error?.response?.data?.error ??
          error?.response?.data?.message ??
          error
        }`
      );
    }
  };

  return (
    <section className="page">
      <section className="container form-component add-admin-form">
        <img src="/logo.png" width="125px" alt="logo" className="logo" />
        <h1 className="form-title">Dadra Laboratory</h1>
        <form className="medicine-form" onSubmit={handleSubmit}>
          <h2>Add Test</h2>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Case ID:
            <input
              type="text"
              name="case_id"
              value={formData.case_id}
              onChange={handleChange}
            />
          </label>
          <label>
            Patient Name
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
            />
          </label>
          <label>
           Price
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </label>
          {/* <label>
            Lot Size:
            <input
              type="number"
              name="lotSize"
              value={formData.lotSize}
              onChange={handleChange}
              <th>Sample Collected Date</th>
                <th>Expected Completion Date</th>
            />
          </label> */}
          {/* <label>
            Quantity:
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min={0}
              required
            />
          </label> */}
          <label>
            Sample Collected Date:
            <input
              type="date"
              name="sample_collected_date"
              value={formData.sample_collected_date}
              onChange={handleChange}
            />
          </label>
          <label>
            Expected Completion Date:
            <input
              type="date"
              name="expected_date"
              value={formData.expected_date}
              onChange={handleChange}
            />
          </label>

          <button type="submit">Add Test</button>
        </form>
      </section>
    </section>
  );
};

export default OpdForm;
