import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FiDownload, FiUpload, FiFilter } from 'react-icons/fi'; // Add icons
import { BsFillMoonStarsFill, BsFillSunFill } from 'react-icons/bs'; // Theme icons
import { Workbook } from 'xlsx'; // You need to install xlsx via npm or yarn
import Chart from 'chart.js/auto';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { UserContext } from '../context/userContext';
import ReportTable from './ReportTable.js';


const Reports = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const chartRef = useRef(null);
  const { userData, localhosturl } = useContext(UserContext);

  {/* useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };*/}

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      // Create a new workbook and a worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Report');

      // Define table columns
      worksheet.columns = [
        { header: 'User ID', key: 'userId', width: 15 },
        { header: 'Publisher', key: 'publisher', width: 25 },
        { header: 'Name', key: 'name', width: 25 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Phone', key: 'phone', width: 20 },
        { header: 'Section', key: 'section', width: 15 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Created At', key: 'createdAt', width: 20 },
      ];

      // Add data to the worksheet
      reports.forEach((report) => {
        worksheet.addRow({
          userId: report.userId,
          publisher: report.publisher,
          name: report.name,
          email: report.email,
          phone: report.phone,
          section: report.section,
          status: report.status,
          createdAt: new Date(report.createdAt).toLocaleString(),
        });
      });

      // Generate a chart using Chart.js
      const chartCanvas = document.createElement('canvas');
      const ctx = chartCanvas.getContext('2d');

      new Chart(ctx, {
        type: 'bar', // You can choose 'line', 'bar', 'pie', etc.
        data: {
          labels: reports.map((report) => report.publisher),
          datasets: [{
            label: 'Number of Reports',
            data: reports.map((report) => report.section.length), // Example data
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });

      // Convert chart to image
      const chartImage = chartCanvas.toDataURL('image/png');

      // Add the chart image to the worksheet
      const imageId = workbook.addImage({
        base64: chartImage,
        extension: 'png',
      });
      worksheet.addImage(imageId, 'I2:M10'); // Position the image within cells

      // Write the Excel file and trigger download
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), 'report_with_chart.xlsx');

      toast.success('Report generated successfully');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {


      await axios.post(`${localhosturl}/applyroute/importData`, formData);
      toast.success('Data imported successfully');
    } catch (error) {
      console.error('Error importing data:', error);
      toast.error('Failed to import data');
    }
  };
  const handleExport = async () => {
    setLoading(true);
    try {

      //const response = await axios.get('http://localhost:5000/applyroute/getReportData');
      const reportData = reports //response.data;


      const workbook = XLSX.utils.book_new();
      const worksheetData = reportData.map((report) => ({
        'User ID': report.userId,
        'Publisher': report.publisher,
        'Name': report.name,
        'Email': report.email,
        'Phone': report.phone,
        'Section': report.section,
        'Status': report.status,
        'Created At': new Date(report.createdAt).toLocaleString(),
      }));

      const worksheet = XLSX.utils.json_to_sheet(worksheetData);

      // Append worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

      // Convert workbook to binary array and trigger download
      const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'report.xlsx');
      document.body.appendChild(link);
      link.click();

      toast.success('Report generated successfully');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  }



  const handleDateChange = async () => {
    const formatLocalDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const formattedStartDate = formatLocalDate(startDate);
    const formattedEndDate = formatLocalDate(endDate);

    try {

      const response = await axios.get(`${localhosturl}/applyroute/getDailyReports`, {
        params: {
          startDate: formattedStartDate,
          endDate: formattedEndDate
        }
      });
      setReports(response.data);

      const ctx = chartRef?.current?.getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: response.data.map((report) => report.publisher),
          datasets: [
            {
              label: 'Number of Reports',
              data: response.data.map((report) => report.section.length),
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          animation: {
            duration: 1000,
            easing: 'easeInOutBounce',
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      // setChartVisible(true); // Show the chart after data is loaded
      toast.success('Report generated successfully');

    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to fetch reports');
    }
  };
  //console.log(process.env.Local_Url)

  return (
    <div className={`p-8 transition duration-500  min-h-screen`}//${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}
    >
      <h1 className="text-3xl  p-2">Reports</h1>
      {/*<div className="flex justify-between items-center mb-6">
       <h1 className="text-3xl font-bold">Reports</h1>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300"
        >
          {darkMode ? <BsFillSunFill className="text-yellow-400" /> : <BsFillMoonStarsFill className="text-blue-600" />}
        </button>
      </div>*/}

      <div className="mb-6 flex flex-wrap">
        <div className="mr-4 mb-4">
          <label className="mr-2">Start Date:</label>
          <Calendar
            onChange={setStartDate}
            value={startDate}
            className="border rounded calendar "//border-gray-300 rounded p-2 dark:border-gray-700 dark:bg-gray-800
          />
        </div>
        <div className="mr-4 mb-4">
          <label className="mr-2">End Date:</label>
          <Calendar
            onChange={setEndDate}
            value={endDate}
            className="border rounded calendar"// border-gray-300 rounded p-2 dark:border-gray-700 dark:bg-gray-800
          />
        </div>

      </div>
      <div className="flex justify-end mb-4">
        <button
          onClick={handleDateChange}
          className="ml-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 flex items-center"
        >
          <FiFilter className="mr-2" />
          Filter Reports {/*Filter Reports*/}
        </button>
      </div>

      { /*<div className="flex space-x-4 mb-4">
        <button
          onClick={handleGenerateReport}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 flex items-center"
        >
          <FiDownload className="mr-2" />
          Generate Report
        </button>

        {/*<input
          type="file"
          onChange={handleImport}
          className="border border-gray-300 rounded p-2 dark:border-gray-700 dark:bg-gray-800"
        />

        <button
          onClick={handleExport}
          className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300 flex items-center"
        >
          <FiUpload className="mr-2" />
          Export Data
        </button>
      </div>*/}

      {loading && <div className="mt-4 animate-pulse">Processing...</div>}

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-1 p-2">Daily Reports</h2>
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300 flex items-center"
            >
              <FiUpload className="mr-2" />
              Export Data
            </button>
          </div>
          {/*   <canvas ref={chartRef} className="my-6"></canvas>*/}
          {/*<table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">User ID</th>
                <th className="border p-2">Publisher</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Section</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? <tr>
                <td
                  colSpan="10"
                  className="border py-3 px-6 text-center text-lg font-semibold"
                >
                  No reports available for the selected date range.
                </td>
              </tr> :
              (
                <>
               { reports.map((report) => (
                <>
                  <ReportTable section="Content Writer" reports={report} />
      <ReportTable section="Instagram Influencer" reports={report} />
      <ReportTable section="YouTube Influencer" reports={report} />
      <ReportTable section="Guest Post" reports={report} />
      </>
                ))}
                </>
              ) 
              reports.map((report) => (
                <tr key={report._id} className="hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300">
                  <td className="border p-2">{report.userId}</td>
                  <td className="border p-2">{report.publisher}</td>
                  <td className="border p-2">{report.name}</td>
                  <td className="border p-2">{report.email}</td>
                  <td className="border p-2">{report.phone}</td>
                  <td className="border p-2">{report.section}</td>
                  <td className="border p-2">{report.status}</td>
                  <td className="border p-2">{new Date(report.createdAt).toLocaleString()}</td>
                </tr
              ))///end
              }

            </tbody>
          </table>
          
          </div>*/}
           <ReportTable section="ContenWriters" reports={reports} />
      <ReportTable section="InstagramInfluencer" reports={reports} />
      <ReportTable section="YoutubeInfluencer" reports={reports} />
      <ReportTable section="Guestpost" reports={reports} />
      </>
       
      </div>

    </div>
  );
};

export default Reports;


