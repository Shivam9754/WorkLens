const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Controllers
const { upload, handleUpload } = require('./controllers/uploadController');
const { handleSearch } = require('./controllers/searchController');

const app = express();

// ✅ ONLY ONE PORT DECLARATION
const PORT = process.env.PORT || 10000;

// Ensure uploads directory exists for local storage
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

/**
 * @route POST /api/upload
 * @desc Handles multipart/form-data for Docs, Audio, and Video files.
 */
app.post('/api/upload', upload.single('file'), handleUpload);
app.get('/api/search', handleSearch);

// Global Error Handler (should be AFTER routes)
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    details: err.message
  });
});

// ✅ ONLY ONE app.listen (MUST BE LAST)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[WorkLens] Backend running on port ${PORT}`);
  console.log(`[WorkLens] Local Storage: ${uploadDir}`);
});
