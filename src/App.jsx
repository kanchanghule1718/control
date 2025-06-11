import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';

import './App.css';
import Login from './Components/Login';
import Home from './Components/Home';
import "bootstrap/dist/css/bootstrap.min.css";
import Dashboard from './Components/Dashboard';
import AddCustomer from './Components/AddCustomer';
import AddLocation from './Components/AddLocation';
import AddBuilding from './Components/AddBuilding';
import AddFloor from './Components/AddFloor';
import AddRoom from './Components/AddRoom';
import AddEmployee from './Components/AddEmployee';
import RoomCheckPoint from './Components/RoomCheckPoint';
import CheckPointStatus from './Components/CheckPointStatus';
import Reports from './Components/Report';
import TechHome from './TechnicalComponent/TechHome';
import TechDashboard from './TechnicalComponent/TechDashboard';
import CustHome from './CustomerPortal/CustHome';
import CustomerDashboard from './CustomerPortal/CustomerDashboard';
import CustReport from './CustomerPortal/CustReport';
import { NewCustomer } from './NewCustomer';
import { AllLocation } from './Components/AllLocation';
import { LocationDetail } from './Components/LocationDetail';
import { BuidlingDetails } from './Components/BuidlingDetails';
import { FloorDetails } from './Components/FloorDetails';



//const BASEURL='http://midrserver.co.in:5000'            //for without ssl.
  const BASEURL='https://midrserver.co.in:5001'          //for ssl.
//const BASEURL='http://192.168.0.139:5000'                 //local
const APIKEY='ytfkenaojjawmbjnbsyyj-ppocpep'
sessionStorage.setItem('BASEURL',BASEURL)
sessionStorage.setItem('APIKEY',APIKEY)

// const baseName = '/pecopp';                // Specifying base name here for local
const baseName = '/pecopp_pestcontrol';                   // Specifying base name here for live

function App() {
  return (
    <Router basename={baseName}>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* Admin portal div start here */}
        <Route path="/admin" element={<Home />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="add-new-customer" element={<AddCustomer />} />
          <Route path="add-customer-location" element={<AddLocation />} />
          <Route path="add-building" element={<AddBuilding />} />
          <Route path="add-floor" element={<AddFloor />} />
          <Route path="add-room" element={<AddRoom />} />
          <Route path="add-employee" element={<AddEmployee />} />

          <Route path="checkpoint-status" element={<CheckPointStatus />} />
          <Route path="all-Location" element={<AllLocation />} />
          <Route path="LocationDetail" element={<LocationDetail />} />
          <Route path="BuildingDetail" element={<BuidlingDetails />} />
          <Route path="FloorDetail" element={<FloorDetails />} />
          <Route path="reports" element={<Reports />} />
        </Route>


        {/* Technical Portal Routing starts here */}
        <Route path="/technical" element={<TechHome/>}>
          <Route index element={<TechDashboard/>} />
          <Route path="techdashboard" element={<TechDashboard/>} />
          <Route path="room-checkpoint" element={<RoomCheckPoint />} />
        </Route>

        {/*Customer-Portal Routing starts here  */}
         <Route path="/Customer" element={<CustHome/>}> 
        {/* <Route index element={<CustomerDashboard/>} /> */}
        {/* <Route path="CustomerDashboard" element={<CustomerDashboard/>} /> */}
        <Route path="report" element={<CustReport />} />
        </Route> 


        {/*Customer-Portal Routing starts here  */}
        {/* <Route path="/Customer" element={<NewCustomer/>}> */}
        {/* <Route index element={<CustomerDashboard/>} /> */}
        {/* <Route path="CustomerDashboard" element={<CustomerDashboard/>} /> */}
        {/* <Route path="report" element={<CustReport />} /> */}
        {/* </Route> */}
      </Routes>
    </Router>
  );
}

export default App;




