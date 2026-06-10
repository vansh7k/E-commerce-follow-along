# Ecommerce-Follow-Along

     A hands-on project demonstrating the power of the MERN stack by creating a functional e-commerce platform.

## E-Commerce Application using MERN Stack

Welcome to the E-Commerce Application project! 🚀 This project involves building a full-fledged e-commerce platform from scratch using the **MERN stack** (MongoDB, Express.js, React.js, and Node.js). This repository serves as a comprehensive guide and documentation for the application.

---

## 🌟 Features of the Application

- **User Authentication**: Secure registration and login system.
- **Product Management**: Add, update, and retrieve product details.
- **Order Handling**: Seamlessly manage customer orders.
- **REST API Integration**: Well-structured endpoints for interaction.
- **Database Schema Design**: Efficient schema structure in MongoDB.
- **Authentication & Authorization**: Role-based access for secure transactions.

## Milestones 

### Milestone 1: Repository Creation

- Created a GitHub repository named "Ecommerce-Follow-Along" with a README file.

### Milestone 2: Initial Setup & Login Page

- Pushed code to the GitHub repository.
- Created separate folders for frontend and backend.
- Implemented a functional Login Page in the frontend.

### Milestone 3: Project Setup & Foundation

- Established project structure, database connection, and basic error handling.

### Milestone 4: User Authentication & File Uploads

- Implemented user registration, login, and file upload functionalities.
- Integrated user authentication and authorization middleware.

### Milestone 5: User Signup

- Created the Signup page with form validation.

### Milestone 6

1. **Encrypt Password:**

   - Hash the user's password using `bcrypt` during signup.
   - Store the hashed password in the database.

2. **Store User Data:**
   - Save all user data (e.g., name, email) in the database.
   - Ensure the password remains encrypted and secure.

### Milestone 7:

**Login Endpoint**

1. **Accept User Credentials:** Receive user input for email/username and password.
2. **Retrieve User:** Query the database to find the user associated with the provided credentials.
3. **Password Validation:**
   - Hash the entered password using `bcrypt`.
   - Compare the hashed input with the stored hashed password in the database.
   - If they match, authentication is successful.

### Milestone 8: Product Card & Homepage Layout

- Created a reusable Card Component with props for product details.
- Designed the Homepage layout using a grid or flexbox to display multiple product cards.
### Milestone 9: Product Form Creation

1. **Create Product Form:**
   - Make a form for adding product details like name, description, price, and images.

2. **Image Uploads:**
   - Allow users to upload multiple images for the product.

3. **Form Validation:**
   - Check that the form fields are filled correctly (e.g., price is a number, name is not empty).

### Milestone 10: Product Schema & Endpoint

1. **Product Schema:**
   - Define product details (name, description, price, image URL) using Mongoose with validation.

2. **Endpoint Creation:**
   - Create a POST endpoint to save product data to MongoDB.

3. **Why Validation?**
   - Ensures only valid data is saved, keeping the database accurate.


### Milestone 11: Display Products Dynamically

1. **Backend:**
   - Create an endpoint to send all product data from MongoDB to the frontend.

2. **Frontend:**
   - Write a function to fetch product data from the backend.
   - Pass the fetched data to the product card component.

3. **Dynamic Display:**
   - Use the product card component to display all products dynamically on the page.

## Milestone 12: My Products Page
 This milestone focuses on creating a "My Products" page that displays only the products added by the logged-in user (identified by their email).

**Key Objectives:**

* Implement a backend endpoint that retrieves products from MongoDB, filtering by the user's email address.

* Create a frontend function to fetch the filtered product data from the endpoint.

* Dynamically render the retrieved product data on the "My Products" page using the existing product card component.

## Milestone 13: Product Update Endpoint and Form Auto-fill

- **Update Endpoint**: Developed a PUT endpoint to receive updated product data and modify the corresponding document in MongoDB.
- **Frontend Integration**: Added an "Edit" button to the product card. Clicking it pre-fills the product form with existing data for editing.
- **Form Auto-fill**: Implemented functionality to populate the product form with the selected product's details, enabling easy modification.
- **Data Persistence**: Ensured that the updated product data is correctly saved to the MongoDB database.
- **Testing**: Verified the update functionality using Postman and by testing the edit flow in the application.
- **GitHub Updates**: Committed all changes related to the update endpoint and form auto-fill to the repository.

---

## Milestone 14: Product Delete Endpoint

- **Delete Endpoint**: Created a DELETE endpoint to remove a product from MongoDB based on its ID.
- **Frontend Integration**: Added a "Delete" button to the product card. Clicking it triggers the deletion of the corresponding product.
- **Confirmation**: Implemented a confirmation dialog before deleting a product to prevent accidental deletions.
- **Data Removal**: Ensured that the product is successfully removed from the MongoDB database.
- **Testing**: Verified the delete functionality using Postman and by testing the delete flow in the application.
- **GitHub Updates**: Committed all changes related to the delete endpoint and frontend integration to the repository.

---

## Milestone 15: Navigation Component

