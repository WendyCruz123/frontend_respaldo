// 'use client';

// import React, { createContext, useContext, useState, useEffect } from 'react';

// interface AuthContextProps {
//   accessToken: string | null;
//   email: string | null;
//   setAccessToken: (token: string | null) => void;
//   setEmail: (email: string | null) => void;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [accessToken, setAccessTokenState] = useState<string | null>(null);
//   const [email, setEmailState] = useState<string | null>(null);

//   useEffect(() => {
//     const token = sessionStorage.getItem('access_token');
//     const emailStored = sessionStorage.getItem('user_email');
//     if (token) setAccessTokenState(token);
//     if (emailStored) setEmailState(emailStored);
//   }, []);

//   const setAccessToken = (token: string | null) => {
//     if (token) {
//       sessionStorage.setItem('access_token', token);
//     } else {
//       sessionStorage.removeItem('access_token');
//     }
//     setAccessTokenState(token);
//   };

//   const setEmail = (email: string | null) => {
//     if (email) {
//       sessionStorage.setItem('user_email', email);
//     } else {
//       sessionStorage.removeItem('user_email');
//     }
//     setEmailState(email);
//   };

//   const logout = () => {
//     setAccessToken(null);
//     setEmail(null);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         accessToken,
//         email,
//         setAccessToken,
//         setEmail,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = (): AuthContextProps => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth debe usarse dentro de un AuthProvider');
//   }
//   return context;
// };
