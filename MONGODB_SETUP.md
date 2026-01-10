# MongoDB Atlas Free Setup Guide (Hinglish)

Bhai, is project ko chalane ke liye aapko ek free MongoDB database chahiye hoga. Neeche diye gaye steps follow karein:

## 1. Create MongoDB Atlas Account
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) par jayein aur apna free account banayein.
- Ek naya Project create karein (e.g., "HR-Portal").

## 2. Deploy a Free Cluster
- "Create a Deployment" par click karein.
- **M0 (Free)** tier select karein. Ismein aapka koi paisa nahi lagega.
- Cloud Provider (AWS/Google Cloud/Azure) aur Region select karein (e.g., Mumbai or any close location).
- Cluster ka naam rakhein aur "Create" par click karein.

## 3. Database Access (User Setup)
- "Database Access" section mein jayein.
- Ek naya Database User banayein (e.g., username: `admin`, password: `your_password`).
- Is user ko **"Read and write to any database"** role dein.

## 4. Network Access (IP Whitelist)
- "Network Access" section mein jayein.
- "Add IP Address" par click karein.
- **"Allow Access From Anywhere"** (0.0.0.0/0) select karein (Development ke liye best hai).

## 5. Get Connection String
- Cluster ke "Connect" button par click karein.
- "Drivers" select karein (Node.js version 5.5 or later).
- Aapko ek connection string milegi, jo aisi dikhegi:
  `mongodb+srv://admin:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority`

## 6. Project Setup (.env.local)
- Project ke root folder mein ek `.env.local` file banayein (agar nahi hai).
- Usmein ye values dalein:
  ```env
  MONGODB_URI=mongodb+srv://admin:<password>@cluster0.abcde.mongodb.net/hr_portal?retryWrites=true&w=majority
  JWT_SECRET=bhai_ye_kuch_bhi_random_string_rakh_lo_12345
  ```
> [!IMPORTANT]
> `<password>` ki jagah apna asli password bhi dalein jo aapne step 3 mein banaya tha.

---
## Fixing Errors (Lint/Import Errors)
Bhai, jo "Cannot find module 'next'" wale errors dikh rahe hain, wo isliye hain kyunki abhi system ko pata nahi hai ke dependencies installed hain. 

**Bas ye command run karein terminal mein:**
```bash
npm install
```
Ye command saari zaruri files (Next.js, MongoDB, React, etc.) download kar legi aur saare errors khatam ho jayenge.
