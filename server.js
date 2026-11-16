import express from 'express';
import fs from 'fs';

const app = express();
app.use(express.json());

// Read faculty data from JSON file
const readData = () => {
    return JSON.parse(
        fs.readFileSync('./data/faculty.json', "utf-8")
    );
};

// Write faculty data to JSON file
const writeData = (data) => {
    fs.writeFileSync(
        './data/faculty.json',
        JSON.stringify(data, null, 2),
        'utf-8'
    );
};


// CREATE FACULTY - POST
app.post('/api/v1/faculty', (req, res) => {
    const faculty = readData();

    const newFaculty = {
        id: faculty.length > 0
            ? faculty[faculty.length - 1].id + 1
            : 1,
        ...req.body
    };

    faculty.push(newFaculty);

    writeData(faculty);

    res.status(201).json({
        message: 'Faculty created successfully',
        data: newFaculty
    });
});


// GET ALL FACULTY - GET
app.get('/api/v1/faculty', (req, res) => {
    const faculty = readData();

    res.status(200).json({
        message: 'All faculty fetched successfully',
        data: faculty
    });
});


// GET FACULTY BY ID - GET
app.get('/api/v1/faculty/:id', (req, res) => {
    const facultyId = parseInt(req.params.id);

    const faculty = readData();

    const facultyMember = faculty.find(
        p => p.id === facultyId
    );

    if (facultyMember) {
        res.status(200).json({
            message: 'Faculty fetched successfully',
            data: facultyMember
        });
    } else {
        res.status(404).json({
            message: 'Faculty not found'
        });
    }
});


// UPDATE FACULTY - PUT
app.put('/api/v1/faculty/:id', (req, res) => {
    const facultyId = parseInt(req.params.id);

    const faculty = readData();

    const index = faculty.findIndex(
        p => p.id === facultyId
    );

    if (index !== -1) {

        faculty[index] = {
            ...faculty[index],
            ...req.body,
            id: facultyId
        };

        writeData(faculty);

        res.status(200).json({
            message: 'Faculty updated successfully',
            data: faculty[index]
        });

    } else {
        res.status(404).json({
            message: 'Faculty not found'
        });
    }
});


// DELETE FACULTY - DELETE
app.delete('/api/v1/faculty/:id', (req, res) => {
    const facultyId = parseInt(req.params.id);

    const faculty = readData();

    const index = faculty.findIndex(
        p => p.id === facultyId
    );

    if (index !== -1) {

        const deletedFaculty = faculty.splice(index, 1);

        writeData(faculty);

        res.status(200).json({
            message: 'Faculty deleted successfully',
            data: deletedFaculty[0]
        });

    } else {
        res.status(404).json({
            message: 'Faculty not found'
        });
    }
});


const PORT = 7200;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});