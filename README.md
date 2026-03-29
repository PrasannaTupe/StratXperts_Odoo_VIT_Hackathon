
# Odoo x VIIT: Smart Reimbursement Management System
---
### **Overview**
A robust, automated expense reimbursement platform designed to eliminate manual processing errors, provide multi-level approval transparency, and streamline corporate spending. Built with a focus on flexible approval workflows and OCR-driven automation.

## Key Features

### **1. Intelligent Authentication & Setup**
* **Auto-Provisioning**: On first login, a new Company and Admin user are automatically initialized
* **Localized Environment**: Automated currency setting based on the company's regional environment.
* **Role-Based Access (RBAC)**: Distinct interfaces and permissions for **Admins, Managers, and Employees**.

### **2. Advanced Approval Engine**
* **Multi-Level Sequences**: Define custom approval steps (e.g., Manager ➔ Finance ➔ Director).
* **Conditional Logic**:
    * **Percentage Rule**: Approve based on a threshold of approver consensus (e.g., 60% approval).
    * **Specific Approver Rule**: Auto-approval triggers if a designated high-level official (e.g., CFO) approves.
    * **Hybrid Logic**: Combinations of percentage and specific role overrides.
* **Threshold-Based Routing**: Define custom flows based on expense amounts.

### **3. Seamless Employee Experience**
* **OCR Receipt Scanning**: Automated expense generation using OCR algorithms to extract amount, date, description, and vendor name.
* **Multi-Currency Support**: Submit expenses in any currency with real-time conversion to the company's base currency.
* **Status Tracking**: Real-time visibility into the "Approved" or "Rejected" history.
---
### Frontend Previews:
**1. Login Page:**
<img width="1470" height="796" alt="image" src="https://github.com/user-attachments/assets/11ae3485-0c54-46ca-9730-f0f1fc00fff5" />
---
**2. Admin Dashboard:**
<img width="1470" height="796" alt="image" src="https://github.com/user-attachments/assets/3d53d834-5b63-484a-888d-d667d7a00b4d" />
---
**3. Manager Dashboard:**
<img width="1470" height="797" alt="image" src="https://github.com/user-attachments/assets/e8f3104e-b1e4-4a5b-a13b-02b10ad41158" />
---
**5. Employee Dashboard:**
<img width="1470" height="798" alt="image" src="https://github.com/user-attachments/assets/611de69b-bdba-4b2d-8ff7-ef8e63b7f252" />
---
## Tech Stack
* **Frontend**: HTML5, Tailwind CSS (Dark Mode), JavaScript
* **Backend**: Node.js, Python
* **Database**: SQL MySql
* **APIs**: 
    * [Rest Countries API](https://restcountries.com/v3.1/all) for localization.
    * ExchangeRate API](https://api.exchangerate-api.com/v4/latest/) for currency conversion.



---
**Developed by Team:** StratXperts 
**Institution:** Vishwakarma Institute of Information Technology (VIIT)  
**Hackathon:** ODOOxVIT 2026

