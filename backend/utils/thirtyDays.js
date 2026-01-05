const axios = require("axios");
const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");
require("dotenv").config();

module.exports = async ({
  to,
  name,
  subject,
  template,
  packageName, // اسم الباقة
  expiryDate,  // تاريخ انتهاء الاشتراك
}) => {
  try {
    // 1️⃣ مسار قالب الإيميل
    const templatePath = path.resolve("./views", `${template}.handlebars`);
    const source = fs.readFileSync(templatePath, "utf8");
    const compiledTemplate = handlebars.compile(source);

    // 2️⃣ تمرير البيانات للقالب (اشتراك منتهي)
    const htmlContent = compiledTemplate({
      name,
      packageName,
      expiryDate,
    });

    // 3️⃣ إرسال الإيميل عبر Brevo API
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "شاذلي جيم",
          email: process.env.EMAIL,
        },
        to: [{ email: to, name }],
        subject,
        htmlContent,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Email sent successfully (Subscription Expired)");
    return response.data;

  } catch (error) {
    console.error(
      "❌ Error sending expired subscription email:",
      error.response?.data || error.message
    );
    throw error;
  }
};
