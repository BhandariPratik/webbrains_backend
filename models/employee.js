const { Schema } = require('mongoose');
var mongoose = require('mongoose');

const employeeSchema = new Schema(
    {
        firstname: {
            type: String,
            required: [true, "Please enter the last name"]
        },
        lastname: {
            type: String,
            required: [true, "Please enter the last name"]
        },
        image: {
            type: String,
            required: false
        },
        address1: {
            type: String,
            required: true
        },
        address2: {
            type: String,
            required: false
        },
        country: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        department: {
            type: String,
            required: true
        },
        salary: {
            type: Number,
            required: true
        },
        email:{
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
