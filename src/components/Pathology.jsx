import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import SERVER_URL from "../env";

const Pathology = () => {
  const navigateTo = useNavigate();
  const [tests, settests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [testsPerPage] = useState(5);
  const { isAuthenticated, admin } = useContext(Context);

  useEffect(() => {
    const fetchtests = async () => {
      try {
        const { data } = await axios.get(`${SERVER_URL}/api/v1/pathology/all`, {
          withCredentials: true,
        });
        settests(data ?? []);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchtests();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  const NavigateToAddTest = (id) => {
    if (!admin.canEdit) return toast.error("Restricted Access");
    id
      ? navigateTo("/pathology/addnew/" + id)
      : navigateTo("/pathology/addnew/");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredtests = tests?.filter((test) =>
    test.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get current tests
  const indexOfLasttest = currentPage * testsPerPage;
  const indexOfFirsttest = indexOfLasttest - testsPerPage;
  const currenttests = filteredtests?.slice(indexOfFirsttest, indexOfLasttest);

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
            <p>Total Tests</p>
            <h3>{tests?.length ?? 0}</h3>
          </div>
        </div>

        <div className="actions">
          <button className="btn" onClick={() => NavigateToAddTest()}>
            Add Lab Test
          </button>
          <input
            type="text"
            className="search-input"
            placeholder="Search By Name"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <div className="banner">
          <h5>Pathology</h5>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Case ID</th>
                <th>Patient Name</th>
                {/* <th>Quantity</th> */}
                <th>Sample Collected Date</th>
                <th>Expected Completion Date</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currenttests && currenttests.length > 0
                ? currenttests.map((test) => (
                    <tr key={test?._id}>
                      <td>{test.name ?? "-"}</td>
                      <td>{test.case_id ?? "-"}</td>
                      <td>{test.patientName ?? "-"}</td>
                      <td>
                        {test?.sample_collected_date
                          ? `${moment(test?.sample_collected_date).format(
                              "Do MMMM YY"
                            )}`
                          : "-"}
                      </td>
                      <td>
                        {test?.expected_date
                          ? `${moment(test?.expected_date).format(
                              "Do MMMM YY"
                            )}`
                          : "-"}
                      </td>
                      <td>{test.price}</td>
                      {/*  <td>
                       {test?.fssaiNo.trim() ? test?.fssaiNo : "-"}
                      </td> */}
                      <td onClick={() => NavigateToAddTest(test?._id)}>
                        <a className="custom-link">Edit</a>
                      </td>
                    </tr>
                  ))
                : "No tests Found!"}
            </tbody>
          </table>
          <Pagination
            itemsPerPage={testsPerPage}
            totalItems={filteredtests.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </section>
    </>
  );
};

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
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

export default Pathology;
