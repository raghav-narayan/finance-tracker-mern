import jsPDF from 'jspdf';
import 'jspdf-autotable';

const exceptions = ['_id','user','createdAt','__v'] 

export const convertToCSV = function(data) {

    const filteredData = data.map(item => {
        return Object.keys(item)
          .filter(key => !exceptions.includes(key))
          .reduce((acc, key) => ({ ...acc, [key]: item[key] }), {});
      })
    const headers = Object.keys(filteredData[0]).join(","); // Get the keys from the first object for the CSV headers
    const rows = filteredData.map(row => Object.values(row).join(",")); // Map each object to a CSV row
    return [headers, ...rows].join("\n"); // Combine headers and rows with line breaks
}

// const csvData = convertToCSV(data); // Assuming 'data' is your JSON array

export const downloadCSV = function(csvData, filename = 'financial_data.csv') {
    const blob = new Blob([csvData], { type: 'text/csv' }); // Create a Blob with the CSV data
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename; // Set the download filename
    link.click(); // Trigger the download
}

 // This plugin is used for table generation

export const exportToPDF = function(data, filename = 'financial_data.pdf') {
    const doc = new jsPDF(); // Create a new jsPDF instance

    // Convert the JSON data to a format suitable for jsPDF
    const filteredData = data.map(item => {
        return Object.keys(item)
          .filter(key => !exceptions.includes(key))
          .reduce((acc, key) => ({ ...acc, [key]: item[key] }), {});
      })
    const tableColumn = Object.keys(filteredData[0]); // Table headers from object keys
    const tableRows = filteredData.map(row => Object.values(row)); // Table data from object values

    // Add the table to the PDF
    doc.autoTable(tableColumn, tableRows, { startY: 20 });

    // Save the PDF
    doc.save(filename);
}