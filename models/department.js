const { Schema } = require('mongoose');
var mongoose = require('mongoose');

const deptSchema = new Schema(
    {
        department: {
            type: String,
            required: [true, "Please enter Department"]
        },
       
    },
    {
        timestamps: true
    }
);

const Department = mongoose.model("Department", deptSchema);

module.exports = Department;
