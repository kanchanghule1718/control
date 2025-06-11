import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddCustomer = () => {
  return (
    <div className="container mt-4">
      <h3><i className="fas fa-phone-alt"></i> Contact Details</h3>
      <div className="row g-3">
        {[
          { label: 'Customer Name', required: true, type: 'text', placeholder: 'Enter Customer Name' },
          { label: 'Company Name', type: 'text', placeholder: 'Enter Company Name' },
          { label: 'Mobile No.', type: 'text', placeholder: 'Enter Mobile No.' },
          { label: 'Alternate Mobile No.', type: 'text', placeholder: 'Enter Alternate Mobile No.' },
          { label: 'Email Id', type: 'email', placeholder: 'Enter Email Id.' },
          { label: 'Website', type: 'text', placeholder: 'Enter Website' },
          { label: 'Contact Person', type: 'text', placeholder: 'Enter Contact Person' },
          { label: 'Landline No.', type: 'text', placeholder: 'Enter Landline No.' }
        ].map(({ label, required, type, placeholder }, index) => (
          <div className="col-md-4" key={index}>
            <label className="form-label">{label} {required && <span className="text-danger">*</span>}</label>
            <input type={type} className="form-control" placeholder={placeholder} />
          </div>
        ))}
      </div>

      <h3 className="mt-4">Address Details</h3>
      <div className="row g-3">
        <div className="col-md-4">
          <label className="form-label">Address</label>
          <input type="text" className="form-control" placeholder="Enter Address" />
        </div>
        {[
          { label: 'State', options: ['Select State', 'Maharashtra'] },
          { label: 'District', options: ['Select District', 'Thane', 'Raigad'] },
          { label: 'City', options: ['Select City', 'Kharghar', 'Kamothe', 'Kalamboli'] }
        ].map(({ label, options }, index) => (
          <div className="col-md-4" key={index}>
            <label className="form-label">{label}</label>
            <select className="form-select">
              {options.map((option, i) => <option key={i}>{option}</option>)}
            </select>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <button className="btn">Submit</button>
      </div>
    </div>
  );
};

export default AddCustomer;
