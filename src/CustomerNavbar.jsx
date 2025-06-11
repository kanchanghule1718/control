import React from 'react'
import logo1 from "./assets/pecopp-logo.png";


export const CustomerNavbar = () => {
  return (
   <>
   <nav class="navbar navbar-expand-lg ">
  <div class="container-fluid">
    <a class="navbar-brandd" href="#"><img src={logo1} style={{height:"80px",width:"120px"}}></img></a>
   <p> Welcome Nandu!</p>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-2">
        <li>
        Logout
        </li>
      </ul>   
    </div>

  </div>
</nav>
   </>
  )
}
