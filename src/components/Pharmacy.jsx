import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import SERVER_URL from "../env";

const Pharmacy = () => {
  const navigateTo = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [medicinesPerPage] = useState(30);
  const { isAuthenticated, admin } = useContext(Context);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const { data } = await axios.get(`${SERVER_URL}/api/v1/pharmacy/all`, {
          withCredentials: true,
        });
        setMedicines(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchMedicines();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  const NavigateToAddMedicine = (id) => {
    if (!admin.canEdit) return toast.error("Restricted Access");
    id ? navigateTo("/pharmacy/addNew/" + id) : navigateTo("/pharmacy/addnew/");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredMedicines = medicines.filter((medicine) =>
    medicine.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get current medicines
  const indexOfLastMedicine = currentPage * medicinesPerPage;
  const indexOfFirstMedicine = indexOfLastMedicine - medicinesPerPage;
  const currentMedicines = filteredMedicines.slice(
    indexOfFirstMedicine,
    indexOfLastMedicine
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
            <p>Total medicines</p>
            <h3>{medicines?.length ?? 0}</h3>
          </div>
        </div>

        <div className="actions">
          <button className="btn" onClick={() => NavigateToAddMedicine()}>
            Add Medicine
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
          <h5>Pharmacy</h5>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>MRP</th>
                <th>Category</th>
                <th>Sale Price</th>
                <th>Quantity</th>
                <th>Expiry Date</th>
                <th>MFD Date</th>
                <th>FSSAI No.</th>
                <th>Batch No.</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentMedicines && currentMedicines.length > 0
                ? currentMedicines.map((medicine) => (
                    <tr key={medicine?._id}>
                      <td>{medicine.name ?? "-"}</td>
                      <td>
                        {medicine?.price ?? "-"}
                      </td>
                      
                      <td>{medicine.category ?? "-"}</td>
                      <td>
                        {medicine?.salePrice ?? "-"}
                      </td>
                      <td>{medicine.quantity ?? "-"}</td>
                      <td>
                        {medicine?.expiryDate
                          ? `${moment(medicine?.expiryDate).format(
                              "Do MMMM YY"
                            )}`
                          : "-"}
                      </td>
                      <td>
                        {medicine?.mfdDate
                          ? `${moment(medicine?.mfdDate).format("Do MMMM YY")}`
                          : "-"}
                      </td>
                      <td>
                        {medicine?.fssaiNo.trim() ? medicine?.fssaiNo : "-"}
                      </td>
                      <td>
                        {medicine?.batchNo?.trim() ? medicine?.batchNo : "-"}
                      </td>
                      <td onClick={() => NavigateToAddMedicine(medicine?._id)}>
                        <a className="custom-link">Edit</a>
                      </td>
                    </tr>
                  ))
                : "No medicines Found!"}
            </tbody>
          </table>
          <Pagination
            itemsPerPage={medicinesPerPage}
            totalItems={filteredMedicines.length}
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

export default Pharmacy;
