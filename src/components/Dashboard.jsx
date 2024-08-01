import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import SERVER_URL from "../env";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(5);
  const { patient, setPatient } = useContext(Context);

  useEffect(() => {
    setPatient({
      name: "",
      address: "",
      age: null,
    });
  }, [setPatient]);

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
      if (!admin?.canEdit) return toast.error("Restricted Access");
      const { data } = await axios.put(
        `${SERVER_URL}/api/v1/appointment/update/${appointmentId}`,
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

  const NavigateToOPDs = (id, data) => {
    setPatient({ ...data });
    navigateTo("/opds/" + id);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredAppointments = appointments.filter((appointment) =>
    appointment.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get current appointments
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <section className="dashboard page">
        <div className="banner">
          <div className="firstBox">
            <img src="/doc.png" alt="docImg" />
            <div className="content">
              <div>
                <p>Hello,</p>
                <h5>{admin && `${admin.firstName} ${admin.lastName}`} </h5>
              </div>
              <p>Welcome to Dadra Hospital Admin Portal</p>
            </div>
          </div>
          <div className="secondBox">
            <p>Total Appointments</p>
            <h3>{appointments?.length ?? 0}</h3>
          </div>
        </div>
        <div className="actions" style={{ marginLeft: "60%" }}>
          <input
            type="text"
            className="search-input"
            placeholder="Search by patient name"
            value={searchQuery}
            onChange={handleSearchChange}
            style={{ marginBottom: "-1%" }}
          />
        </div>
        <div className="banner">
          <h5>Appointments</h5>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Patient</th>
                <th>Address</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Age</th>
                <th>Problem</th>
                <th>Action</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentAppointments && currentAppointments.length > 0
                ? currentAppointments.map((appointment) => (
                    <tr key={appointment?._id}>
                      <td>{`${moment(appointment?.createdAt).format(
                        "Do MMMM YY"
                      )}`}</td>
                      <td>{appointment?.name ?? "-"}</td>

                      <td>
                        {" "}
                        {appointment?.address?.trim()
                          ? appointment?.address
                          : "-"}
                      </td>
                      <td>
                        {appointment?.email.trim() ? appointment?.email : "-"}
                      </td>
                      <td>{appointment?.phone ?? "-"}</td>
                      <td>
                        {appointment?.age.trim() ? appointment?.age : "-"}
                      </td>
                      <td>{appointment?.problem ?? "-"}</td>
                      <td
                        onClick={() =>
                          NavigateToOPDs(appointment?._id, appointment)
                        }
                      >
                        <a className="custom-link">View OPDs</a>
                      </td>
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
                    </tr>
                  ))
                : "No Appointments Found!"}
            </tbody>
          </table>
          <Pagination
            appointmentsPerPage={appointmentsPerPage}
            totalAppointments={filteredAppointments.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </section>
    </>
  );
};

const Pagination = ({
  appointmentsPerPage,
  totalAppointments,
  paginate,
  currentPage,
}) => {
  const pageNumbers = [];

  for (
    let i = 1;
    i <= Math.ceil(totalAppointments / appointmentsPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <a
              onClick={() => paginate(number)}
              href="#"
              className={`custom-link ${number == currentPage && "active"}`}
            >
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Dashboard;
