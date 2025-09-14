# EcoCiclo - Backend Integration Guide

## 🌟 Project Overview

EcoCiclo is a modern web application that connects people who want to recycle materials with local collectors, creating an efficient and gamified ecosystem for waste management. The platform offers two distinct user roles:

- **👨‍🚀 Poster**: Users who post recyclable materials for collection
- **🚴 Collector**: Users who pick up recyclable materials from posters

## 🚀 Frontend Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm (or compatible package manager)

### Getting Started
1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```
4. **Build for production:**
   ```bash
   npm run build
   ```

## 🔧 Environment Variables

The frontend uses the following environment variables:

```env
# Optional: Mapbox token for map functionality
VITE_MAPBOX_TOKEN=your_mapbox_token_here

# API Base URL (you'll need to set this)
VITE_API_BASE_URL=http://localhost:3000/api
```

## 📋 API Integration Points

### 🔍 Key Files for Backend Integration

1. **`src/types/api.ts`** - API service interfaces that define the contract
2. **`src/types/index.ts`** - Data models and types
3. **`src/api/mockApi.ts`** - Current mock implementation (REPLACE THIS)

### 🎯 API Services to Implement

#### Authentication Service (`AuthService`)
```typescript
interface AuthService {
  login(username: string, password: string): Promise<User | null>
  register(username: string, password: string): Promise<User>
  updateUserRole(userId: string, role: 'collector' | 'poster'): Promise<User | null>
  getCurrentUser(): Promise<User | null>
}
```

**Suggested Endpoints:**
- `POST /api/auth/login`
- `POST /api/auth/register`
- `PUT /api/auth/users/:userId/role`
- `GET /api/auth/me`

#### Item Management Service (`ItemService`)
```typescript
interface ItemService {
  createItem(itemData: Omit<PostedItem, 'id' | 'postedAt' | 'status'>, userId: string): Promise<PostedItem>
  getAvailableItems(): Promise<RecyclableItem[]>
  getPostedItems(userId: string): Promise<PostedItem[]>
  acceptItem(itemId: string, collectorUsername: string): Promise<PostedItem | null>
  completePickup(itemId: string, collectorUserId: string): Promise<PostedItem | null>
  getUserStats(userId: string): Promise<UserStats | null>
  getPosterStats(userId: string): Promise<PosterStats | null>
  resetApp(): Promise<void> // Development only
}
```

**Suggested Endpoints:**
- `POST /api/items`
- `GET /api/items/available`
- `GET /api/items/posted/:userId`
- `PUT /api/items/:itemId/accept`
- `PUT /api/items/:itemId/complete`
- `GET /api/users/:userId/stats`
- `GET /api/users/:userId/poster-stats`
- `DELETE /api/admin/reset` (development only)

## 📊 Data Models

### Core Entities

#### User
```typescript
interface User {
  id: string
  username: string
  password: string // Hash this in your backend!
  role: 'collector' | 'poster' | null
  displayPhoto: string
  createdAt: Date
}
```

#### RecyclableItem
```typescript
interface RecyclableItem {
  id: string
  title: string
  description: string
  image: string
  points: number
  materials: MaterialQuantity[]
  totalWeight: number
  location: {
    address: string
    distance: number // km from collector
  }
  postedAt: Date
}
```

#### PostedItem (extends RecyclableItem)
```typescript
interface PostedItem extends RecyclableItem {
  status: 'active' | 'accepted' | 'completed'
  acceptedBy?: string
  acceptedAt?: Date
  completedAt?: Date
  rating?: number
}
```

### Statistics

#### UserStats (for collectors)
```typescript
interface UserStats {
  totalPickups: number
  rating: number
  completedToday: number
}
```

#### PosterStats (for posters)
```typescript
interface PosterStats {
  totalPosts: number
  totalRecycled: number
  rating: number
  activeItems: number
  totalPoints: number
  pointsThisWeek: number
}
```

## 🔄 Integration Process

### Step 1: Replace Mock Implementation
1. Open `src/api/mockApi.ts`
2. Replace the mock functions with actual HTTP requests
3. Use the interfaces from `src/types/api.ts` as your contract
4. Maintain the same method signatures and return types

### Step 2: Update API Base URL
1. Set `VITE_API_BASE_URL` environment variable
2. Create an HTTP client (axios, fetch, etc.)
3. Handle authentication tokens/sessions

### Step 3: Error Handling
- Use the `ApiError` and `ApiErrorCode` types from `src/types/api.ts`
- Implement consistent error responses
- Handle network errors gracefully

### Step 4: Authentication
- Implement JWT tokens or session-based auth
- Store tokens securely (httpOnly cookies recommended)
- Handle token refresh if needed

## 🎮 Business Logic Notes

### Points System
- Points are calculated based on material type and weight
- Electronic items have highest value (100 pts/kg)
- Paper items have lowest value (30 pts/kg)
- Points are awarded when items are completed, not when posted

### Item Status Flow
1. **active** - Item is posted and available for pickup
2. **accepted** - A collector has accepted the item
3. **completed** - The pickup has been completed (QR code scanned)

### User Roles
- Users can only have one role at a time
- Role determines which interface they see
- New users start with `role: null` and must select a role

## 🗂️ Files to Remove After Integration

Once your backend is integrated, you can safely remove these mock files:
- `src/api/mockDatabase.ts`
- `src/types/mock.ts`
- This README file

## 🤝 Communication

### Questions or Issues?
- **Frontend Lead**: [Axel Vega]
- **Project Manager**: [xxx]
- **Development Chat**: [Whatsapp]

### Integration Checklist
- [ ] Authentication endpoints implemented
- [ ] Item management endpoints implemented
- [ ] Database schema matches frontend types
- [ ] Error handling implemented
- [ ] Authentication tokens/sessions working
- [ ] Mock API replaced with real API calls
- [ ] Environment variables configured
- [ ] Testing completed

## 🧪 Testing the Integration

### Manual Testing Steps
1. **Registration**: Create new user account
2. **Role Selection**: Choose collector or poster role
3. **Poster Flow**: Create recyclable item posting
4. **Collector Flow**: Accept and complete item pickup
5. **Statistics**: Verify stats update correctly
6. **Authentication**: Test login/logout functionality

### Expected Behavior
- All existing frontend functionality should work unchanged
- Data should persist between sessions
- Real-time updates should work (if implemented)
- Error messages should be user-friendly

## 📈 Performance Considerations

- Implement pagination for item lists
- Consider caching for frequently accessed data
- Optimize image uploads and storage
- Implement rate limiting for API endpoints

---

**🎯 Goal**: Replace the mock implementation while maintaining all existing frontend functionality. The user experience should remain identical, but with real data persistence and multi-user support.

**⚠️ Important**: The frontend is production-ready. Focus on implementing the backend API that matches the existing contracts, and the integration should be seamless.