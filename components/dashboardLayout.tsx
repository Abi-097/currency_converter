"use client"; // This is a Client Component

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Box, useMediaQuery, Theme, Tooltip } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import SettingsIcon from "@mui/icons-material/Settings";

const drawerWidth = 240;
const mobileDrawerHeight = 56;

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
}

const menuItems: MenuItem[] = [
  { text: "Currency Converter", icon: <CurrencyExchangeIcon />, path: "/dashboard/currency-converter" },
  { text: "Home", icon: <HomeIcon />, path: "/dashboard" },
  { text: "Settings", icon: <SettingsIcon />, path: "/dashboard/settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  return (
    <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", minHeight: "100vh" }}>
      {/* Sidebar/Topbar */}
      <Drawer
        variant="permanent"
        sx={{
          width: isMobile ? "100%" : drawerWidth,
          height: isMobile ? mobileDrawerHeight : "100%",
          flexShrink: 0,
          zIndex: 1200, // Ensure it stays above other content
          "& .MuiDrawer-paper": {
            width: isMobile ? "100%" : drawerWidth,
            height: isMobile ? mobileDrawerHeight : "100%",
            boxSizing: "border-box",
            position: "fixed", // Keep it fixed at the top on mobile
            top: 0,
            left: 0,
            overflowX: "hidden",
            overflowY: "hidden",
          },
        }}
      >
        {/* Remove Toolbar from Drawer since we're handling spacing differently */}
        <List sx={{ 
          display: "flex", 
          flexDirection: isMobile ? "row" : "column",
          justifyContent: isMobile ? "space-between" : "flex-start",
          padding: isMobile ? "0 8px" : "8px 0",
          height: isMobile ? mobileDrawerHeight : "auto",
          alignItems: "center",
          gap: isMobile ? 0 : 1,
          marginTop: isMobile ? 0 : "64px", // Account for app bar height on desktop
        }}>
          {menuItems.map((item) => (
            <ListItem 
              key={item.text} 
              disablePadding
              sx={{ 
                width: isMobile ? `${100 / menuItems.length}%` : "100%",
                flex: isMobile ? "1" : "none",
              }}
            >
              <ListItemButton
                selected={pathname === item.path}
                onClick={() => router.push(item.path)}
                sx={{
                  justifyContent: "center",
                  padding: isMobile ? "8px 4px" : "8px 16px",
                  height: isMobile ? mobileDrawerHeight : "auto",
                }}
              >
                <Tooltip title={item.text} placement={isMobile ? "bottom" : "right"} arrow>
                  <ListItemIcon sx={{ 
                    minWidth: "auto",
                    marginRight: !isMobile && item.text ? 2 : 0 
                  }}>
                    {item.icon}
                  </ListItemIcon>
                </Tooltip>
                {!isMobile && <ListItemText primary={item.text} />}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: isMobile ? "100%" : `calc(100% - ${drawerWidth}px)`,
          marginTop: isMobile ? `${mobileDrawerHeight}px` : 0,
        //   marginLeft: isMobile ? 0 : `${drawerWidth}px`,
        }}
      >
        <Toolbar /> {/* Keep this for consistent spacing */}
        {children}
      </Box>
    </Box>
  );
}