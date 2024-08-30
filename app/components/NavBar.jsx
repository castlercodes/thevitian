"use client";
import { useState, useEffect } from "react";
import "./style/NavBar.css";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, GoogleAuthProvider, signInWithPopup, db } from "@/lib/firebase";
import { FaMoneyBillAlt } from "react-icons/fa";
import { useUser } from "../store/UserProvider";

function NavBar() {
  const {currUser, setCurrUser} = useUser();
  const [currPoints, setCurrPoints] = useState(0);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrUser(parsedUser);
      setCurrPoints(parsedUser.points)
    } 
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const email = user.email;

      if (email.endsWith("@vitstudent.ac.in") || email.endsWith("@vitbhopal.ac.in")) {
        console.log("Login successful:", user.displayName);

        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          await setDoc(userRef, {
            displayName: user.displayName,
            email: user.email,
            points: 50,
          });
          sessionStorage.setItem("user", JSON.stringify({displayName: user.displayName, points: user.points, email: user.email, id: user.uid }));
          setCurrPoints(50);
        } else {
          setCurrPoints(userDoc.data().points);
          sessionStorage.setItem("user", JSON.stringify({displayName: user.displayName, points: userDoc.data().points, email: userDoc.data().email, id: user.uid }));
        }

        setCurrUser(user);

      } else {
        alert("Access restricted to VIT students only.");
        await auth.signOut();
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogOut = async () => {
    await auth.signOut();
    sessionStorage.removeItem("user");
    setCurrUser({});
    setCurrPoints(0);
  };

  return (
    <div className="navbar">
      <div className="website_name">The Vitian</div>
      {Object.keys(currUser).length == 0 ? (
        <div className="login_button" onClick={handleLogin}>Login</div>
      ) : (
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <FaMoneyBillAlt style={{ marginRight: "5px" }} /> 
            <div>{currUser.points}</div>
          </div>
          {console.log(currUser)}
          <div className="user_name">Hello {currUser.displayName}</div>
          <div className="login_button" onClick={handleLogOut}>Sign Out</div>
        </div>
      )}
    </div>
  );
}

export default NavBar;
