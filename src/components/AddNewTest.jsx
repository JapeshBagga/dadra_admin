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
    value_observed: "",
    unit: "",
    normal_range: "",
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
            unit: data.unit,
            value_observed: data.value_observed,
            normal_range: data.normal_range,
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
          Value Observed:
            <input
              type="text"
              name="value_observed"
              value={formData.value_observed}
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
          {/* <label>
           Price
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </label> */}
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
            Unit:
            <input
              type="text"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
            />
          </label>
          <label>
            Normal Range:
            <input
              type="text"
              name="normal_range"
              value={formData.normal_range}
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
