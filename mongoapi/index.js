const express = require('express');
const mongoose = require('mongoose');

// Replace `<your_mongo_uri>` with your actual connection string
const mongoURI = '<your_mongo_uri>'; 
// nhi hai url
// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// Define your Mongoose Schema
// const DataSchema = new mongoose.Schema({
//   // Define your data fields here (Intensity, Likelihood, Relevance, etc.)
//   year: Number,
//   country: String,
//   topics: [String],
//   region: String,
//   city: String,
//   // ... other fields
// });

const DataModel = mongoose.model('Data', DataSchema);

const app = express();

// Parse incoming JSON data
app.use(express.json());

// API endpoint to fetch data with filters
app.get('/data', async (req, res) => {
  const filters = {};

  // Extract filters from query parameters
  const allowedFilters = ['year', 'topics', 'region', 'country']; // Add allowed filters here

  for (const filter of allowedFilters) {
    if (req.query[filter]) {
      switch (filter) {
        case 'year':
          filters.year = req.query.year;
          break;
        case 'topics':
          filters.topics = { $in: req.query.topics.split(',') }; // Split comma-separated topics
          break;
        // Add logic for other filters (region, country, etc.) based on data types
        default:
          filters[filter] = req.query.filter;
      }
    }
  }

  try {
    const data = await DataModel.find(filters);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

// Add additional API endpoints here (optional)

const port = process.env.PORT || 3000; // Use environment variable for port

app.listen(port, () => console.log(`Server listening on port ${port}`));

