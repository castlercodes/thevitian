import { FaChevronCircleDown } from "react-icons/fa";
import { FaAtom } from "react-icons/fa";

function Module({module_number, module_name}) {
  return (
    <div className="module">
      <div className="module_heading">
        <div> Module {module_number} {module_name} </div>
        <div className="circle_down"> <FaChevronCircleDown /> </div>
      </div>
    </div>
  )
}

export default Module
