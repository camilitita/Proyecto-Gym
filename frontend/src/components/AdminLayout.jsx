import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import MamisFitnessLogoSVG from '../assets/MamisFitnessLogoSVG.png';
import './AdminLayout.css';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Eliminar datos de sesión
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    // 2. Redirigir al login y bloquear retroceso
    navigate("/", { replace: true });
  };

  return (
    <div id="wrapper">
      {/* Sidebar */}
      <ul className="navbar-nav sidebar accordion" id="accordionSidebar">
        {/* Sidebar - Brand */}
        <Link className="sidebar-brand d-flex align-items-center justify-content-center" to="/admin">
          <div className="sidebar-brand-icon">
            <img src={MamisFitnessLogoSVG} alt="Mamis Fitness Logo" className="login-logo" />
          </div>
          <div className="sidebar-brand-text">MamisFitness</div>
        </Link>

        {/* Divider */}
        <hr className="sidebar-divider my-0" />

        {/* Nav Item - Dashboard */}
        <li className="nav-item active">
          <Link className="nav-link" to="/admin">
            <i className="fas fa-fw fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </Link>
        </li>

        {/* Divider */}
        <hr className="sidebar-divider" />

        {/* Heading */}
        <div className="sidebar-heading">Módulos</div>

        {/* Nav Item - Usuarios */}
        <li className="nav-item">
          <Link className="nav-link" to="/admin/usuarios">
            <i className="fas fa-fw fa-users"></i>
            <span>Usuarios</span>
          </Link>
        </li>

        {/* Nav Item - Membresias */}
        <li className="nav-item">
          <Link className="nav-link" to="/admin/membresias">
            <i className="fas fa-fw fa-credit-card"></i>
            <span>Membresías</span>
          </Link>
        </li>

        {/* Nav Item - Escaneo QR */}
        <li className="nav-item">
          <Link className="nav-link" to="/admin/scan">
            <i className="fas fa-fw fa-qrcode"></i>
            <span>Escaneo QR</span>
          </Link>
        </li>

        {/* Nav Item - Registro de Accesos */}
        <li className="nav-item">
          <Link className="nav-link" to="/admin/registro-accesos">
            <i className="fas fa-fw fa-book"></i>
            <span>Registro de Accesos</span>
          </Link>
        </li>

        {/* Divider */}
        <hr className="sidebar-divider d-none d-md-block" />

        {/* Logout Button */}
        <li className="nav-item">
          <button 
            className="logout nav-link btn btn-link text-left w-100"
            onClick={handleLogout}
          >
            <i className="fas fa-fw fa-sign-out-alt"></i>
            <span>Cerrar Sesión</span>
          </button>
        </li>
      </ul>
      {/* End of Sidebar */}

      {/* Content Wrapper */}
      <div id="content-wrapper" className="d-flex flex-column">
        {/* Main Content */}
        <div id="content">
          {/* Topbar */}
          <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
            {/* Topbar Navbar */}
            <ul className="navbar-nav ml-auto">
              {/* Nav Item - User Information */}
              <li className="nav-item dropdown no-arrow">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="userDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <span className="mr-2 d-none d-lg-inline text-gray-600 small">
                    Douglas McGee
                  </span>
                  <img
                    className="img-profile rounded-circle"
                    src="https://source.unsplash.com/Mv9hjnz_J8U/60x60"
                    alt="Profile"
                  />
                </a>
              </li>
            </ul>
          </nav>
          {/* End of Topbar */}

          {/* Begin Page Content */}
          <div className="p-0">
            {/* Aquí se renderizará el contenido de la ruta anidada */}
            <Outlet />
          </div>
          {/* /.container-fluid */}
        </div>
        {/* End of Main Content */}

        {/* Footer */}
        <footer className="sticky-footer bg-white">
          <div className="container my-auto">
            <div className="copyright text-center my-auto">
              <span>Copyright &copy; Tu Gimnasio 2025</span>
            </div>
          </div>
        </footer>
        {/* End of Footer */}
      </div>
      {/* End of Content Wrapper */}
    </div>
  );
};

export default AdminLayout;
