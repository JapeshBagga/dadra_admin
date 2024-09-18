import React, { useState, useEffect } from "react";
import SERVER_URL from "../env";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const OpdForm = () => {
  const { medicineId } = useParams();
  const navigateTo = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    expiryDate: "",
    mfdDate: "",
    fssaiNo: "",
    price: "",
  });

  useEffect(() => {
    if (medicineId) {
      const fetchMedicine = async () => {
        try {
          const { data } = await axios.get(
            `${SERVER_URL}/api/v1/pharmacy/${medicineId}`,
            { withCredentials: true }
          );
          setFormData({
            name: data.name,
            category: data.category,
            quantity: data.quantity,
            expiryDate: data.expiryDate?.split("T")[0],
            mfdDate: data.mfdDate?.split("T")[0],
            fssaiNo: data.fssaiNo,
            price: data.price,
          });
        } catch (error) {
          toast.error("Error:", error);
        }
      };

      fetchMedicine();
    }
  }, [medicineId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = medicineId ? "PUT" : "POST";
      const url = medicineId
        ? `${SERVER_URL}/api/v1/pharmacy/${medicineId}`
        : `${SERVER_URL}/api/v1/pharmacy/add`;
      const response = await axios({
        method,
        url,
        data: formData,
        withCredentials: true,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success(
          `Medicine ${medicineId ? "updated" : "added"} successfully`
        );
        navigateTo("/pharmacy");
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
        <h1 className="form-title">Dadra Pharmacy</h1>
        <form className="medicine-form" onSubmit={handleSubmit}>
          <h2>Add Medicine</h2>
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
            Category:
            <input
              type="text"
              name="category"
              value={formData.category}
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
              
            />
          </label> */}
          <label>
            Quantity:
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min={0}
              required
            />
          </label>
          <label>
            Expiry Date:
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
            />
          </label>
          <label>
            MFD Date:
            <input
              type="date"
              name="mfdDate"
              value={formData.mfdDate}
              onChange={handleChange}
            />
          </label>
          <label>
            FSSAI No.:
            <input
              type="text"
              name="fssaiNo"
              value={formData.fssaiNo}
              onChange={handleChange}
            />
          </label>
          <label>
            Price:
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </label>
          <button type="submit">Add Medicine</button>
        </form>
      </section>
    </section>
  );
};

export default OpdForm;
