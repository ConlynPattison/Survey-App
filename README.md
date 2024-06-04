# Survey-App

## Description
---

-insert name here- is a full stack web application that embodies a flexible survey page that allows for users to take surveys within team environments. Users can have their survey results from various submissions compared against one another. Team owners can request raw data and visualizations of surveys across all or specified user submissions. Surveys can be manipulated by team owners without losing the possibility of either comparitive method.

## Technologies Used
---

<div>
	<img src="https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white">
	<img src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white">
	<img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB">
	<img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white">
	<img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white">
	<img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB">
	<img src="https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white">
	<img src="https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white">
	<img src="https://img.shields.io/badge/daisyui-5A0EF8?style=for-the-badge&logo=daisyui&logoColor=white">
	<img src="https://img.shields.io/badge/zod-%233068b7.svg?style=for-the-badge&logo=zod&logoColor=white">
	<img src="https://img.shields.io/badge/Twilio-F22F46?style=for-the-badge&logo=Twilio logoColor=white">
	<img src="https://img.shields.io/badge/-mocha-%238D6748?style=for-the-badge&logo=mocha&logoColor=white">
</div>

## Stories & State Requirements
---

### As a User...
1. [ ] Users must login with an email to access Teams and Surveys
2. [ ] Users can create a Team
3. [ ] Users login with a password that is stored via encryption
4. [ ] Users have a first name, last name

### As a Team Member...
1. [ ] Team members can access the team surveys available to them on the team dashboard
2. [ ] Team members can see whether a survey has remaining attempts

### As an a Team Admin...
1. [ ] Team admins can create surveys within the team scope
2. [ ] Team admins can change the access state of the team (see Team state story)
3. [ ] Team admins can send invitations to users via email address (if the email does not exist, an email to join the team is sent to the address)
4. [ ] Team admins can duplicate a survey under a new name (deep copy?)
5. [ ] Team admins can edit the content found in survey section nodes
6. [ ] Team admins can create new nodes on a survey section
7. [ ] Team admins can delete nodes from a survey section
8. [ ] Team admins can delete survey sections

### As an Application Admin...

### Team states...
1. [ ] Teams can be restricted to be public, by user invite, private, or gatekept by authenticated email domain

### Survey states...
1. [ ] Surveys can be limited to a specified number of attempts per user
2. [ ] Surveys can be made up of simple questions with a number range response (easy)
3. [ ] Surveys are made up of multiple sections, and each section will represent a given page when the survey is being taken
4. [ ] Surveys can be declared as a "variant" of another survey to allow for users to compare across survey result
5. [ ] Surveys hold when they were created and last edited

### Survey Section states...
1. [ ] Sections begin with a header
2. [ ] Sections, following the header item, are made up of Nodes
3. [ ] Sections when being deleted allow for either nodes of the section to be deleted or shifted up (or down if top section is deleted) into the next section

### Survey Section Header states...
1. [ ] Headers can have a heading, description, image

### Survey Section Node states...
1. [ ] Nodes can be either a question, title & description, image, or video
2. [ ] Node ordering can be changed dynamically through drag & drop