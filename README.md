# Job Application Tracker

A full-stack web application to organize and track job applications with a clean interface, useful insights, and efficient data management.  
Built with **React**, **Django**, and **PostgreSQL**, and fully containerized with **Docker** for simple setup and deployment.

---

## Current features

- Add, edit, and delete job applications  
- Track company, role, status, submission date, location type, etc.  
- Search and filter applications  
- Detailed view for each application  
- Clean, responsive UI  
- Fully containerized (one command to run everything)

## Tech Stack

### **Frontend**
- React  
- React Router  
- Axios  

### **Backend**
- Django  
- Django REST Framework  
- PostgreSQL  


## Getting Started

### **Prerequisites**
- Docker  
- Docker Compose  

### **Clone the Repository**
```bash
git clone https://github.com/Alexis-Marquez/JobAppTracker.git
cd job-application-tracker
### **Run the App**
docker compose up --build
```

## Environment Variables

### **Backend (`backend/.env`)**
```env
POSTGRES_DB=jobtracker
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
VITE_API_URL=http://localhost:8000/api
```

## License

This project is licensed under the **MIT License**.  
You are free to use, modify, and distribute this software, as long as the original license is included.

