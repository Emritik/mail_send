import { useState, useEffect } from "react"
import parserdata from "papaparse"
import emailjs from "emailjs-com";


const Home = () => {
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("src\\Datafile.csv");
        const text = await response.text();
        const result = parserdata.parse(text, { header: true });
        setData(result.data);
        // console.log(result.data);
      } catch (error) {
        console.error("Error Fetching CSV: ", error);
      }
    };
    fetchData();
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = () => {

    const templateParams = {
      to_email: email,
      subject: "Testing Data",
      message: JSON.stringify(data,null,2)
    };

    emailjs
      .send(
        "service_*******", //serviceID
        "template_******", //templateID
        templateParams,
        "***********" //user public id
      )
      .then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
          alert("Email sent successfully!");
        },
        (err) => {
          console.error("FAILED...", err);
          alert("Failed to send email.");
        }
      );
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Month-Year Revenue Data
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-2/3 bg-white border ml-60 mt-4  border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="px-4 py-2 border-b">Month-Year</th>
              <th className="px-4 py-2 border-b">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{item["Month-Year"]}</td>
                <td className="px-4 py-2 border-b">{item["Revenue"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center items-center mt-8 ">
          <button
            className="w-44 h-14 rounded-xl bg-gradient-to-t from-sky-500 to-indigo-500 text-xl font-bold text-white"
            onClick={handleToggle}
          >
            {isOpen ? "X" : "Send Email"}
          </button>
        </div>

        {isOpen && (
          <div className=" w-2/5 mt-8 ml-96 p-4 bg-gray-100 rounded-xl shadow-md">
            <p className="mb-4 text-gray-700 text-xl font-semibold">
              Do You want to send the data!
            </p>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-2/3 px-3 py-2 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleSubmit}
              className="w-2/7 ml-4 bg-gradient-to-r from-sky-500 via-pink-400 to-indigo-500 text-xl font-bold text-white py-2 rounded-lg "
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
