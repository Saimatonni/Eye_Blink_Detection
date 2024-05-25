import React, {useRef, useEffect } from 'react'
import { container, Row, Button, Container } from 'reactstrap'
import { NavLink, Link, useLocation } from 'react-router-dom';
import './Header.css'
import { useNavigate } from "react-router-dom";


const nav_Link = [
  // {
  //   path: '/login',
  //   display: 'Login'
  // },
  // {
  //   path: '/notification',
  //   display: 'Notification'
  // },
  // {
  //   path: '/information',
  //   display: 'Information'
  // },
  {
    path: '/about',
    display: 'About Us'
  },
  {
    path: '/contact',
    display: 'Contact Us'
  }
]

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navigateToCountBlink = () => {
    navigate("/register");
  };

  return (
    <header className="Header" >
       <Container>
        <Row>
          <div className='nav_wrapper d-flex align-item-center justify-content-between'>
            <div className="text" onClick={navigateToCountBlink}>
            Measure Attention
            </div>

            <div className="navigation">
              <ul className="menu d-flex align-item-center">
                {nav_Link.map((item, index) => (
                  <li className="nav_item" key={index}>
                    {(location.pathname === '/login' || location.pathname === '/register') ? (
                      (item.path === '/information' || item.path === '/about' || item.path === '/contact') && (
                        <NavLink
                          to={item.path}
                          className={(navClass) => (navClass.isActive ? 'active__link' : '')}
                        >
                          {item.display}
                        </NavLink>
                      )
                    ) : (
                      <NavLink
                        to={item.path}
                        className={(navClass) => (navClass.isActive ? 'active__link' : '')}
                      >
                        {item.display}
                      </NavLink>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Row>
      </Container> 
      
      </header>
  )
}

export default Header