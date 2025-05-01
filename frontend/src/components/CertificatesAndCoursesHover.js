import React from "react";
import "./CertificatesAndCourses.css"; // Import CSS file for styling

const certificates = [
  // Example certificates – add more objects as needed
  { id: 1, title: "IBM Full Stack Software Developer", imgSrc: "/images/IBM_FULL_STACK.jpeg" },
  { id: 2, title: "Django Application Development with SQL and Databases", imgSrc: "/images/ibm_django_sql_data.jpeg" },
  { id: 3, title: "Getting Started with Git and GitHubb", imgSrc: "/images/ibm_git_github.jpeg" },
  { id: 4, title: "Introduction to Containers w/ Docker, Kubernetes & OpenShift", imgSrc: "/images/ibm_docker_kuber.jpeg" },
  { id: 5, title: "Introduction to Cloud Computing", imgSrc: "/images/ibm_cloud_computing.jpeg" },
  { id: 6, title: "Application Development using Microservices and Serverless", imgSrc: "/images/IBM_micro_ser.jpeg" },
  { id: 7, title: "AWS Cloud Technical Essentials", imgSrc: "/images/aws_cer.jpeg" },
  { id: 8, title: "Introduction to Software Engineering", imgSrc: "/images/ibm_software_eng.jpeg" },
  { id: 9, title: "Developing AI Applications with Python and Flask", imgSrc: "/images/ibm_ai_flask.jpeg" },
  { id: 10, title: "Developing Front-End Apps with React", imgSrc: "/images/ibm_front_react.jpeg" },
  { id: 11, title: "Developing Back-End Apps with Node.js and Express", imgSrc: "/images/ibm_backend_node.jpeg" },
  { id: 12, title: "Introduction to HTML, CSS, & JavaScript", imgSrc: "/images/ibm_html_css_js.jpeg" },
  { id: 13, title: "Python for Data Science, AI & Development", imgSrc: "/images/ibm_python_data_science.jpeg" },
  { id: 14, title: "Tools for Data Science", imgSrc: "/images/ibm_tools_data.jpeg" },
  { id: 15, title: "Full Stack Application Development Capstone Project", imgSrc: "/images/ibm_ful_cap.jpeg" },
  { id: 16, title: "Generative AI: Elevate your Software Development Career", imgSrc: "/images/ibm_gen_ai.jpeg" },
  { id: 17, title: "Practical Machine Learning", imgSrc: "/images/data_workshop.png" },
  { id: 18, title: "Financial Markets", imgSrc: "/images/fin_mark.jpeg" },
  { id: 19, title: "Professional Trading Masterclass", imgSrc: "/images/institute_trading.png" }
];

const courses = [
  // Example additional courses
  { id: 1, name: "Mastering Linux: The Comprehensive Guide", link: "https://www.udemy.com/course/mastering-linux/" },
  { id: 2, name: "Master Git and GitHub in 5 Days: Go from Zero to Hero", link: "https://www.udemy.com/course/master-git-and-github-in-5-days-go-from-zero-to-hero/" },
  { id: 3, name: "Python and Django Full Stack Web Developer Bootcamp", link: "https://www.udemy.com/course/python-and-django-full-stack-web-developer-bootcamp/" },
  { id: 4, name: "Interactive Python Dashboards with Plotly and Dash", link: "https://www.udemy.com/course/interactive-python-dashboards-with-plotly-and-dash/" },
  { id: 5, name: "Deep Learning with Python and Keras", link: "https://www.udemy.com/course/deep-learning-with-python-and-keras/" },
  { id: 6, name: "Build Interactive Plotly & Dash Dashboards with Data Science", link: "https://www.udemy.com/course/plotly-dash/" },
  { id: 7, name: "Learn Streamlit Python", link: "https://www.udemy.com/course/learn-streamlit-python/" },
  { id: 8, name: "Learn Web Scraping with Python from Scratch", link: "https://www.udemy.com/course/web-scraping-python-tutorial/" },
  { id: 9, name: "Manage Finance Data with Python & Pandas: Unique Masterclass", link: "https://www.udemy.com/course/finance-data-with-python-and-pandas/" },
  { id: 10, name: "The Complete Python Bootcamp From Zero to Hero in Python", link: "https://www.udemy.com/course/complete-python-bootcamp/" },
  { id: 11, name: "Python Django: Ultimate Web Security Checklist - 2025", link: "https://www.udemy.com/course/python-django-ultimate-web-security-checklist-2022" },
  { id: 12, name: "Python Django for AWS Development - Mastery course - Part 1", link: "https://www.udemy.com/course/python-django-for-aws-development-mastery-course-part-1" }
];

const CertificatesAndCoursesHover = () => {
  return (
    <div className="certificates-courses">
      {/* Certificates Section */}
      <section className="certificates-section">
        <h2>Certificates</h2>
        <div className="certificates-grid">
          {certificates.map((cert) => (
            <div key={cert.id} className="certificate">
              <img src={cert.imgSrc} alt={cert.title} className="certificate-img" />
              <p>{cert.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Additional Courses Section */}
      <section className="courses-section">
        <h2>Additional Courses</h2>
        <ul className="courses-list">
          {courses.map((course) => (
            <li key={course.id}>
              <a href={course.link} target="_blank" rel="noopener noreferrer">
                {course.name}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default CertificatesAndCoursesHover;
