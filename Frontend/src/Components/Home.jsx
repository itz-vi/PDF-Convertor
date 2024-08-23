import React, { useState } from "react";
import axios from "axios";
const Home = () => {

  const [selectedFile, setSelectedFile] = useState(null)
  const [convert, setConvert] = useState("")
  const [dawnloadError, setDawnloadError] = useState("")

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setConvert("please select a file");
      return;
    }
    const formData = new FormData()
    formData.append("file", selectedFile)
    try {
      const response = await axios.post("http://localhost:3000/convertFile", formData, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute("download", selectedFile.name.replace(/\.[^/.]+$/, "") + ".pdf")
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
      setSelectedFile(null)
      setDawnloadError("")
      setConvert("File Convertd Successfully")
    } catch (error) {
      console.log(error)
      if (error.response && error.response.status == 400) {
        setDawnloadError("Error occurred:", error.response.data.message);
      } else {
        setConvert("");
      }
    }
  };
  return (
    <>
      <div className="max-w-screen-2xl mx-auto container px-6 py-3 md:px-40">
        <div className="flex h-screen items-center justify-center">
          <div className="border-2 border-dashed px-4 py-2 md:px-8 md:py-6 border-indigo-400 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-4">
              Convert Word To PDF Online
            </h1>
            <p className="text-sm text-center mb-5">
              Easily convert Word documents to PDF formet online, without having
              to install aay software.
            </p>
            <div className="flex flex-col items-center space-y-4">
              <input type="file" onChange={handleFileChange} accept=".doc,.docx" className="hidden" id="FileInput" />
              <label htmlFor="FileInput" className="w-full flex items-center justify-center px-4 py-6 bg-gray-100  hover:text-white text-gray-700 rounded-lg shadow-lg cursor-pointer border-blue-300 hover:bg-blue-700 duration-300">
                <span className="text-3xl mr-2">📂 {selectedFile ? selectedFile.name : "Choose File"}</span>
              </label>
              <button
                onClick={handleSubmit}
                disabled={!selectedFile} className="text-white bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 disabled:pointer-events-none rounded-lg duretion-300 font-bold px-4 py-2">Convert File</button>
              {convert && (
                <div className="text-center text-green-500">{convert}</div>
              )}
              {dawnloadError && (
                <div className="text-center text-red-500">{dawnloadError}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
