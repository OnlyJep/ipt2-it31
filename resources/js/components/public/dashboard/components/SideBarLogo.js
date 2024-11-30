const SideBarLogo = () => {
  const logoStyle = {
    width: '180px', // Adjust this value to make the logo smaller or larger
    height: 'auto', // Keep the aspect ratio intact
    transition: 'width 0.3s ease', // Optional: smooth transition if size changes
    marginTop: '16px', // Adjust this value to move the logo slightly downwards
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',  // Horizontally center the logo
    alignItems: 'center',      // Vertically center the logo
    height: '60px',            // Adjust the container height as needed
  };

  return (
    <div className="logo" style={containerStyle}>
      <img
        src={require('../../../../../../public/images/sidebarlogo.svg').default}
        alt="Sidebar Logo"
        style={logoStyle} // Apply inline styles to the image
      />
    </div>
  );
};

export default SideBarLogo;
