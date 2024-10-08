"use client"
import {useState} from 'react'
import "./style/SideBar.css"
import { GoSidebarCollapse, GoSidebarExpand} from "react-icons/go";
import { MdHome } from "react-icons/md";
import { FaBook } from "react-icons/fa";
import { IoIosStats } from "react-icons/io";
import { useRouter } from 'next/navigation';


function SideBar() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const toggleSidebar = () => {
        setIsOpen(isOpen)
    }

    const goToHome = () => {
        router.push('/');
    }

    const goToNotes = () => {
        router.push('/notes');
    }

  return (
    <div>
      {isOpen ? 
        <div className="opened_side_bar" onClick={toggleSidebar}>
            <div> <GoSidebarCollapse/> </div>
        </div>
        :
        <div className="closed_side_bar" onClick={toggleSidebar}> 
            {/* <div> <GoSidebarExpand /> </div> */}
            <div className="icon" onClick={goToHome}> <MdHome /> </div>
            <div className="icon" onClick={goToNotes}> <FaBook/> </div>
            <div className="icon"> <IoIosStats /> </div>
        </div>
      }
    </div>
  )
}

export default SideBar
