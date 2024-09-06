// import React from "react";
// import { Box, Typography, Button, IconButton, Menu, MenuItem } from "@mui/material";
// import { AssignmentInd, AccountCircle, Logout } from '@mui/icons-material';
// import { useNavigate } from "react-router-dom";
// import Cookies from 'js-cookie';

// const Header = () => {
//   const navigate = useNavigate();
//   const [anchorEl, setAnchorEl] = React.useState(null);
//   const open = Boolean(anchorEl);

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleLogout = () => {
//     Cookies.remove('authToken');
//     navigate('/');
//   };

//   return (
//     <Box
//       display="flex"
//       alignItems="center"
//       justifyContent="space-between"
//       padding="16px"
//       bgcolor="primary.main"
//       color="white"
//       position="fixed"
//       top={0}
//       left={0}
//       right={0}
//       zIndex={1000}
//     >
//       <Box display="flex" alignItems="center">
//         <AssignmentInd fontSize="large"/>
//         <Typography variant="h6" sx={{ cursor: "pointer" }}>
//           Task Manager
//         </Typography>
//       </Box>
//       <Box>
//         <Button color="inherit" onClick={() => navigate("/")}>
//           Home
//         </Button>
//         <Button color="inherit" onClick={() => navigate("/dashboard")}>
//           Analytics
//         </Button>
//         <IconButton
//           edge="end"
//           color="inherit"
//           onClick={handleClick}
//           aria-controls={open ? 'account-menu' : undefined}
//           aria-haspopup="true"
//         >
//           <AccountCircle />
//         </IconButton>
//         <Menu
//           id="account-menu"
//           anchorEl={anchorEl}
//           open={open}
//           onClose={handleClose}
//           PaperProps={{
//             elevation: 0,
//             sx: {
//               overflow: 'visible',
//               filter: 'drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.2))',
//               mt: 1.5,
//               '& .MuiAvatar-root': {
//                 width: 32,
//                 height: 32,
//                 ml: -0.5,
//                 mr: 1,
//               },
//               '&:before': {
//                 content: '""',
//                 display: 'block',
//                 position: 'absolute',
//                 top: 0,
//                 right: 14,
//                 width: 10,
//                 height: 10,
//                 bgcolor: 'background.paper',
//                 transform: 'translateY(-50%) rotate(45deg)',
//                 zIndex: 0,
//               },
//             },
//           }}
//           transformOrigin={{ horizontal: 'right', vertical: 'top' }}
//           anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
//         >
//           <MenuItem onClick={handleLogout}>
//             <Logout />
//             Logout
//           </MenuItem>
//         </Menu>
//       </Box>
//     </Box>
//   );
// };

// export default Header;

import React, { useEffect, useState } from "react";
import { Box, Typography, Button, IconButton, Menu, MenuItem } from "@mui/material";
import { AssignmentInd, AccountCircle, Logout } from '@mui/icons-material';
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from 'js-cookie';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Check if user is logged in based on the presence of auth token
  useEffect(() => {
    const token = Cookies.get('authToken');
    setIsLoggedIn(!!token);
  }, [location]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    Cookies.remove('authToken');
    setIsLoggedIn(false); // Update the login status
    navigate('/', { replace: true }); // Prevent back navigation
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      padding="16px"
      bgcolor="primary.main"
      color="white"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
    >
      <Box display="flex" alignItems="center">
        <AssignmentInd fontSize="large" />
        <Typography variant="h6" sx={{ cursor: "pointer" }}>
          Task Manager
        </Typography>
      </Box>

      {isLoggedIn && (
        <Box>
          <Button color="inherit" onClick={() => navigate("/home")}>
            Home
          </Button>
          <Button color="inherit" onClick={() => navigate("/dashboard")}>
            Analytics
          </Button>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClick}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="account-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.2))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleLogout}>
              <Logout />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      )}
    </Box>
  );
};

export default Header;
