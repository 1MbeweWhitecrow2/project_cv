import React from "react";
import "./AboutProject.css"; // Import opcjonalnego pliku CSS dla stylizacji

const AboutProject = () => {
  
  return (
    <section className="my-way">
      <div className="bio">
        <h1>About Project</h1>
        <p>

        Welcome to my developer portfolio – not just another resume site.

        This is a real, full-stack web application, built with React, powered by Django, connected to a PostgreSQL database, and deployed on AWS with Docker.

        Why this site? Because certificates can be misleading, and bootcamp diplomas don’t always tell the full story. I wanted to give you something more concrete: a live, working proof of the skills I claim. Every chart, dataset, and feature on this platform was built to showcase my ability to work with real data – from retrieval and processing to analysis and interactive visualization.

        Think of this platform as a technical sandbox — a curated sample of what I can do, with code to back it up.

        🔒 Most features require registration — not to harvest your data (I don’t do that) — but to keep bots and spam out. It’s a simple barrier to keep the experience clean.

        So if you’re a recruiter, hiring manager, or just curious — sign up, explore the features, check out the code, and see for yourself.

        Let the work speak.
        </p>

        {/* Przykładowa grafika między blokami tekstu */}
        <div className="bio-image">
          <img src="/images/Landing_Page.png" alt="First Step" />
        </div>
      </div>
    </section>
  );
};

export default AboutProject;