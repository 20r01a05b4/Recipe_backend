const twilio = require("twilio");
const jwt = require("jsonwebtoken");
const emailjs = require('@emailjs/nodejs');


const acc_id = "ACd3ae024f4bba7e451c228f488f4f3218";
const token = "bc1a7c749b808d17cd6d3523dcb36afc";
const client = twilio(acc_id, token);

const sendOtp = async (username, otp, secret_key) => {
    try {
        // Sending OTP via email
        const obj = {
            name: "20r01a05b4@cmritonline.ac.in",
            notes: `Your OTP is ${otp}`
        };

        await emailjs.send('service_7i8s6ak', "template_pomlbn6", obj,
        {
            publicKey: "JPOSvQKJ0kVtpleyO",
           
          }
        );

        // Sending OTP via SMS
        const smsRes = await client.messages.create({
            body: `Your OTP is ${otp}`,
            from: '+16592518918',
            to: "+9192682482"
        });
        console.log("SMS sent successfully:", smsRes);

        // Generating JWT token
        const token = jwt.sign({ "username": username, "otp": otp }, secret_key, { expiresIn: "1m" });
        return token;
    } catch (err) {
        console.error("Error sending OTP:", err);
        return null;
    }
};

module.exports = sendOtp;
