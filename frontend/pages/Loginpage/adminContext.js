import React, { createContext, useState } from "react";

// Create the context
export const AdminContext = createContext();

// Create the provider component
export const AdminProvider = ({ children }) => {
  const [email, setAdminEmail] = useState(null); // State to store the admin email

  console.log("Admin Email in Provider:", email); // Log the admin email for debugging

  return (
    <AdminContext.Provider
      value={{ adminEmail: email, setAdminEmail: setAdminEmail }}
    >
      {children}
    </AdminContext.Provider>
  );
};
