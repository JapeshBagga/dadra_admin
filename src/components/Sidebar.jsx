import React, { useContext, useState } from "react";
import { TiHome } from "react-icons/ti";
import { RiLogoutBoxLine, RiBillLine } from "react-icons/ri";
import { AiFillMessage } from "react-icons/ai";
import { GiHamburgerMenu, GiMedicines } from "react-icons/gi";
import { FaUserDoctor } from "react-icons/fa6";
import { MdAddModerator } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";
import { BiScan } from "react-icons/bi";

import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";
import { useNavigate } from "react-router-dom";
import SERVER_URL from "../env";

const Sidebar = () => {
  const navigateTo = useNavigate();
  const [show, setShow] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const handleLogout = async () => {
    await axios
      .get(`${SERVER_URL}/api/v1/user/admin/logout`, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        window.location.reload();
      })
      .catch((err) => {
        toast.error(err?.response?.data.message);
      });
  };

  const gotoHomePage = () => {
    navigateTo("/");
    setShow(!show);
  };
  const gotoDoctorsPage = () => {
    navigateTo("/doctors");
    setShow(!show);
  };
  const gotoMessagesPage = () => {
    navigateTo("/messages");
    setShow(!show);
  };
  const gotoAddNewDoctor = () => {
    navigateTo("/doctor/addnew");
    setShow(!show);
  };
  const gotoAddNewAdmin = () => {
    navigateTo("/admin/addnew");
    setShow(!show);
  };

  const goToPharmacy = () => {
    navigateTo("/pharmacy");
    setShow(!show);
  };
  const goToPathology = () => {
    navigateTo("/pathology");
    setShow(!show);
  };
  const gotoBillingPage = () => {
    navigateTo("/billing");
    setShow(!show);
  };

  return (
    <>
      <nav
        style={!isAuthenticated ? { display: "none" } : { display: "flex" }}
        className={show ? "show sidebar" : "sidebar"}
      >
        <div className="links">
          <TiHome onClick={gotoHomePage} />
          {/* <FaUserDoctor onClick={gotoDoctorsPage} /> */}
          {/* <MdAddModerator onClick={AddNewOPD} /> */}
          {/* <IoPersonAddSharp onClick={gotoAddNewDoctor} /> */}
          <RiBillLine onClick={gotoBillingPage} />
          <GiMedicines onClick={goToPharmacy} />
          <BiScan onClick={goToPathology} />
          <RiLogoutBoxLine onClick={handleLogout} /> 
        </div>
      </nav>
      <div
        className="wrapper"
        style={!isAuthenticated ? { display: "none" } : { display: "flex" }}
      >
        <GiHamburgerMenu className="hamburger" onClick={() => setShow(!show)} />
      </div>
    </>
  );
};

export default Sidebar;
