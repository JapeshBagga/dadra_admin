import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import SERVER_URL from "../env";

const OpdForm = () => {
  const { patientId } = useParams();
  const { patient, setPatient } = useContext(Context);
  const navigateTo = useNavigate();
  const [formData, setFormData] = useState({
    // opdId: "",
    bp: "",
    rr: "",
    temperature: "",
    diagonsis: "",
    investigation: "",
    complain: "",
    spo2: "",
    rbs: "",
    medicines: [
      {
        category: "",
        name: "",
        dosage: {
          quantity: "",
          type: "",
        },
        dose_interval: "",
        dose_duration: "",
        instruction: "",
      },
    ],
    advice: "",
  });

  useEffect(() => {
    fetchOpdData();
  }, [patientId]);

  const fetchOpdData = async () => {
    try {
      const response = await axios.get(
        `${SERVER_URL}/api/v1/opd/${patientId}`,
        {
          withCredentials: true,
        }
      );
      if (response.data) {
        setFormData({
          ...response.data,
          medicines: response.data?.medicines?.length
            ? response.data.medicines
            : [
                {
                  category: "",
                  name: "",
                  dosage: {
                    quantity: "",
                    type: "",
                  },
                  dose_interval: "",
                  dose_duration: "",
                  instruction: "",
                },
              ],
        });
      }
    } catch (error) {
      console.error("Error fetching OPD data:", error);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMedicineChange = (index, e) => {
    const { name, value } = e.target;
    const medicines = [...formData.medicines];
    if (["quantity", "type"].includes(name)) {
      medicines[index].dosage[name] = value;
    } else {
      medicines[index][name] = value;
    }
    setFormData({ ...formData, medicines });
  };

  const addMedicine = () => {
    setFormData({
      ...formData,
      medicines: [
        ...formData.medicines,
        {
          category: "",
          name: "",
          dosage: {
            quantity: "",
            type: "",
          },
          dose_interval: "",
          dose_duration: "",
          instruction: "",
        },
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create new OPD
      await axios.post(`${SERVER_URL}/api/v1/opd/${patientId}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      alert("Form submitted successfully");
      navigateTo("/opds/" + id);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <section className="page">
      <section className="container form-component add-admin-form">
        <img src="/logo.png" width="125px" alt="logo" className="logo" />
        <h1 className="form-title">OPD Details</h1>
        <form className="opd-form" onSubmit={handleSubmit}>
          <h2></h2>
          {/* <label>
            OPD ID:
            <input
              type="text"
              name="opdId"
              value={formData.opdId}
              onChange={handleChange}
              defaultValue={Math.random(10000)}
              required
            />
          </label> */}
          <label>
            Patient Name:
            <input
              type="text"
              name="name"
              value={patient.name}
              // onChange={handleChange}
              readOnly
            />
          </label>
          <label>
            Age:
            <input
              type="text"
              name="age"
              value={patient.age}
              // onChange={handleChange}
              readOnly
            />
          </label>
          <label>
            Address:
            <input
              type="text"
              name="addr"
              value={patient.address}
              // onChange={handleChange}
              readOnly
            />
          </label>
          <label>
            Phone:
            <input
              type="text"
              name="phone"
              value={patient.phone}
              // onChange={handleChange}
              readOnly
            />
          </label>
          <label>
            BP:
            <input
              type="text"
              name="bp"
              value={formData.bp}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            SPO2:
            <input
              type="text"
              name="spo2"
              value={formData.spo2}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            RR:
            <input
              type="text"
              name="rr"
              value={formData.rr}
              onChange={handleChange}
            />
          </label>
          <label>
            RBS:
            <input
              type="text"
              name="rbs"
              value={formData.rbs}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Temperature:
            <input
              type="text"
              name="temperature"
              value={formData.temperature}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Investigation:
            <input
              type="text"
              name="investigation"
              value={formData.investigation}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Diagnosis:
            <input
              type="text"
              name="diagonsis"
              value={formData.diagonsis}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Complain:
            <input
              type="text"
              name="complain"
              value={formData.complain}
              onChange={handleChange}
              required
            />
          </label>
          <div className="medicines-section">
            <h3>Medicines</h3>
            {formData.medicines.map((medicine, index) => (
              <div key={index} className="medicine">
                <label>
                  Category:
                  <input
                    type="text"
                    name="category"
                    value={medicine.category}
                    onChange={(e) => handleMedicineChange(index, e)}
                    required
                  />
                </label>
                <label>
                  Name:
                  <input
                    type="text"
                    name="name"
                    value={medicine.name}
                    onChange={(e) => handleMedicineChange(index, e)}
                    required
                  />
                </label>
                <label>
                  Dosage Quantity:
                  <input
                    type="text"
                    name="quantity"
                    value={medicine.dosage.quantity}
                    onChange={(e) => handleMedicineChange(index, e)}
                    required
                  />
                </label>
                <label>
                  Dosage Type:
                  <select
                    name="type"
                    value={medicine.dosage.type}
                    onChange={(e) => handleMedicineChange(index, e)}
                    required
                  >
                    <option value="">Select</option>
                    <option value="tab">tab</option>
                    <option value="ml">ml</option>
                    <option value="l">l</option>
                    <option value="cap">cap</option>
                  </select>
                </label>
                <label>
                  Dose Interval:
                  <input
                    type="text"
                    name="dose_interval"
                    value={medicine.dose_interval}
                    onChange={(e) => handleMedicineChange(index, e)}
                  />
                </label>
                <label>
                  Dose Duration:
                  <input
                    type="text"
                    name="dose_duration"
                    value={medicine.dose_duration}
                    onChange={(e) => handleMedicineChange(index, e)}
                  />
                </label>
                <label>
                  Instruction:
                  <input
                    type="text"
                    name="instruction"
                    value={medicine.instruction}
                    onChange={(e) => handleMedicineChange(index, e)}
                  />
                </label>
              </div>
            ))}
            <button type="button" onClick={addMedicine}>
              Add Medicine
            </button>
          </div>
          <label>
            Advice:
            <input
              type="text"
              name="advice"
              value={formData.advice}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      </section>
    </section>
  );
};

export default OpdForm;
