import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import {useNavigate, Navigate, useParams } from "react-router-dom";
import SERVER_URL from "../env";
import moment from "moment";

const OPDs = () => {
  const { patientId } = useParams();
  const navigateTo = useNavigate();

  const [opds, setopds] = useState([]);
  const { isAuthenticated } = useContext(Context);

  useEffect(() => {
    const fetchopds = async () => {
      try {
        const { data } = await axios.get(
          `${SERVER_URL}/api/v1/opd/${patientId}`,
          {
            withCredentials: true,
          }
        );
        console.log("🚀 ~ fetchopds ~ data:", data);
        setopds(data);
      } catch (error) {
        setopds([]);
        console.error("Error fetching OPD data:", error);
      }
    };
    fetchopds();
  }, [patientId]);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  const NavigateToOPDs = () => {
    navigateTo("/opd/addnew/"+patientId);
  };

  return (
    <section className="page messages">
      <h1>OPDs</h1>
      <div className="banner">
        <div className="opd-container">
          {opds && opds.length > 0 ? (
            opds.map((opd) => (
                <div className="opd-card" key={opd.opdId}>
                <div className="header">
                  <h1>Dadra Hospital</h1>
                  <p>Prescription DHOP1758</p>
                  <p className="date"><strong>Date:</strong> {`${moment(opd?.createdAt).format('Do MMMM YY hh:mm:ss')}`}</p>
                </div>
                <div className="patient-details">
                  <div className="patient-info">
                    <p><strong>OPD ID:</strong> {opd.opdId}</p>
                    <p><strong>Patient Name:</strong> {opd.patientId.name}</p>
                    <p><strong>Gender:</strong> {opd.patientId.gender}</p>
                    <p><strong>Address:</strong> {opd.patientId.address}</p>
                    <p><strong>Known Allergies:</strong> {opd.knownAllergies}</p>
                  </div>
                  <div className="vitals">
                    <p><strong>BP:</strong> {opd.bp}</p>
                    <p><strong>RR:</strong> {opd.rr}</p>
                    <p><strong>Temperature:</strong> {opd.temperature}</p>
                    <p><strong>Age:</strong> {opd.patientId.age}</p>
                    <p><strong>Phone:</strong> {opd.patientId.phone}</p>
                    {/* <p><strong>Consultant Doctor:</strong> {opd.consultantDoctor}</p> */}
                  </div>
                </div>
                <div className="investigation">
                  <h4>Investigation: </h4>
                </div>
                <div className="diagnosis">
                  <h4>Diagnosis:</h4>
                  <p>{opd.diagnosis}</p>
                </div>
                <div className="complain">
                  <h4>Complain:</h4>
                  <p>{opd.complain}</p>
                </div>
                <div className="medicines">
                  <h4>Medicines</h4>
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Medicine Category</th>
                        <th>Medicine</th>
                        <th>Dosage</th>
                        <th>Dose Interval</th>
                        <th>Dose Duration</th>
                        <th>Instruction</th>
                      </tr>
                    </thead>
                    <tbody>
                      {opd.medicines.map((medicine, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{medicine.category}</td>
                          <td>{medicine.name}</td>
                          <td>{medicine.dosage.quantity} {medicine.dosage.type}</td>
                          <td>{medicine.dose_interval}</td>
                          <td>{medicine.dose_duration}</td>
                          <td>{medicine.instruction}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="advice">
                  <h4>Advice:</h4>
                  <p>{opd.advice}</p>
                </div>
                <div className="next-visit">
                  <h4>Next Visit:</h4>
                  <p>{opd.nextVisit}</p>
                </div>
              </div>
            ))
          ) : (
            <h1>No OPDs!</h1>
          )}
        </div>

        <button className="btn" onClick={NavigateToOPDs}>Add New OPD</button>
      </div>
    </section>
  );
};

export default OPDs;
