import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div id="wrapper">
      {/* Sidebar */}
      <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
        {/* Sidebar - Brand */}
        <Link className="sidebar-brand d-flex align-items-center justify-content-center" to="/admin">
          <div className="sidebar-brand-icon rotate-n-15">
            <i className="fas fa-laugh-wink"></i>
          </div>
          <div className="sidebar-brand-text mx-3">Gym Admin</div>
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
        <div className="sidebar-heading">
          Módulos
        </div>

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
        <li className="nav-item">
          <Link className="nav-link" to="/admin/registro-accesos">
            <i className="fas fa-fw fa-book"></i>
            <span>Registro de Accesos</span>
          </Link>
        </li>

        {/* Divider */}
        <hr className="sidebar-divider d-none d-md-block" />
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
                <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <span className="mr-2 d-none d-lg-inline text-gray-600 small">Douglas McGee</span>
                  <img className="img-profile rounded-circle" src="https://source.unsplash.com/Mv9hjnz_J8U/60x60" alt="Profile"/>
                </a>
                {/* Dropdown - User Information */}
                <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
                  <a className="dropdown-item" href="#">
                    <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                    Profile
                  </a>
                  <div className="dropdown-divider"></div>
                  <a className="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
                    <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                    Logout
                  </a>
                </div>
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