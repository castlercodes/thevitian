"use client";
import {useState, useEffect} from 'react'
import "./style/NavBar.css";
import { auth, GoogleAuthProvider, signInWithPopup } from "@/lib/firebase"

function NavBar() {
  const [currUser, setCurrUser] = useState("");

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrUser(parsedUser.displayName);
    } 
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user.displayName;
      const email = result.user.email;

      // Check if email domain is allowed
      if (email.endsWith("@vitstudent.ac.in") || email.endsWith("@vitbhopal.ac.in")) {
        console.log("Login successful:", user);
        // Store user information in local storage or session storage
        sessionStorage.setItem("user", JSON.stringify(result.user));
        setCurrUser(user);
      } else {
        alert("Access restricted to VIT students only.");
        await auth.signOut(); // Sign out the user if not allowed
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogOut = async () => {
    await auth.signOut();
    sessionStorage.removeItem("user");
    setCurrUser("");
  }

  return (
    <div className="navbar">
        <div className="website_name">The Vitian</div>
        {currUser === "" ?
          (
          <div className="login_button" onClick={handleLogin}> Login In </div>
          ):(
          <div style={{display: "flex", gap:"10px", alignItems:"center"}}>
            <div>Hello {currUser} </div>
            <div className="login_button" onClick={handleLogOut}>Sign Out </div>
          </div>
          )
        }
    </div>
  )
}

export default NavBar
