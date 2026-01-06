// routes/taskRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post('/Signup', authController.signupUser);
router.post('/Login',authController.Login)
router.get('/GetDataProfile/:mobileNumber',authController.GetDataProfile)
router.get('/getAllUsers',authController.getAllUsers)
router.delete('/DeleteUser/:id',authController.DeleteUser)
router.get('/GetUser/:id',authController.GetUser)
router.put('/EditUser/:id',authController.EditUser)
router.get('/checkAuth',authController.checkAuth)
router.post('/addGymVisit/:id',authController.addGymVisit)
router.get("/dashboardStats", authController.getDashboardStats);
router.post("/sendEmail/:id", authController.NotiEmail);
router.get("/dashboardStats", authController.getDashboardStats);




module.exports = router;
