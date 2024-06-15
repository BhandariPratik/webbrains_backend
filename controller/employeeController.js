
const employee = require('../models/employee');
const transporter = require('../mailer/nodemailer');

const addEmployee = (async (req, res) => {
    try {
        let data = req.body;
        if (req.file) {
            console.log("dsfsd", req.file)
            data.image = `http://localhost:4000/uploads/${req.file.filename}`;
        }

        let { email, firstname, lastname } = req.body;
        const emp = await employee.findOne({ email });

        if (emp) {
            res.status(200).json({ message: "Employee Exist with the same Email-id" })
        }
        else {
            await employee.create(data)
            res.status(200).json({ message: "Employee Added successfully" })

            // await transporter.sendMail({
            //     from: process.env.EMAIL, 
            //     to: email,
            //     subject: 'Register successfully',
            //     text: `Hello ${firstname} ${lastname},\n\n you are added successfully.`
            // });
        }

    }
    catch (err) {
        console.log('Error', err)
        res.status(500).json({ message: 'Internal Server Error' });
    }
})


const employeeList = async (req, res) => {
    try {
        const { search_text, pageSize, page,dept,salary} = req.query;
        let filter = {};
        if (search_text) {
                const searchRegex = new RegExp(search_text, 'i');
                filter = {
                    $or: [
                        { firstname: searchRegex },
                        { lastname: searchRegex },
                        { email: searchRegex },
                        { address1: searchRegex },
                        { address2: searchRegex },
                        { country: searchRegex },
                        { state: searchRegex },
                        { city: searchRegex },
                    ]
                };     
        }
        if (dept) {
            filter.department = dept; 
        }

        if (salary) {
            filter.salary = parseInt(salary); 
        }
        
        const limit = parseInt(pageSize);
        const skip = (parseInt(page) - 1) * limit;

        const data = await employee.find(filter).skip(skip).limit(limit);
        const totalCount = await employee.countDocuments(filter);

        res.status(200).json({ data, totalCount, page, pageSize });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


const employeebyId = (async (req, res) => {
    try {
        const id = req.query.id;
        let data = await employee.findById((id));
        res.status(200).json({ 'data': data })
    }
    catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

const updateEmployee = (async (req, res) => {
    try {
        let { id } = req?.body;

        let data = req.body; 
        if (req.file) {
            data.image = `http://localhost:4000/uploads/${req.file.filename}`;
        }

        let updateData = await employee.findByIdAndUpdate(id, data);
        if (!updateData) {
            return res.status(404).json({
                message: 'employee not Found'
            })
        }
        res.status(200).json({ message: 'Data updated successfully' })
    }
    catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

const deleteEmp = (async (req, res) => {
    try {
        let id = req?.query?.id;
        let del = await employee.findByIdAndDelete(id);
        if (!del) {
            return res.status(404).json({ message: 'Employee Not Found' })
        }
        let newRecord = await employee.find({})
        res.status(200).json({ data: newRecord, message: 'Employee delete successgully' })
    }
    catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

const getSalary = async (req, res) => {
    try {
        const salary = await employee.aggregate([
            {
                $group: {
                    _id: "$salary"
                }
            },
            {
                $project: {
                    _id: 0,
                    salary: "$_id"
                }
            }
        ]);

        res.status(200).json({ salary });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { addEmployee, employeeList, employeebyId, updateEmployee, deleteEmp ,getSalary};