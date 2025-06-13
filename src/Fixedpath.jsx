import { useState } from "react";
import axios from "axios";
import Data from "./Data.json";
import CopyData from "./Copydata.json";
import {
  storeFileInIndexedDB,
  getFileFromIndexedDB,
  deleteFileFromIndexedDB,
} from "./utils/db";
import { toast } from "react-toastify";

const Fixedpath = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [index, setIndex] = useState();

  const filesObject = [
    {
      data: Data,
      type: "text/csv",
      filename: "revenue.csv",
    },
    {
      data: CopyData,
      type: "text/csv",
      filename: "copy.csv",
    },
  ];

  const handleToggle = async (ind) => {
    // console.log(ind);
    setIndex(ind);
    setIsOpen((prev) => (prev === ind ? null : ind));
    const { data, type, filename } = filesObject[ind];
    console.log(type, filename);
    const headers = Object.keys(data[0]).join(",") + "\n";
    // console.log(headers)
    const rows = data.map((obj) => Object.values(obj).join(",")).join("\n");
    // console.log(rows)
    const content = headers + rows;
    const blob = new Blob([content], { type: type });
    console.log(blob)
    await storeFileInIndexedDB(filename, blob);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (index === undefined || index === null) {
      // alert("No dataset selected.");
      toast.warning("No Dataset selected.")
      return;
    }

    const { type, filename } = filesObject[index];
    const blob = await getFileFromIndexedDB(filename);
    console.log(blob)
    if (!blob) {
      toast.error("File not found in IndexedDB.")
      // alert("File not found in IndexedDB.");
      return;
    }

    const file = new File([blob], filename, { type });
    console.log("file is : " + file)
    const formData = new FormData();
    formData.append("email", email);
    formData.append("attachment", file);

    try {
      const res = await axios.post(
        "http://localhost:8000/send_mail.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(res.data.message)
      // alert(res.data.message);
      await deleteFileFromIndexedDB(filename);
      console.log("File deleted from IndexedDB");
      setIsOpen(null);
      setEmail("");
    } catch (err) {
      // alert("Error sending email");
      toast.error("Error sending email");
      console.error(err);
    }
  };

  return (
    <div className="p-4 ml-32">
      <h2 className="text-2xl font-bold mb-8 text-center">
        Month-Year Revenue Data
      </h2>

      {/* Tables Side-by-Side */}
      <div className="flex flex-col lg:flex-row justify-center gap-8">
        {/* Data 1 Section */}
        <div className="w-full lg:w-1/2">
          <table className="w-3/4 bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-left">
                <th className="px-4 py-2 border-b">Month-Year</th>
                <th className="px-4 py-2 border-b">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {Data.map(({ ["Month-Year"]: month, Revenue }) => (
                <tr key={month} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{month}</td>
                  <td className="px-4 py-2 border-b text-right">
                    {Revenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center items-center mt-6">
            <button
              className="w-44 h-14 rounded-xl bg-gradient-to-t from-sky-500 to-indigo-500 text-xl font-bold text-white"
              onClick={() => handleToggle(0)}
            >
              {isOpen === 0 ? "X" : "Send 2024 Data"}
            </button>
          </div>

          {isOpen === 0 && (
            <div className="mt-6 p-4 bg-gray-100 rounded-xl shadow-md">
              <p className="mb-4 text-gray-700 text-xl font-semibold text-center">
                Do You want to send the data!
              </p>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row justify-center items-center gap-4"
              >
                <input
                  type="email"
                  name="sender_email"
                  placeholder="Enter your email"
                  className="w-full sm:w-2/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-sky-500 via-pink-400 to-indigo-500 text-xl font-bold text-white rounded-lg"
                >
                  Submit
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Data 2 Section */}
        <div className="w-full lg:w-1/2">
          <table className="w-3/4 bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-left">
                <th className="px-4 py-2 border-b">Month-Year</th>
                <th className="px-4 py-2 border-b">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {CopyData.map(({ ["Month-Year"]: month, Revenue }) => (
                <tr key={month} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{month}</td>
                  <td className="px-4 py-2 border-b text-right">
                    {Revenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center items-center mt-6">
            <button
              className="w-44 h-14 rounded-xl bg-gradient-to-t from-sky-500 to-indigo-500 text-xl font-bold text-white"
              onClick={() => handleToggle(1)}
            >
              {isOpen === 1 ? "X" : "Send 2025 Data"}
            </button>
          </div>

          {isOpen === 1 && (
            <div className="mt-6 p-4 bg-gray-100 rounded-xl shadow-md">
              <p className="mb-4 text-gray-700 text-xl font-semibold text-center">
                Do You want to send the data!
              </p>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row justify-center items-center gap-4"
              >
                <input
                  type="email"
                  name="sender_email"
                  placeholder="Enter your email"
                  className="w-full sm:w-2/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-sky-500 via-pink-400 to-indigo-500 text-xl font-bold text-white rounded-lg"
                >
                  Submit
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Fixedpath;
