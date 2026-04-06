const express = require('express');
const router = express.Router();
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');

// 1. Setup Video Storage (Saves to uploads/evidence)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/evidence/');
    },
    filename: (req, file, cb) => {
        cb(null, `SOS-${Date.now()}-${file.originalname}.webm`);
    }
});
const upload = multer({ storage: storage });

// 2. The SOS Trigger Route
router.post('/trigger', upload.single('video'), async (req, res) => {
    try {
        // Get coordinates from the frontend request
        const { lat, lng } = req.body;
        
        // Updated volunteer list with your teammates
        const volunteerEmails = [
            "madyasha32@gmail.com", 
            "rmohapatra0715@gmail.com", 
            "gourangajayanti1@gmail.com",
            "satyabratamahakud612@gmail.com"
        ];

        console.log("*****************************************");
        console.log("🚨 SOS ACTIVATED!");
        console.log(`📍 Location Captured: ${lat}, ${lng}`);
        if (req.file) {
            console.log(`📹 Evidence Video Saved: ${req.file.filename}`);
        }

        // 3. Setup the Email Transporter (Uses your .env secrets)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // 4. Define the Email Content (Fixed Google Maps Link)
        const googleMapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: volunteerEmails.join(','),
            subject: "🚨 EMERGENCY: SevaSync AI Alert!",
            html: `
                <div style="font-family: sans-serif; border: 3px solid red; padding: 20px; border-radius: 10px; max-width: 600px;">
                    <h1 style="color: red; margin-top: 0;">Emergency Alert Received</h1>
                    <p style="font-size: 1.1em;">A user has triggered an SOS and needs immediate assistance.</p>
                    <hr style="border: 0; border-top: 1px solid #eee;">
                    <p><b>📍 Location:</b> <a href="${googleMapsLink}" style="color: #007bff; text-decoration: none; font-weight: bold;">Click here to View on Google Maps</a></p>
                    <p><b>🌐 Coordinates:</b> ${lat}, ${lng}</p>
                    <p><b>⏰ Time:</b> ${new Date().toLocaleString('en-IN')}</p>
                    <hr style="border: 0; border-top: 1px solid #eee;">
                    <p style="font-size: 0.85em; color: #666; font-style: italic;">
                        Note: An evidence video has been successfully recorded and stored in the system's secure 'evidence' folder for review.
                    </p>
                </div>
            `
        };

        // 5. Send the Email
        await transporter.sendMail(mailOptions);
        console.log("✅ Volunteer Alert Emails Sent Successfully!");
        console.log("*****************************************");

        res.status(200).json({ 
            success: true, 
            message: "SOS Logged and Volunteers Notified!" 
        });

    } catch (error) {
        console.error("❌ BACKEND ERROR:", error.message);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

module.exports = router;