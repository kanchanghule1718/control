import React, { useState, useEffect } from 'react';

const Base_Url = sessionStorage.getItem('BASEURL');
const AuthApiKey = sessionStorage.getItem('APIKEY');

const Report = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [reportType, setReportType] = useState('weekly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [Msg, setMsg]=useState('')

  // Fetch locations on component mount
  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${Base_Url}/get-all-locations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ apiKey: AuthApiKey }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch locations');
        }

        const data = await response.json();
        if (data.success && data.locations) {
          setLocations(data.locations);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // const handleGenerateReport = () => {
  //   console.log('Selected Location ID:', selectedLocationId);
  //   console.log('Selected Report Type:', reportType);
  //   // Add logic to generate Excel or trigger backend download here
  // };

  const handleGenerateReport = async () => {
    if (!selectedLocationId || !reportType) {
      setMsg("Please select both location and report type.");
      return;
    }
  
    try {
     // const res = await fetch(`http://localhost:5000/generate-location-report`, {
         const res = await fetch(`${Base_Url}/generate-location-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: AuthApiKey,
          locationId: selectedLocationId,
          filterType: reportType
        })
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        setMsg("Failed to generate report: " + errorData.message);
        return;
      }
  
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Pest_Report_${reportType}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating report:", error);
      setMsg("Something went wrong while generating the report!");
    }
  };
  
  return (
    <>
      <h3 className='m-3' style={{color:"rgb(32, 146, 32)"}}>Excel Report</h3>
      <div className='container'>
        

        <div className='row'>
          {/* Location Dropdown */}
          <div className='col col-lg-4 col-md-6 col-12 mb-3'>
            <label style={{color:"rgb(143 171 96)"}}>Select Location</label>
            <select
              className='form-control'
              value={selectedLocationId}
              onChange={(e) => setSelectedLocationId(e.target.value)}
            >
              <option value=''>-- Select Location --</option>
              {locations.map((loc) => (
                <option key={loc.pec_loc_id} value={loc.pec_loc_id}>
                  {loc.pec_loc_name}
                </option>
              ))}
            </select>
          </div>

          {/* Report Type Dropdown */}
          <div className='col col-lg-4 col-md-6 col-12 mb-3'>
            <label style={{color:"rgb(143 171 96)"}}>Select Report Type</label>
            <select
              className='form-control'
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value='weekly'>Weekly</option>
              <option value='monthly'>Monthly</option>
            </select>
          </div>

          {/* Generate Button */}
          <div className='col col-lg-4 col-md-6 col-12 mb-3 d-flex align-items-end'>
            <button className='btn w-80' onClick={handleGenerateReport}>
              Generate Excel
            </button>
          </div>
        </div>
        <p style={{ color: 'green',textAlign:'center' }}>{Msg}</p>
        {loading && <p style={{ color: 'green',textAlign:'center' }}>Loading locations...</p>}
        {error && <p style={{ color: 'red',textAlign:'center' }}>{error}</p>}
      </div>
    </>
  );
};

export default Report;
