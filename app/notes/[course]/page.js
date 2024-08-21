"use client"
import {useState, useEffect} from 'react'
import Module from '@/app/components/Module.jsx'

function page() {
  const [moduleNames, setModuleNames] = useState([]);

  useEffect(() => {
      setModuleNames(JSON.parse(localStorage.getItem('moduleNames')));
  }, [])

  
  return (
    <div>
      {moduleNames && moduleNames.map((moduleName, idx) => (
        <Module module_number={idx} module_name={moduleName}/>
      ))}
    </div>
  )
}

export default page
