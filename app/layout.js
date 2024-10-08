import { Inter } from "next/font/google";
import "./globals.css";
import SideBar from "./components/SideBar";
import NavBar from "./components/NavBar";
import { Suspense } from "react"
import Loading from "./loading";
import { UserProvider } from "./store/UserProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "thevitian",
  description: "The all in one website to survive in VIT",
};

export default function RootLayout({ children }) {
  return (
    <UserProvider>
    <html lang="en">
        <body className={inter.className}>
          <div style={{display: "flex", flexDirection: "column"}}>
            <NavBar />
            <div style={{display: "flex", flexDirection: "row"}}>
              <div><SideBar /></div>
              <div style={{flex: 1}}>{children}</div>
            </div>
          </div>
        </body>
      </html>
    </UserProvider>
  );
}
