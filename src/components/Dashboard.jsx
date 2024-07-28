import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import SERVER_URL from "../env";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          `${SERVER_URL}/api/v1/appointment/getall`,
          { withCredentials: true }
        );
        setAppointments(data.appointments);
      } catch (error) {
        setAppointments([]);
      }
    };
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/appointment/update/${appointmentId}`,
        { status },
        { withCredentials: true }
      );
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status }
            : appointment
        )
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const { isAuthenticated, admin } = useContext(Context);
  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }
  const navigateTo = useNavigate();

  const AddNewOPD = (id) => {
    navigateTo("/opd/"+id);
  };

  return (
    <>
      <section className="dashboard page">
        <div className="banner">
          <div className="firstBox">
            <img src="/doc.png" alt="docImg" />
            <div className="content">
              <div>
                <p>Hello,</p>
                <h5>
                  {admin &&
                    `${admin.firstName} ${admin.lastName}`}{" "}
                </h5>
              </div>
              <p>
                Welcome to Dadra Hospital Admin Portal
              </p>
            </div>
          </div>
          <div className="secondBox">
            <p>Total Appointments</p>
            <h3>{appointments?.length ?? 0}</h3>
          </div>
          {/* <div className="thirdBox">
            <p>Registered Doctors</p>
            <h3>10</h3>
          </div> */}
        </div>
        <div className="banner">
          <h5>Appointments</h5>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Patient</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Age</th>
                <th>problem</th>
                <th>Status</th>
                <th>Action</th>

              </tr>
            </thead>
            <tbody>
              {appointments && appointments.length > 0
                ? appointments.map((appointment) => (
                  <tr key={appointment?._id}>
                  <td>{`${moment(appointment?.createdAt).format('Do MMMM YY')}`}</td>
                  {/* <td>{appointment?.appointment?_date.substring(0, 16)}</td> */}
                  {/* <td>{`${appointment?.doctor.firstName} ${appointment?.doctor.lastName}`}</td> */}
                  <td>{appointment?.name}</td>
                  <td>{appointment?.email}</td>
                  <td>{appointment?.phone}</td>
                  <td>{appointment?.age}</td>
                  <td>{appointment?.problem}</td>
                      <td>
                        <select
                          className={
                            appointment?.status === "Pending"
                              ? "value-pending"
                              : appointment?.status === "Accepted"
                              ? "value-accepted"
                              : "value-rejected"
                          }
                          value={appointment?.status}
                          onChange={(e) =>
                            handleUpdateStatus(appointment?._id, e.target.value)
                          }
                        >
                          <option value="Pending" className="value-pending">
                            Pending
                          </option>
                          <option value="Accepted" className="value-accepted">
                            Accepted
                          </option>
                          <option value="Rejected" className="value-rejected">
                            Rejected
                          </option>
                        </select>
                      </td>
                      {/* <td>{appointment.hasVisited === true ? <GoCheckCircleFill className="green"/> : <AiFillCloseCircle className="red"/>}</td> */}
                      <td onClick={()=> AddNewOPD(appointment?._id)}>Add OPD</td>

                    </tr>
                  ))
                : "No Appointments Found!"}
            </tbody>
          </table>

          {}
        </div>
      </section>
    </>
  );
};

export default Dashboard;
