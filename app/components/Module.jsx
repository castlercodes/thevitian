"use client"
import "./style/Module.css"
import {useState} from "react"
import { FaChevronCircleDown, FaChevronCircleUp} from "react-icons/fa";
import { FaAtom } from "react-icons/fa";

function Module({module_number, module_name}) {

  const [window_display, setWindowDisplay] = useState("none");

  const handleWindowClick = () => {
    if(window_display == "") setWindowDisplay("none");
    else setWindowDisplay("");
  }
  
  return (
    <div className="module" onClick = {handleWindowClick}>
      <div className="module_heading">
        <div> Module {module_number} {module_name} </div>
        <div style={{display:`${window_display}`}} className="circle_down"> <FaChevronCircleDown /> </div>
        <div style={{display:`${window_display == "none" ? "" : "none"}`}} className="circle_down"> <FaChevronCircleUp /> </div>
      </div>

      <div style={{display:`${window_display}`}}></div>
    </div>
  )
}

export default Module
