import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from "@chakra-ui/react"

function App() {
  return (
    <Box minh = {"100vh"} display = "flex" alignItems = "center" justifyContent = "center">
      {/* <Navbar /> */}
      <Routes>
        <Route path = "/" element = {<HomePage />} />
        <Route path = "/create" element = {<CreatePage />} />
      </Routes>
    </Box>
  )
}

export default App;
