
const Department = require('../models/department');
const employee = require('../models/employee')

const addEditDept = (async (req, res) => {
    try {
        let data = req.body;
        let { edit, department,id } = req.body;

        if (edit) {
            await Department.findByIdAndUpdate(id, data);
            res.status(200).json({ message: 'Data updated successfully' })
        }
        else {
            const emp = await Department.findOne({ department });
            if (emp) {
                res.status(200).json({ message: "department is Exist with this Name" })
            }
            else {
                await Department.create(data)
                res.status(200).json({ message: "Department Added successfully" })
            }
        }

    }
    catch (err) {
        console.log('Error', err)
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

const deptList = async (req, res) => {
    try {
        const { search_text, pageSize, page, dept } = req.query;
        let filter = {};
        if (search_text) {
            const searchRegex = new RegExp(search_text, 'i');
            filter = {
                $or: [
                    { department: searchRegex }
                ]
            };
        }
       
        if (dept) {
            filter.department = dept;
        }

        const limit = parseInt(pageSize);
        const skip = (parseInt(page) - 1) * limit;

        const departments = await Department.find(filter).skip(skip).limit(limit);
        const totalCount = await Department.countDocuments(filter);

        const data = await Promise.all(departments.map(async (dept) => {
            const employeeCount = await employee.countDocuments({ department: dept.department });
            return {
                department: dept.department,
                totalEmployees: employeeCount,
                _id:dept._id,
                updatedAt:dept.updatedAt,
                createdAt:dept.createdAt
            };
        }));

        res.status(200).json({ data, totalCount, page, pageSize });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


const empChart = async (req, res) => {
    try {
        const departments = await Department.find({});
        const data = await Promise.all(departments.map(async (dept) => {
            const employeeCount = await employee.countDocuments({ department: dept.department });
            return {
                department: dept.department,
                totalEmp: employeeCount
            };
        }));

        res.status(200).json({ data });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};



const deleteDept= (async (req, res) => {
    try {
        let id = req?.query?.id;
        let del = await Department.findByIdAndDelete(id);
        if (!del) {
            return res.status(404).json({ message: 'Department Not Found' })
        }
        res.status(200).json({  message: 'Department delete successgully' })
    }
    catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

const deptdropdown = async (req, res) => {
    try {
        const data = await Department.find({})
        res.status(200).json({data});
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { addEditDept, deptList, deleteDept ,deptdropdown,empChart };