// At the very top of your server/index.js
import dotenv from 'dotenv';
dotenv.config();
// --------------------

import express from "express";
import cors from "cors";
import multer from "multer";
import "dotenv/config";
import FormData from "form-data";
import fetch from "node-fetch";

// Diagnostic log to confirm the key is loaded
console.log("Reading PICWISH_API_KEY:", process.env.PICWISH_API_KEY);

const app = express();
const port = 8080;

app.use(cors());
const upload = multer({ storage: multer.memoryStorage() });

app.post("/api/enhance", upload.single("image"), async (req, res) => {
  console.log("\n--- New Request Received ---");

  if (!req.file) {
    console.error("Error: No image file was uploaded.");
    return res.status(400).send("No image file uploaded.");
  }

  const apiKey = process.env.PICWISH_API_KEY;
  if (!apiKey) {
    console.error("CRITICAL ERROR: PICWISH_API_KEY is not defined.");
    return res.status(500).send("Server configuration error: API key is missing.");
  }

  const formData = new FormData();
  formData.append("image_file", req.file.buffer, {
    filename: req.file.originalname,
    contentType: req.file.mimetype,
  });
  formData.append("sync", "1");

  try {
    // --- Using the correct endpoint from the documentation ---
    const apiEndpoint = "https://techhk.aoscdn.com/api/tasks/visual/scale";
    console.log(`Step 1: Sending request to PicWish endpoint: ${apiEndpoint}`);
    // -------------------------------------------------------------------------
    
    const apiResponse = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        ...formData.getHeaders(),
        "X-API-KEY": apiKey, // Ensure uppercase header name
      },
      body: formData,
      timeout: 60000, // Increased timeout to 60s
    });
    
    const responseBody = await apiResponse.text();
    console.log(`PicWish API responded with HTTP status: ${apiResponse.status}`);

    if (!apiResponse.ok) {
      console.error("PicWish API HTTP Error:", { status: apiResponse.status, body: responseBody });
      throw new Error(`API HTTP Error: ${responseBody}`);
    }
    
    console.log("Step 2: Parsing API response...");
    let result;
    try {
      result = JSON.parse(responseBody);
    } catch (e) {
      console.error("Failed to parse JSON response:", responseBody);
      throw new Error("Invalid JSON response from API");
    }

    console.log("PicWish API Result:", JSON.stringify(result, null, 2));

    // Check for API-level errors (even if HTTP status is 200)
    if (result.status && result.status !== 200) {
       console.error(`PicWish returned error status: ${result.status}, Message: ${result.message}`);
       throw new Error(`PicWish Error: ${result.message || "Unknown error"}`);
    }

    // Check task state if available
    if (result.data && result.data.state < 0) {
       console.error(`PicWish Task Error: State ${result.data.state}, Detail: ${result.data.state_detail}`);
       throw new Error(`Processing Error: ${result.data.state_detail || "Task failed"}`);
    }

    if (result.data && result.data.image) {
      const imageUrl = result.data.image;
      console.log(`Step 3: Fetching final image from URL: ${imageUrl}`);
      
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) throw new Error("Could not download the processed image.");
      
      const imageBuffer = await imageResponse.buffer();
      res.set("Content-Type", imageResponse.headers.get("content-type"));
      res.send(imageBuffer);
      console.log("--- Request Completed Successfully ---");
    } else {
      console.error("API response missing image URL. Full response:", result);
      throw new Error("API response did not contain an output image.");
    }
  } catch (error) {
    console.error("--- Full error during enhancement process ---");
    console.error(error);
    res.status(500).send(error.message || "An unknown server error occurred.");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
