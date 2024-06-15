const express = require('express');
const router = express.Router();
const loginController = require('../controller/loginController')
const employeeController = require('../controller/employeeController')
const deptController = require('../controller/deptController')
const multer = require('multer')

//multer 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });


//login
router.post('/login',[loginController.login])

//Employee
router.post('/addEmployee',[loginController.validateToken,upload.single('image'),employeeController.addEmployee]);
router.get('/EmployeeList',[loginController.validateToken, employeeController.employeeList]);
router.put('/EmployeeUpdate',[loginController.validateToken,upload.single('image'), employeeController.updateEmployee]);
router.get('/findByIdEmployee',[loginController.validateToken, employeeController.employeebyId]);
router.delete('/delEmployee',[loginController.validateToken, employeeController.deleteEmp]);
router.get('/getSalary',[loginController.validateToken, employeeController.getSalary]);

//Department
router.delete('/deleteDept',[loginController.validateToken, deptController.deleteDept]);
router.post('/addEditDept',[loginController.validateToken, deptController.addEditDept]);
router.get('/listDept',[loginController.validateToken, deptController.deptList]);
router.get('/deptDropdown',[loginController.validateToken, deptController.deptdropdown]);
router.get('/empGraph',[loginController.validateToken, deptController.empChart]);

module.exports = router;