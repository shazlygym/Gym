const express = require('express')
const sendEmail = require('../utils/sendEmail');
const {User}= require('../models/User')
const jwt = require('jsonwebtoken')
const OnxyMessaging = require('onxy-messaging');
const cron = require('node-cron');
const sendThirty = require("../utils/thirtyDays"); // دالة Brevo
const dayjs = require("dayjs");



// Other methods:
// - onxy.sendMediaFromURL('recipient_number', 'media_url', 'Optional caption')
// - onxy.sendTextInGroup('group_name', 'message')
// - onxy.sendMediaFromURLInGroup('group_name', 'media_url', 'Optional caption')

exports.signupUser = async (req, res) => {
  try {
    const { name, email, password, mobileNumber, seq, videosName, videos,totalDays,packageName,packagePrice } = req.body;

    // التحقق من المدخلات
    if (!name || !password || !mobileNumber || !seq) {
      return res.status(400).json({ error: "جميع الحقول مطلوبة" });
    }

    const newUser = new User({
      name,
      email,
      password,
      mobileNumber,
      seq,
      videosName: videosName || "",
      videos: videos || [],
      comment: "",
      totalDays,
      packageName,
      packagePrice
    });

    await newUser.save();

    res.status(201).json({
      message: "تم إنشاء الحساب بنجاح",
      userId: seq,
    });

  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: "حدث خطأ في الخادم" });
  }
};




  
 exports.Login = async (req,res) => {
  try{
     const {mobileNumber,password} = req.body
     if(mobileNumber=="" || password==""){
         return res.status(400).json({error:true,message:"كل الحقول مطلوبة"})
     }
 
     const user = await User.findOne({mobileNumber})
 

     if(!user){
         return res.status(404).json({error:true,message:"المستخدم غير موجود"})
     }
 
     if(password != user.password){
         return res.status(400).json({error:true,message:"كلمة المرور ليست صحيحة"})
     }
 
     
   const token = jwt.sign(
     { id: user._id, email: user.email, name:user.name }
 ,process.env.JWT_SECRET)
 
 // ,{expiresIn:process.env.JWT_EXPIRES_IN}
 
 
 res.cookie('token', token, {
   httpOnly: true,
   secure: true, // ضروري إذا تستخدم https
   sameSite: 'None', // يسمح بالإرسال عبر النطاقات
   maxAge: 24 * 60 * 60 * 1000 // 1 يوم مثلاً
 });
 
 
 
 
     return res.status(200).json({error:false,message:"welcome" ,user})
  }catch(error){
     console.log(error);
     return res.status(500).json({error:true,message:"Internal server error"})
     
  }
 
 }
 

 exports.GetDataProfile = async (req, res) => {
  try {
    const user = await User.findOne({ mobileNumber: req.params.mobileNumber });
    console.log("user",user);
    
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};



exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // استبدل User باسم الموديل
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
};


 exports.DeleteUser =async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

 
  // جلب عضو معين حسب الـ ID
exports.GetUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// تعديل بيانات العضو
exports.EditUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    console.log(req.body.videosName)
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.checkAuth = (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token found" });
    }

    // فك التوكن
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔸 بدل الإيميل اللي تحت بإيميلك الحقيقي
    const allowedEmail = "abdalfatah.aljuaidi@gmail.com";

    if (decoded.email === allowedEmail) {
      return res.json({ authorized: true, email: decoded.email });
    } else {
      return res.status(403).json({ authorized: false, message: "Access denied" });
    }
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};



// 🟢 تسجيل حضور المستخدم
exports.addGymVisit = async (req, res) => {
  try {
    const userId = req.params.id;

    // 🔹 جلب المستخدم للتحقق من عدد الأيام
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

    // 🔹 التحقق من انتهاء الاشتراك
    if (user.usedDays >= user.totalDays) {
      return res
        .status(400)
        .json({ message: "❌ انتهى اشتراك هذا المستخدم في الجيم!" });
    }

    // 🔹 إنشاء تاريخ وساعة الزيارة
    const visitTime = new Date().toLocaleString("en-GB", {
      timeZone: "Asia/Amman",
    });

    // 🔹 تحديث المستخدم: إضافة الزيارة وزيادة usedDays
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: { gymVisits: visitTime },
        $inc: { usedDays: 1 },
      },
      { new: true }
    );

    // 🔹 حساب الجلسات المتبقية بعد التحديث
    const remainingSessions = updatedUser.totalDays - updatedUser.usedDays;

    // 🔹 تحديد الرسالة النهائية
    let message = "";

    if (remainingSessions === 0) {
      message = "⚠️ تم تسجيل الزيارة بنجاح، وكانت هذه آخر جلسة له 🏁";
    } else if (remainingSessions === 1) {
      message = "✅ تم تسجيل الزيارة بنجاح، تبقّت له جلسة واحدة 💪";
    } else if (remainingSessions === 2) {
      message = "✅ تم تسجيل الزيارة بنجاح، تبقّت له جلستان 💪";
    } else {
      message = "✅ تم تسجيل الزيارة بنجاح";
    }

    res.json({
      message,
      visits: updatedUser.gymVisits,
      usedDays: updatedUser.usedDays,
      remainingSessions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "حدث خطأ أثناء تسجيل الزيارة" });
  }
};



exports.getDashboardStats = async (req, res) => {
  try {
    const users = await User.find({}, "gymVisits totalDays usedDays name");

    const totalUsers = users.length;

    // مجموع الزيارات لجميع المستخدمين
    const allVisits = users.flatMap(u => u.gymVisits || []);
    const totalVisits = allVisits.length;

    // عدد المستخدمين الذين لم يزوروا أبداً
    const neverVisitedCount = users.filter(u => !u.gymVisits || u.gymVisits.length === 0).length;

    // أكثر المستخدمين زيارة
    let maxVisitsUser = null;
    users.forEach(u => {
      const count = (u.gymVisits || []).length;
      if (!maxVisitsUser || count > maxVisitsUser.count) {
        maxVisitsUser = { user: u, count };
      }
    });

    // تجميع الزيارات حسب الساعة كما قبل
    const statsByHour = {};
    allVisits.forEach(v => {
      const hour = new Date(v).getHours().toString().padStart(2, "0") + ":00";
      statsByHour[hour] = (statsByHour[hour] || 0) + 1;
    });
    const attendanceStats = Object.entries(statsByHour).map(([hour, attendees]) => ({
      hour,
      attendees,
    }));

    // معدل الزيارات لكل مستخدم (بما فيهم الذين لم يزوروا)
    const avgVisitsPerUser = totalUsers > 0 ? (totalVisits / totalUsers).toFixed(2) : 0;

    // الاشتراكات المنتهية والنشطة
    const expiredUsers = users.filter(u => u.usedDays >= u.totalDays).length;
    const activeUsers = totalUsers - expiredUsers;

    res.json({
      totalUsers,
      totalVisits,
      neverVisitedCount,
      maxVisitsUser: maxVisitsUser
        ? { name: maxVisitsUser.user.name, visits: maxVisitsUser.count }
        : null,
      avgVisitsPerUser,
      attendanceStats,
      expiredUsers,
      activeUsers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ أثناء جلب الإحصائيات" });
  }
};



exports.NotiEmail = async (req, res) => {
  try {
    const userId = req.params.id; // نفترض أن الـ Frontend يرسل userId في الرابط: /api/send-email/:id

    if (!userId) {
      return res.status(400).json({
        error: true,
        message: "يرجى تمرير معرف المستخدم",
      });
    }

    // 🔹 جلب بيانات المستخدم من قاعدة البيانات
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

    // 🔹 حساب الجلسات المتبقية
    const remainingSessions = user.totalDays - user.usedDays;

    // 🔹 تحديد إذا يجب إرسال الإيميل
    if (remainingSessions <= 2 && remainingSessions > 0) {
      await sendEmail({
        to: user.email,
        name: user.name,
        subject: "تذكير بانتهاء اشتراكك في شاذلي جيم 💪",
        template: "send", // اسم القالب
        remainingSessions,
        totalSessions: user.totalDays,
        packageName: user.packageName,
        expiryDate: user.expiryDate,
      });

      return res.json({
        success: true,
        message: `📧 تم إرسال تذكير إلى ${user.name} - تبقى ${remainingSessions} جلسة.`,
      });
    } else if (remainingSessions === 0) {
      return res.json({ message: "❌ اشتراك هذا العميل انتهى بالفعل." });
    } else {
      return res.json({
        message: "✅ اشتراك العميل لا يزال ساريًا، لا حاجة للتذكير الآن.",
      });
    }
  } catch (error) {
    console.error("❌ خطأ أثناء إرسال البريد:", error.message);
    res.status(500).json({
      error: true,
      message: "حدث خطأ أثناء إرسال البريد الإلكتروني",
    });
  }
};





cron.schedule("0 9 * * *", async () => {
  console.log("⏰ Running check for expired subscriptions...");

  try {
    const today = dayjs().startOf("day");

    const users = await User.find({
      joinDate: { $exists: true }
    });

    for (const user of users) {
      const joinDate = dayjs(user.joinDate).startOf("day");
      const expiryDate = joinDate.add(30, "day");

      // إذا اليوم هو يوم انتهاء الاشتراك
      if (today.isSame(expiryDate)) {
        await sendThirty({
          to: user.email,
          name: user.name,
          subject: "انتهى اشتراكك في شاذلي جيم",
          template: "thirtyDays", // اسم ملف handlebars
          packageName: user.packageName || "الاشتراك الشهري",
          expiryDate: expiryDate.format("YYYY-MM-DD"),
        });

        console.log(`📧 Expired subscription email sent to ${user.email}`);
      }
    }

  } catch (error) {
    console.error("❌ Error in subscription expiry cron job:", error);
  }
});



exports.getDashboardStats = async (req, res) => {
  try {
    // 1. الإحصائيات الأساسية (التي كانت موجودة سابقاً)
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ totalDays: { $gt: 0 } });
    const expiredUsers = await User.countDocuments({ totalDays: { $lte: 0 } });

    // حساب إجمالي الزيارات
    const allUsers = await User.find({}, "gymVisits name");
    let totalVisits = 0;
    let neverVisitedCount = 0;
    let maxVisitsUser = { name: "-", visits: 0 };

    allUsers.forEach(u => {
      const visitsCount = u.gymVisits ? u.gymVisits.length : 0;
      totalVisits += visitsCount;
      if (visitsCount === 0) neverVisitedCount++;
      if (visitsCount > maxVisitsUser.visits) {
        maxVisitsUser = { name: u.name, visits: visitsCount };
      }
    });

    const avgVisitsPerUser = totalUsers > 0 ? (totalVisits / totalUsers).toFixed(1) : 0;

    // 2. تجميع بيانات الباقات مع تنظيف الأسماء (Trim) لمنع التكرار
    const packageStatsRaw = await User.aggregate([
      {
        $group: {
          _id: { $trim: { input: { $ifNull: ["$packageName", "غير محدد"] } } }, 
          count: { $sum: 1 },
          totalPrice: { $sum: { $ifNull: ["$packagePrice", 0] } }
        }
      },
      {
        $project: {
          _id: 0,
          packageName: "$_id",
          count: 1,
          totalPrice: 1
        }
      }
    ]);

    // 3. تحليل ساعات الحضور
    const hourCounts = {};
    allUsers.forEach(u => {
      u.gymVisits.forEach(v => {
        const hour = v.split(" ")[1]?.split(":")[0];
        if (hour) hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      });
    });

    const attendanceStats = Object.keys(hourCounts).map(h => ({
      hour: h + ":00",
      attendees: hourCounts[h]
    })).sort((a, b) => a.hour.localeCompare(b.hour));

    // إرسال كل شيء في استجابة واحدة
    res.json({
      totalUsers,
      totalVisits,
      neverVisitedCount,
      maxVisitsUser,
      avgVisitsPerUser,
      activeUsers,
      expiredUsers,
      packageStats: packageStatsRaw,
      attendanceStats
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};