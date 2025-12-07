Objective
Design, implement, and demonstrate a complete end-to-end CI/CD pipeline using a combination of tools covered during the course, along with the knowledge and experience you gained with other tools in your other courses in this term as well as last term. The pipeline should automate the building and delivery/deployment of any web application or a software and its associated infrastructure using all possible best practices.

Project Requirements
Application

Create OR find an existing simple web application or a software (e.g., a static website or a dynamic app using Node.js, Python, or any other language of your choice).
The application should include at least three backend APIs, a frontend component, and a database.
Infrastructure as Code (IaC)

Use AWS CloudFormation or AWS CDK or Terraform to define infrastructure (depending on your chosen Cloud Provider).
Provide modular and reusable IaC templates.
Version Control

Host your application code and IaC templates in a GitHub, BitBucket, etc.
Use a branching strategy for development and production environments.
You should have one 'master/main' branch. Feature branches for each member of the group.
There should be at least 5 commits per each application component and from each team member.
Demonstrate the use of Code Review and Pull Requests by having your team-mate as a reviewer. (Provide screenshots)
For every feature developed or whenever you need things merged into your master branch, always create Pull Requests and have it reviewed and approved by your team mates. I am expecting at least 5 PRs.
CI/CD Pipeline

Build and deploy the application using a CI/CD pipeline with one of the following tools:
GitHub Actions
Jenkins
AWS CodePipeline
Azure Pipelines
The pipeline must include the following stages:
Source Stage: Integrate with your version control repository.
Code Scanning (Bonus): Use any third party code scanning tool to get your code scanned and provide results of vulnerability scan results. If you are containerizing your application then you could also get your docker image scanned too. 
Build Stage: Compile/build application and validate infrastructure templates.
Test Stage: Run automated tests (at least 5 unit or integration tests). It should also show the code coverage.
Deploy Stage: Deploy the application and infrastructure to a cloud provider of your choice.
Automated Triggers

Set up automated triggers to initiate the pipeline whenever there are commits to specific branches.
Monitoring and Logging

Implement logging and monitoring for deployed resources using AWS CloudWatch or similar tools.
Demonstrate how the logs can be used to troubleshoot deployment issues.
Documentation and Presentation

Submit a detailed project report that includes:
A description of your application and infrastructure.
The pipeline design with stages and tools used.
Challenges faced and how they were overcome.
Prepare a 10-minute presentation showcasing the pipeline workflow, application, and deployed infrastructure. (No powerpoint slides, JUST pure working demonstration)
Grading Criteria
Category	Weight
Application Functionality	20%
Infrastructure Definition (IaC)	20%
CI/CD Pipeline Implementation	30%
Monitoring and Logs	5%
Documentation and Presentation	25%
