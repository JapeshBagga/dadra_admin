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

  // Map of test names to their default normal ranges and units
  const testDefaults = {
    "CBC - Hemoglobin": {
      unit: "g/dL",
      normal_range: "13.0-17.0 g/dL (Male) / 12.0-15.0 g/dL (Female)"
    },
    "CBC - RBC Count": {
      unit: "x10^12/L", 
      normal_range: "4.5-5.5 x10^12/L"
    },
    "CBC - WBC Count": {
      unit: "x10^9/L",
      normal_range: "4.0-11.0 x10^9/L"
    },
    // Add more test mappings here...
  };

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
    if (e.target.name === "name") {
      // When test name changes, update unit and normal range if defaults exist
      const defaults = testDefaults[e.target.value] || {unit: "", normal_range: ""};
      setFormData({ 
        ...formData,
        name: e.target.value,
        unit: defaults.unit,
        normal_range: defaults.normal_range
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
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
            <select
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="test-select"
            >
              <option value="">Select a test</option>
              
              {/* CBC Tests */}
              <optgroup label="Complete Blood Count (CBC)">
                <option value="CBC - Hemoglobin">Hemoglobin</option>
                <option value="CBC - RBC Count">RBC Count</option>
                <option value="CBC - WBC Count">WBC Count</option>
                <option value="CBC - Platelet Count">Platelet Count</option>
                <option value="CBC - Hematocrit">Hematocrit</option>
                <option value="CBC - MCV">Mean Corpuscular Volume (MCV)</option>
                <option value="CBC - MCH">Mean Corpuscular Hemoglobin (MCH)</option>
                <option value="CBC - MCHC">Mean Corpuscular Hemoglobin Concentration (MCHC)</option>
                <option value="CBC - Differential Count">Differential Count</option>
                <option value="CBC - RDW">Red Cell Distribution Width (RDW)</option>
                <option value="CBC - MPV">Mean Platelet Volume (MPV)</option>
                <option value="CBC - PDW">Platelet Distribution Width (PDW)</option>
                <option value="CBC - PCT">Plateletcrit (PCT)</option>
                <option value="CBC - P-LCR">Platelet Large Cell Ratio (P-LCR)</option>
                <option value="CBC - Neutrophils">Neutrophils</option>
                <option value="CBC - Lymphocytes">Lymphocytes</option>
                <option value="CBC - Monocytes">Monocytes</option>
                <option value="CBC - Eosinophils">Eosinophils</option>
                <option value="CBC - Basophils">Basophils</option>
                <option value="CBC - Band Neutrophils">Band Neutrophils</option>
                <option value="CBC - Metamyelocytes">Metamyelocytes</option>
                <option value="CBC - Myelocytes">Myelocytes</option>
                <option value="CBC - Promyelocytes">Promyelocytes</option>
                <option value="CBC - Blasts">Blasts</option>
                <option value="CBC - Nucleated RBC">Nucleated RBC</option>
                <option value="CBC - Reticulocyte Count">Reticulocyte Count</option>
              </optgroup>

              {/* Basic Metabolic Panel */}
              <optgroup label="Basic Metabolic Panel (BMP)">
                <option value="BMP - Glucose">Glucose</option>
                <option value="BMP - Calcium">Calcium</option>
                <option value="BMP - Sodium">Sodium</option>
                <option value="BMP - Potassium">Potassium</option>
                <option value="BMP - CO2">Carbon Dioxide (CO2)</option>
                <option value="BMP - Chloride">Chloride</option>
                <option value="BMP - BUN">Blood Urea Nitrogen (BUN)</option>
                <option value="BMP - Creatinine">Creatinine</option>
              </optgroup>

              {/* Comprehensive Metabolic Panel */}
              <optgroup label="Comprehensive Metabolic Panel (CMP)">
                <option value="CMP - Albumin">Albumin</option>
                <option value="CMP - ALP">Alkaline Phosphatase (ALP)</option>
                <option value="CMP - ALT">Alanine Aminotransferase (ALT)</option>
                <option value="CMP - AST">Aspartate Aminotransferase (AST)</option>
                <option value="CMP - Bilirubin">Bilirubin</option>
                <option value="CMP - Protein">Total Protein</option>
              </optgroup>

              {/* Lipid Panel */}
              <optgroup label="Lipid Panel">
                <option value="Lipid - Total Cholesterol">Total Cholesterol</option>
                <option value="Lipid - HDL">HDL Cholesterol</option>
                <option value="Lipid - LDL">LDL Cholesterol</option>
                <option value="Lipid - Triglycerides">Triglycerides</option>
              </optgroup>

              {/* Thyroid Function Tests */}
              <optgroup label="Thyroid Function Tests">
                <option value="Thyroid - TSH">Thyroid Stimulating Hormone (TSH)</option>
                <option value="Thyroid - T3">Triiodothyronine (T3)</option>
                <option value="Thyroid - T4">Thyroxine (T4)</option>
                <option value="Thyroid - Free T3">Free T3</option>
                <option value="Thyroid - Free T4">Free T4</option>
              </optgroup>

              <option value="Hemoglobin A1C">Hemoglobin A1C</option>

              {/* Urinalysis */}
              <optgroup label="Urinalysis">
                <option value="Urinalysis - Color">Color</option>
                <option value="Urinalysis - Clarity">Clarity</option>
                <option value="Urinalysis - pH">pH</option>
                <option value="Urinalysis - Protein">Protein</option>
                <option value="Urinalysis - Glucose">Glucose</option>
                <option value="Urinalysis - Ketones">Ketones</option>
                <option value="Urinalysis - Blood">Blood</option>
              </optgroup>

              {/* Liver Function Tests */}
              <optgroup label="Liver Function Tests">
                <option value="LFT - Bilirubin Total">Total Bilirubin</option>
                <option value="LFT - Bilirubin Direct">Direct Bilirubin</option>
                <option value="LFT - SGOT">SGOT/AST</option>
                <option value="LFT - SGPT">SGPT/ALT</option>
                <option value="LFT - ALP">Alkaline Phosphatase</option>
                <option value="LFT - Proteins">Total Proteins</option>
                <option value="LFT - Albumin">Albumin</option>
              </optgroup>

              {/* Renal Function Tests */}
              <optgroup label="Renal Function Tests">
                <option value="RFT - Urea">Blood Urea</option>
                <option value="RFT - Creatinine">Serum Creatinine</option>
                <option value="RFT - Uric Acid">Uric Acid</option>
                <option value="RFT - eGFR">eGFR</option>
                <option value="RFT - Microalbumin">Microalbumin</option>
              </optgroup>

              {/* Dengue Tests */}
              <optgroup label="Dengue Tests">
                <option value="Dengue - NS1">Dengue NS1 Antigen</option>
                <option value="Dengue - IgM">Dengue IgM Antibody</option>
                <option value="Dengue - IgG">Dengue IgG Antibody</option>
              </optgroup>

              {/* Biochemistry Tests */}
              <optgroup label="Biochemistry Tests">
                <option value="Bio - Blood Sugar Fasting">Blood Sugar Fasting</option>
                <option value="Bio - Blood Sugar PP">Blood Sugar Post Prandial</option>
                <option value="Bio - Blood Sugar Random">Blood Sugar Random</option>
                <option value="Bio - Serum Amylase">Serum Amylase</option>
                <option value="Bio - Serum Lipase">Serum Lipase</option>
                <option value="Bio - CPK">Creatine Phosphokinase (CPK)</option>
                <option value="Bio - LDH">Lactate Dehydrogenase (LDH)</option>
              </optgroup>

              {/* Typhoid Tests */}
              <optgroup label="Typhoid Tests">
                <option value="Typhidot - IgM">Typhidot IgM</option>
                <option value="Typhidot - IgG">Typhidot IgG</option>
                <option value="Widal Test">Widal Test</option>
              </optgroup>

              {/* Serum Electrolytes */}
              <optgroup label="Serum Electrolytes">
                <option value="Electro - Sodium">Serum Sodium</option>
                <option value="Electro - Potassium">Serum Potassium</option>
                <option value="Electro - Chloride">Serum Chloride</option>
                <option value="Electro - Bicarbonate">Serum Bicarbonate</option>
                <option value="Electro - Calcium">Serum Calcium</option>
                <option value="Electro - Magnesium">Serum Magnesium</option>
                <option value="Electro - Phosphate">Serum Phosphate</option>
              </optgroup>

              <option value="Prostate-Specific Antigen (PSA)">Prostate-Specific Antigen (PSA)</option>
              <option value="C-Reactive Protein (CRP)">C-Reactive Protein (CRP)</option>
              <option value="Vitamin D">Vitamin D</option>
              <option value="Vitamin B12">Vitamin B12</option>

              {/* Iron Studies */}
              <optgroup label="Iron Studies">
                <option value="Iron - Serum Iron">Serum Iron</option>
                <option value="Iron - TIBC">Total Iron Binding Capacity (TIBC)</option>
                <option value="Iron - Ferritin">Ferritin</option>
                <option value="Iron - Transferrin">Transferrin</option>
              </optgroup>

              {/* Coagulation Panel */}
              <optgroup label="Coagulation Panel">
                <option value="Coag - PT">Prothrombin Time (PT)</option>
                <option value="Coag - INR">International Normalized Ratio (INR)</option>
                <option value="Coag - PTT">Partial Thromboplastin Time (PTT)</option>
                <option value="Coag - Fibrinogen">Fibrinogen</option>
              </optgroup>

              {/* Hepatitis Panel */}
              <optgroup label="Hepatitis Panel">
                <option value="Hep - HBsAg">Hepatitis B Surface Antigen (HBsAg)</option>
                <option value="Hep - Anti-HBs">Hepatitis B Surface Antibody (Anti-HBs)</option>
                <option value="Hep - Anti-HBc">Hepatitis B Core Antibody (Anti-HBc)</option>
                <option value="Hep - Anti-HCV">Hepatitis C Antibody (Anti-HCV)</option>
              </optgroup>
            </select>
            {/* <input 
              type="text"
              placeholder="Search tests..."
              onChange={(e) => {
                const searchTerm = e.target.value.toLowerCase();
                const select = e.target.nextElementSibling;
                Array.from(select.options).forEach(option => {
                  const txt = option.textContent.toLowerCase();
                  option.style.display = txt.includes(searchTerm) ? '' : 'none';
                });
              }}
              className="test-search"
            /> */}
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
              list="units"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              placeholder="Type or select unit"
            />
            <datalist id="units">
              <option value="10^9/L">10^9/L</option>
              <option value="10^12/L">10^12/L</option>
              <option value="fL">fL</option>
              <option value="mg/dL">mg/dL</option>
              <option value="g/dL">g/dL</option>
              <option value="mmol/L">mmol/L</option>
              <option value="mEq/L">mEq/L</option>
              <option value="%">%</option>
              <option value="U/L">U/L</option>
              <option value="ng/mL">ng/mL</option>
              <option value="pg/mL">pg/mL</option>
              <option value="μg/dL">μg/dL</option>
              <option value="cells/μL">cells/μL</option>
              <option value="mm/hr">mm/hr</option>
              <option value="seconds">seconds</option>
              <option value="negative">negative</option>
              <option value="positive">positive</option>
              <option value="ratio">ratio</option>
              <option value="U/mL">U/mL</option>
              <option value="K/μL">K/μL</option>
            </datalist>
          </label>
          <label>
            Normal Range:
            <input
              type="text" 
              list="normal-ranges"
              name="normal_range"
              value={formData.normal_range}
              onChange={handleChange}
              placeholder="Type or select normal range"
            />
            <datalist id="normal-ranges">
              {/* CBC Tests */}
              <option value="13.0-17.0 g/dL">Hemoglobin (Male)</option>
              <option value="12.0-15.0 g/dL">Hemoglobin (Female)</option>
              <option value="4.5-5.5 x10^12/L">RBC Count</option>
              <option value="4.0-11.0 x10^9/L">WBC Count</option>
              <option value="150-450 x10^9/L">Platelet Count</option>
              <option value="40-50%">Hematocrit (Male)</option>
              <option value="36-44%">Hematocrit (Female)</option>
              <option value="80-100 fL">MCV</option>
              <option value="27-32 pg">MCH</option>
              <option value="32-36 g/dL">MCHC</option>
              <option value="11.5-14.5%">RDW</option>
              <option value="7.5-11.5 fL">MPV</option>
              <option value="15-17%">PDW</option>
              <option value="0.19-0.39%">PCT</option>
              <option value="15-35%">P-LCR</option>
              <option value="40-75%">Neutrophils</option>
              <option value="20-40%">Lymphocytes</option>
              <option value="2-10%">Monocytes</option>
              <option value="1-6%">Eosinophils</option>
              <option value="0-1%">Basophils</option>
              <option value="0-5%">Band Neutrophils</option>
              <option value="0%">Metamyelocytes</option>
              <option value="0%">Myelocytes</option>
              <option value="0%">Promyelocytes</option>
              <option value="0%">Blasts</option>
              <option value="0-1/100 WBC">Nucleated RBC</option>
              <option value="0.5-2.5%">Reticulocyte Count</option>

              {/* Basic Metabolic Panel */}
              <option value="70-100 mg/dL">Glucose (Fasting)</option>
              <option value="8.5-10.5 mg/dL">Calcium</option>
              <option value="135-145 mEq/L">Sodium</option>
              <option value="3.5-5.0 mEq/L">Potassium</option>
              <option value="23-29 mEq/L">CO2</option>
              <option value="96-106 mEq/L">Chloride</option>
              <option value="7-20 mg/dL">BUN</option>
              <option value="0.6-1.2 mg/dL">Creatinine</option>

              {/* Comprehensive Metabolic Panel */}
              <option value="3.4-5.4 g/dL">Albumin</option>
              <option value="20-140 U/L">ALP</option>
              <option value="7-56 U/L">ALT</option>
              <option value="10-40 U/L">AST</option>
              <option value="0.3-1.2 mg/dL">Total Bilirubin</option>
              <option value="6.0-8.3 g/dL">Total Protein</option>

              {/* Lipid Panel */}
              <option value="<200 mg/dL">Total Cholesterol</option>
              <option value=">40 mg/dL">HDL</option>
              <option value="<100 mg/dL">LDL</option>
              <option value="<150 mg/dL">Triglycerides</option>

              {/* Thyroid Function */}
              <option value="0.4-4.0 mIU/L">TSH</option>
              <option value="80-200 ng/dL">T3</option>
              <option value="5.0-12.0 μg/dL">T4</option>
              <option value="2.3-4.2 pg/mL">Free T3</option>
              <option value="0.8-1.8 ng/dL">Free T4</option>

              <option value="4.0-5.6%">Hemoglobin A1C</option>

              {/* Liver Function */}
              <option value="0.3-1.2 mg/dL">Total Bilirubin</option>
              <option value="0.1-0.3 mg/dL">Direct Bilirubin</option>
              <option value="5-40 U/L">SGOT/AST</option>
              <option value="7-56 U/L">SGPT/ALT</option>
              <option value="20-140 U/L">ALP</option>
              <option value="6.0-8.3 g/dL">Total Proteins</option>
              <option value="3.5-5.5 g/dL">Albumin</option>

              {/* Renal Function */}
              <option value="7-20 mg/dL">Blood Urea</option>
              <option value="0.6-1.2 mg/dL">Serum Creatinine</option>
              <option value="3.4-7.0 mg/dL">Uric Acid</option>
              <option value=">90 mL/min/1.73m²">eGFR</option>
              <option value="<30 mg/g creatinine">Microalbumin</option>

              {/* Electrolytes */}
              <option value="135-145 mEq/L">Serum Sodium</option>
              <option value="3.5-5.0 mEq/L">Serum Potassium</option>
              <option value="96-106 mEq/L">Serum Chloride</option>
              <option value="22-29 mEq/L">Serum Bicarbonate</option>
              <option value="8.5-10.5 mg/dL">Serum Calcium</option>
              <option value="1.7-2.2 mg/dL">Serum Magnesium</option>
              <option value="2.5-4.5 mg/dL">Serum Phosphate</option>

              {/* Iron Studies */}
              <option value="60-170 μg/dL">Serum Iron</option>
              <option value="240-450 μg/dL">TIBC</option>
              <option value="20-250 ng/mL">Ferritin</option>
              <option value="200-360 mg/dL">Transferrin</option>

              {/* Coagulation */}
              <option value="11-13.5 seconds">PT</option>
              <option value="0.8-1.2">INR</option>
              <option value="25-35 seconds">PTT</option>
              <option value="200-400 mg/dL">Fibrinogen</option>

              <option value="0-4.0 ng/mL">PSA</option>
              <option value="<10 mg/L">CRP</option>
              <option value="30-100 ng/mL">Vitamin D</option>
              <option value="200-900 pg/mL">Vitamin B12</option>
            </datalist>
          </label>

          <button type="submit">Add Test</button>
        </form>
      </section>
    </section>
  );
};

export default OpdForm;
