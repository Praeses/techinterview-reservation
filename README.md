The website is hosted at http://default-environment.47bjjmtcf6.us-east-2.elasticbeanstalk.com.
Please use this link to view the website.

If you would prefer to run the website locally, use the instructions below.
1) In the root directory of the application, run npm install to install the required dependencies.  
2) In /public/javascript/seating_chart.js, comment out the url for AWS on line 6 and comment in line 7 for the local host url.
3) Create a directory named "config" in the root directory.  In config, create a file named "dbconnect.js".  
4) In dbconnect.js add the following lines
    var mysql = require("mysql");
    var pool = mysql.createPool({
        host  : "your host",
        user  : "your username",
        password: "your database password",
        database: "seat_reservation"
    });
    module.exports.pool = pool;


    For example, my dbconnect.js for local testing looks like 
    var mysql = require("mysql");
    var pool = mysql.createPool({
        host  : 'localhost',
        user  : 'root',
        password: 'testPassword',
        database: 'seat_reservation'
    });
    module.exports.pool = pool;

5) You will need to create a database schema named "seat_reservation".  Upon running the website for the first time, it will create the necessary table in the schema.
6) In the root directory, begin the application with "node app.js"


Intructions for Nagivating Website
Click the "Movies" link in the navbar to see the list of movies and showtimes.
Click a showtime to see a seating chart for that showing.
Seats that are dark gray are available and seats that are a light gray are already reserved.
Click on available seats to select or unselect them.
When you have made your selections, click the reserve seats button at the bottom left of the seating chart.
On the checkout page, enter your email address in each form input and click the submit button to reserve your seats.
If you wish to edit your selected seats, click the edit button to return to the previous page.


# Technical Interview Homework: Movie Theater Seat Reservations

## Purpose
The purpose of this exercise is to assess the candidate's ability to build software that satisfies stated requirements. The completed assignment should not only satisfy the requirements outlined below, but also give the candidate an opportunity to show-off their skills.

## Prerequisites
- Candidates must have a GitHub account

## Instructions
1. Fork this repository - [https://github.com/Praeses/techinterview-reservation](https://github.com/Praeses/techinterview-reservation)
2. Create a web application that satisfies the requirements below
3. Include, at the top of this README, instructions required for the reviewer to run the submission
4. Include, at the top of this README, any other information that will be useful to the reviewer
5. Create a pull request prior to the due date to have your submission reviewed

Once the submission is reviewed the candidate will be notified and possibly invited to participate in a follow-up interview where interviewers will collaboratively work with the candidate to review the submission, discuss possible enhancements, and possibly implement a new feature. 

##### Additional Notes...
- Feel free to ask your point of contact any clarifying questions you might have. 
- Submissions must be relatively trivial to run as outlined in the candidate's instructions. We suggest that you test the run instructions on a clean clone of your repository. **Submissions we can't run per the instructions will be rejected.**
- Client technology for the submission is at the discretion of the candidate.
- Third party libraries or packages are acceptable but must be managed via a package manager i.e. Nuget, npm, bower, etc. Third party components will NOT be manually installed by the reviewer.

## Requirements - Movie Theater Seat Reservations
Create a web application that allows you to reserve a set of seats for a screening of a movie at a movie theater. (The movie / movie theater are your fictional creation - it is not expected to actually interface with real movie theaters)

##### Minimum Requirements
- Display the seats in a view that resembles a movie theater's seating chart.
- Allow the user to view which seats are Available and which are already Reserved.
- The user should be able to select seats and submit, which will save the Reservations.
- Another user visiting the site afterwards would see that those seats are already Reserved (the data will need to be persisted somewere outside of the browser).

##### Optional (stretch / bonus) Enhancements
- Mobile / touch friendly design.
- Using a serverless technology (e.g., Auth0 Extend, AWS Lambda, Azure Functions, etc.).
- Support for multiple movies / movie times. 
- Surprise us!
