import React from 'react';
import Navbar from '../Navbar/Navbar';
import './about.css';

const About = () => {
  return (
    <div className="about-container">
        <div className='navbar-no-margin'>
      <Navbar/>
      </div>
      <h2 className="about-heading">About Our Web Development Forum Group</h2>
      <div className="about-content">
        <p>Welcome to our Web Development Forum Group! We are a community of web developers and enthusiasts who come together to share knowledge, discuss industry trends, and collaborate on projects.</p>
        <p>Whether you are a beginner just starting out or an experienced developer, our forum provides a platform for learning, networking, and seeking advice from fellow members.</p>
        <p>Key features of our forum group:</p>
        <ul>
          <li>Engage in discussions on various web development topics</li>
          <li>Ask questions and get answers from experienced developers</li>
          <li>Share your projects and receive feedback</li>
          <li>Stay updated with the latest web development trends</li>
          <li>Connect with like-minded individuals in the field</li>
        </ul>
        <p>Join our forum group today and be a part of our vibrant community!</p>
      </div>
    </div>
  );
};

export default About;
