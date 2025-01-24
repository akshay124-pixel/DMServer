const Entry = require("../Schema/DataModel");
const mongoose = require("mongoose");
const XLSX = require("xlsx");
// DataentryLogic.js
const DataentryLogic = async (req, res) => {
  try {
    const {
      customerName,
      mobileNumber,
      address,
      state,
      city,
      organization,
      category,
    } = req.body;

    // Validate data
    if (
      !customerName ||
      !mobileNumber ||
      !address ||
      !state ||
      !city ||
      !organization ||
      !category
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    // Create and save the entry
    const newEntry = new Entry({
      customerName,
      mobileNumber,
      address,
      state,
      city,
      organization,
      category,
    });
    await newEntry.save();

    res.status(201).json({ success: true, data: newEntry });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};
// Function to export entry data to CSV
const exportentry = async (req, res) => {
  try {
    // Fetch all entries from the database
    const entries = await Entry.find();

    // Format the entry data as needed
    const formattedEntries = entries.map((entry) => ({
      customerName: entry.customerName,
      mobileNumber: entry.mobileNumber,
      address: entry.address,
      state: entry.state,
      city: entry.city,
      organization: entry.organization,
      category: entry.category,
      createdAt: entry.createdAt.toLocaleDateString(), // Format date if necessary
    }));

    // Convert the formatted data to a worksheet
    const ws = XLSX.utils.json_to_sheet(formattedEntries); // Convert JSON to worksheet

    // Create a new workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Customer Entries");

    // Write the workbook to a Buffer
    const fileBuffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });

    // Set response headers for downloading the XLSX file
    res.setHeader("Content-Disposition", "attachment; filename=entries.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    // Send the XLSX file buffer in the response
    res.send(fileBuffer);
  } catch (error) {
    console.error("Error exporting entries:", error);
    res.status(500).send("Error exporting entries");
  }
};

// Data Fethcing Logic
const fetchEntries = async (req, res) => {
  try {
    const entries = await Entry.find();
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete
const DeleteData = async (req, res) => {
  try {
    const entries = await Entry.findByIdAndDelete(req.params.id);
    if (!entries) {
      return res.status(404).json({ error: "Entry not found" });
    }
    res.status(200).json({ message: "Entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting Entry:", error);
    res.status(500).json({ error: "Failed to delete Entry" });
  }
};
// Edit Logic
const editEntry = async (req, res) => {
  const {
    customerName,
    mobileNumber,
    address,
    state,
    city,
    organization,
    category,
  } = req.body; // Get updated values from the request body

  try {
    // Find the entry by ID and update it
    const entry = await Entry.findByIdAndUpdate(
      req.params.id, // The entry ID from the URL
      {
        customerName,
        mobileNumber,
        address,
        state,
        city,
        organization,
        category,
      }, // The updated fields
      { new: true, runValidators: true } // 'new: true' ensures you return the updated document
    ).lean(); // Using .lean() to return a plain JavaScript object

    // If the entry is not found
    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    // Send the updated entry as a response
    res.status(200).json(entry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating entry" });
  }
};
// Bulk Upload

const bulkUploadStocks = async (req, res) => {
  try {
    const newEntries = req.body; // Frontend sends an array of entries

    if (!Array.isArray(newEntries) || newEntries.length === 0) {
      return res.status(400).json({ message: "Invalid data format." });
    }

    // Validate stocks based on entrySchema
    const validatedEntries = newEntries.map((entry) => ({
      customerName: entry.customerName?.trim(),
      mobileNumber: entry.mobileNumber?.trim(),
      address: entry.address?.trim(),
      state: entry.state?.trim(),
      city: entry.city?.trim(),
      organization: entry.organization?.trim(),
      category: entry.category?.trim(),
      createdAt: entry.createdAt ? new Date(entry.createdAt) : new Date(),
    }));

    // Check for invalid entries
    const invalidEntries = validatedEntries.filter(
      (entry) =>
        !entry.customerName ||
        !entry.mobileNumber ||
        !entry.address ||
        !entry.state ||
        !entry.city ||
        !entry.organization ||
        !entry.category
    );

    if (invalidEntries.length > 0) {
      return res.status(400).json({
        message: "Some entries have missing or invalid fields.",
        invalidEntries,
      });
    }

    // Insert validated entries into the database
    await Entry.insertMany(validatedEntries);

    res.status(201).json({ message: "Entries uploaded successfully!" });
  } catch (error) {
    console.error("Error in bulk upload:", error.message);
    res.status(500).json({ message: "Failed to upload entries." });
  }
};
// Bulk Upload Ends

module.exports = {
  bulkUploadStocks,
  DataentryLogic,
  fetchEntries,
  DeleteData,
  editEntry,
  exportentry,
};
