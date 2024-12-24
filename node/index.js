const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const IdeaConfirm = require('./server/ideasConfirm'); // Adjust the path if needed
const Idea = require('./server/ideasSubmit');// Import the Idea model


const cors = require('cors');  // Optional, for handling CORS

const app = express();
app.use(bodyParser.json())
app.use(cors())

mongoose.connect("mongodb://127.0.0.1:27017/reactProjectDB",
    { useNewUrlParser: true, useUnifiedTopology: true }
    
)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Failed to connect to MongoDB', err));


app.use(express.json());

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: 'employee' },
});

UserSchema.methods.comparePassword = async function (password) {
    try {
      return await bcrypt.compare(password, this.password); // Compare the entered password with the hashed password
    } catch (error) {
      throw new Error('Error comparing passwords');
    }
  };

const User = mongoose.model('User', UserSchema);



app.post('/ideas', async (req, res) => {
    const { idea, email } = req.body;
  
    // Input validation
    if (!idea || !email) {
      return res.status(400).json
      ({ message: 'Idea and submittedBy are required.' });
    }



    const existingIdea = await Idea.
    findOne({ email });
    if (existingIdea) {
      
      console.log('Email already in use:', email);
      return res.status(400).json({ message: 'Email is already in use.' });
    }
  
    try {
      const newIdea = new Idea({ idea, 
        email });
      await newIdea.save();
      res.status(201).json({
        message: 'Idea submitted successfully!',
        idea: newIdea,
      });
    //   res.s.;tatus(201).json({ message: 'Idea submitted successfully!', idea: newIdea });
    } catch (error) {
      console.error('Error submitting idea:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  app.get('/ideas', async (req, res) => {
    try {
      const ideas = await Idea.find().sort({ createdAt: -1 }); // Fetch ideas, sorted by most recent
      res.status(200).json(ideas);
    } catch (error) {
      console.error('Error fetching ideas:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });


app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);

  
      // Generate a JWT token
      const token = jwt.sign({ userId: user._id, role: user.role }, 'your_jwt_secret_key', { expiresIn: '1h' });
  
      res.status(200).json({
        message: 'Login successful',
        token,  // Send the JWT token to the client
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });


 // const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret_key');
    req.user = decoded; // Attach user data to request
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

app.get('/dashboard', protect, (req, res) => {
    res.status(200).json({ message: 'Welcome to the dashboard!', user: req.user });
  });
  
app.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;
  
    // Input validation
    if (!name || !email || !password) {
      console.log('Validation failed. Missing fields.');
      return res.status(400).json({ message: 'All fields are required.' });
    }
  
    try {
      // Check if the email already exists in the database
      const existingUser = await User.
      findOne({ email });
      if (existingUser) {
        console.log('Email already in use:', email);
        return res.status(400).json({ message: 'Email is already in use.' });
      }
  
      // Create new user
      const user = new User({ name, email, password, role });
      await user.save();
      console.log('User registered successfully:', user);
      res.status(201).json({ message: 'User registered successfully!' });
      console.log(res.status)
    
  
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  
app.get('/confirmidea', async (req, res) => {
    try {
      const ideas = await IdeaConfirm.find();
      res.status(200).json(ideas);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching ideas', error });
    }
  });



  app.post('/confirmidea', async (req, res) => {
    const { idea, email } = req.body;
  
    if (!idea || !email) {
      return res.status(400).json({ message: 'Idea and Submitted By are required' });
    }
  
    console.log('Incoming request data:', req.body);
  
    try {
      const newIdea = new IdeaConfirm({ idea, email });
      await newIdea.save();
      res.status(201).json(newIdea);
    } catch (error) {
      console.error('Error saving idea:', error); // Log detailed error
      res.status(500).json({ message: 'Error adding idea', error });
    }
  });
  


  app.delete('/ideas/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const idea = await Idea.findByIdAndDelete(id);
  
      if (!idea) {
        return res.status(404).json({ message: 'Idea not found' });
      }

      idea.confirmed = true;  // Example of confirming an idea
    await idea.save();
  
      res.status(200).json({ message: 'Idea deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting idea', error });
    }
  });
  


app.listen(3001, () =>{
    console.log('server is running')
})