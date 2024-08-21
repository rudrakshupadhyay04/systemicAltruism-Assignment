import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose'
import YouTube from 'youtube-api';
import Giphy from 'giphy-api';
import { Content } from './model/content.model.js';
import { User } from './model/user.model.js';
import google from 'googleapis';
import dotenv from 'dotenv';

const app = express();

dotenv.config();
mongoose.connect('mongodb://localhost/interdimensional-comedy', { useNewUrlParser: true, useUnifiedTopology: true });




app.use(cors());
app.use(express.json());

// YouTube API setup
const youtube = new YouTube({
  type: 'oauth',
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECERATE,
  redirect_uri: 'https://www.google.com'
});


  
  async function getLiveChatId() {
    try {
      const response = await youtube.liveBroadcasts.list({
        part: 'snippet',
        mine: true, // Only return broadcasts owned by the authenticated user
        broadcastStatus: 'active' // Only return active live broadcasts
      });
  
      if (response.data.items.length === 0) {
        console.log('No active live broadcasts found.');
        return null;
      }
  
      const liveBroadcast = response.data.items[0]; // Get the first active live broadcast
      const liveChatId = liveBroadcast.snippet.liveChatId;
  
      console.log('Live Chat ID:', liveChatId);
      return liveChatId;
    } catch (error) {
      console.error('Error fetching live chat ID:', error);
      return null;
    }
  }
  
  // Call the function to get liveChatId
  const liveChatId = getLiveChatId();


// Giphy setup
const giphy = new Giphy({
  api_key: process.env.API_KEY
});

// Content Management System (CMS) routes
app.post('/upload-content', (req, res) => {
  const content = new Content(req.body);
  content.save((err, content) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(content);
    }
  });
});

app.get('/content', (req, res) => {
  Content.find().then((content) => {
    res.send(content);
  }).catch((err) => {
    res.status(500).send(err);
  });
});


app.post('/youtube-chat', (req, res) => {
    const { message } = req.body;
  
    youtube.liveChatMessages.insert({
      part: 'snippet',
      resource: {
        snippet: {
          liveChatId: liveChatId, // Include the liveChatId here
          type: 'textMessageEvent',
          textMessageDetails: {
            messageText: message
          }
        }
      }
    }, (err, data) => {
      if (err) {
        console.error('Error posting message:', err); // Log the error for debugging
        res.status(500).json({ message: "Something went wrong!!!", error: err });
      } else {
        res.status(200).json({ message: "Everything works perfectly!!!", data: data });
      }
    });
  });
  

// Watermarking
app.post('/watermark', (req, res) => {
  const { videoUrl } = req.body;
  const watermark = 'interdimensional comedy';
  const watermarkedVideoUrl = `${videoUrl}?watermark=${watermark}`;
  res.send(watermarkedVideoUrl);
});


// User management
app.post('/user', (req, res) => {
  const { username } = req.body;
  const user = new User({ username });
  user.save((err, user) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(user);
    }
  });
});

app.get('/user', (req, res) => {
  User.find().then((users) => {
    res.send(users);
  }).catch((err) => {
    res.status(500).send(err);
  });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});