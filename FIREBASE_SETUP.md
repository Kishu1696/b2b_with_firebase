# 🔥 Firebase Setup Guide

## Step 1 — Firebase Project Banayein

1. https://console.firebase.google.com par jayein
2. **"Add project"** click karein
3. Project name dalein (e.g. `b2b-platform`)
4. Google Analytics enable/disable karein (optional)
5. **"Create project"** click karein

---

## Step 2 — Authentication Enable Karein

1. Left sidebar → **Build → Authentication**
2. **"Get started"** click karein
3. **Sign-in method** tab → **Email/Password** select karein
4. Enable toggle on karein → **Save**

---

## Step 3 — Firestore Database Banayein

1. Left sidebar → **Build → Firestore Database**
2. **"Create database"** click karein
3. **Production mode** select karein → **Next**
4. Location choose karein (e.g. `asia-south1` for India) → **Enable**

### Firestore Security Rules (Paste karein)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users: sirf apna profile padhein/likhein
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Inventory, Buyers, etc: authenticated users padhein
    match /inventory/{doc} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    match /buyers/{doc} {
      allow read, write: if request.auth != null;
    }
    
    match /transactions/{doc} {
      allow read, write: if request.auth != null;
    }
    
    match /auctions/{doc} {
      allow read, write: if request.auth != null;
    }
    
    match /shipments/{doc} {
      allow read, write: if request.auth != null;
    }
    
    match /contracts/{doc} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## Step 4 — App Register Karein aur Config Copy Karein

1. Project Overview page par **`</>`** (Web) icon click karein
2. App nickname dalein → **Register app**
3. `firebaseConfig` object copy karein
4. Project mein `.env` file banayein (`.env.example` ko copy karein):

```bash
cp .env.example .env
```

5. `.env` file mein apni values paste karein:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

---

## Step 5 — Project Run Karein

```bash
npm install
npm run dev
```

---

## Collections (Automatic ban jaate hain)

Jab pehli baar data add hoga, ye Firestore collections automatically create ho jaayenge:

| Collection | Description |
|---|---|
| `users` | User profiles (uid se linked) |
| `inventory` | Inventory items |
| `buyers` | Buyer CRM data |
| `transactions` | Sales transactions |
| `auctions` | Auction listings |
| `shipments` | Logistics data |
| `contracts` | Contract records |

---

## Firestore Use Kaise Karein (Code Example)

```typescript
import { addInventoryItem, getInventory, subscribeInventory } from "@/lib/firestore";

// Data fetch karo
const items = await getInventory(50);

// Naya item add karo
const id = await addInventoryItem({
  sku: "LF-00001",
  productName: "Smart Display Lot 1",
  category: "Electronics",
  quantity: 100,
  warehouse: "Phoenix DC",
  region: "West",
  age: 30,
  marketValue: 50000,
  liquidationValue: 30000,
  status: "Listed",
});

// Real-time subscribe karo
const unsub = subscribeInventory((items) => {
  console.log("Live update:", items);
});
// Cleanup: unsub();
```
