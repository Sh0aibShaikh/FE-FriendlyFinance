# Frontend Documentation (React)

## 📋 Table of Contents
1. [Frontend Overview & Configuration](#frontend-overview--configuration)
2. [Component Architecture & State](#component-architecture--state)
3. [API Interaction](#api-interaction)
4. [Pages & Routes](#pages--routes)
5. [State Management (Zustand)](#state-management-zustand)
6. [Styling & Theming](#styling--theming)
7. [Key Features](#key-features)

---

## 1. Frontend Overview & Configuration

### Purpose
The frontend is a modern React-based single-page application (SPA) that provides:
- **UI Rendering**: Responsive, accessible user interface with dark mode support
- **User Interaction**: Intuitive forms, modals, and interactive charts
- **API Consumption**: Real-time data fetching and state synchronization with backend
- **State Management**: Global state management using Zustand for auth, transactions, and theme

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | ^18.2.0 | UI library for building component-based interfaces |
| **TypeScript** | ^5.2.2 | Type-safe JavaScript with strict mode enabled |
| **Vite** | ^5.0.0 | Fast build tool and development server |
| **React Router DOM** | ^6.16.0 | Client-side routing and navigation |
| **Zustand** | ^4.4.1 | Lightweight state management library |
| **Axios** | ^1.5.0 | HTTP client for API requests |
| **Tailwind CSS** | ^3.4.18 | Utility-first CSS framework |
| **Recharts** | ^2.10.0 | Composable charting library for analytics |
| **Framer Motion** | ^10.16.0 | Animation library for smooth transitions |
| **Lucide React** | ^0.292.0 | Icon library with 1000+ icons |

### Setup Commands

```bash
# Install dependencies
npm install

# Run development server (opens at http://localhost:5173)
npm run dev

# Type-check TypeScript
tsc --noEmit

# Lint code
npm run lint
```

### Build & Deployment

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Output directory
# dist/
```

**Build Configuration:**
- **Output Directory**: `dist/`
- **Source Maps**: Disabled in production
- **Port**: 5173 (development)
- **Auto-open**: Enabled in development

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

**Note**: All environment variables must be prefixed with `VITE_` to be accessible in the application via `import.meta.env`.

---

## 2. Component Architecture & State

### State Management

**Primary Method**: **Zustand** - A small, fast, and scalable state management solution.

**Why Zustand?**
- Minimal boilerplate compared to Redux
- No context providers needed
- TypeScript-first design
- Simple API with hooks

**Global Stores Location**: `src/store/`

### Top-Level Components

#### 1. **App.tsx** - Main Application Component
- **Purpose**: Root component that sets up routing and initializes global state
- **State Managed**: None (delegates to stores)
- **Key Responsibilities**:
  - Initialize authentication state on mount
  - Initialize theme preference from localStorage
  - Define application routes
  - Wrap protected routes with authentication guard

<augment_code_snippet path="src/App.tsx" mode="EXCERPT">
````typescript
function App() {
  const { initializeAuth } = useAuthStore();
  const { initializeTheme } = useThemeStore();

  useEffect(() => {
    initializeAuth();
    initializeTheme();
  }, [initializeAuth, initializeTheme]);
  ...
}
````
</augment_code_snippet>

#### 2. **Layout.tsx** - Application Shell
- **Purpose**: Provides consistent layout structure for all protected pages
- **State Managed**: 
  - Mobile menu open/close state
  - Logout confirmation modal state
- **Key Features**:
  - Fixed header with navigation
  - Dark mode toggle
  - User profile dropdown
  - Responsive mobile menu
  - Footer with links

#### 3. **ProtectedRoute.tsx** - Authentication Guard
- **Purpose**: Prevents unauthorized access to protected pages
- **State Managed**: Initialization state
- **Key Logic**:
  - Checks for valid auth token in localStorage
  - Redirects to `/login` if not authenticated
  - Handles auth state initialization on page refresh

#### 4. **Dashboard.tsx** - Main Dashboard Page
- **Purpose**: Displays financial summary and recent transactions
- **State Managed**: None (uses Zustand stores)
- **Data Displayed**:
  - Total income, expenses, and balance
  - Month-over-month spending comparison
  - Recent transactions list
  - Quick stats cards

#### 5. **Transactions.tsx** - Transaction Management Page
- **Purpose**: Full transaction list with filtering, sorting, and CRUD operations
- **State Managed**:
  - Filter state (type, category, date range)
  - Pagination state
  - Add/Edit modal state
  - **Delete confirmation modal state**
  - **Transaction deletion loading state**
  - **Delete error state**
  - **Import statement modal state**
  - **Import loading state**
  - **Import success/error state**
- **Key Features**:
  - Advanced filtering by type, category, date
  - Sorting by date/amount
  - Pagination
  - Add, edit, delete transactions
  - **Bank statement import (PDF upload)**
  - **Delete button (🗑️ icon) on each transaction row**
  - **Confirmation modal before deletion with transaction details**
  - **Loading state during deletion ("Deleting...")**
  - **Error toast notification on deletion failure**
  - **Success toast notification on import completion**
  - Category-based filtering with multi-select
- **Delete Transaction Flow**:
  1. User clicks delete button (🗑️) on transaction row
  2. Confirmation modal appears showing transaction details (type, amount, category)
  3. User confirms deletion
  4. API call to `DELETE /api/transactions/:id` via `transactionService.delete()`
  5. Transaction list refreshes automatically on success
  6. Error toast appears at bottom-right if deletion fails
- **Import Bank Statement Flow**:
  1. User clicks "Import Statement" button
  2. Import modal opens with drag-and-drop file upload area
  3. User selects or drags a PDF file (max 10MB)
  4. File validation occurs (PDF only)
  5. User clicks "Import" button
  6. API call to `POST /api/transactions/import` via `transactionService.importStatement()`
  7. Success toast shows count of imported transactions
  8. Transaction list refreshes automatically to show new data
  9. Error toast appears if import fails

### Reusable Components

#### **ConfirmationModal.tsx** - Confirmation Dialog
**Location**: `src/components/ConfirmationModal.tsx`

**Purpose**: Reusable modal for confirming dangerous actions (like deletion)

**Props Interface**:
```typescript
interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;      // Default: 'Confirm'
  cancelText?: string;       // Default: 'Cancel'
  isDangerous?: boolean;     // Default: false (shows red theme if true)
  isLoading?: boolean;       // Default: false (disables buttons if true)
  onConfirm: () => void;
  onCancel: () => void;
}
```

**Features**:
- Animated entrance/exit with Framer Motion
- Backdrop click to cancel
- Danger mode with red color scheme (used for delete actions)
- Loading state with disabled buttons
- Alert icon for dangerous actions
- Responsive design with dark mode support

**Usage Example** (Delete Transaction):
```typescript
import { ConfirmationModal } from '../components/ConfirmationModal';
import { Transaction } from '../types';

const [showDeleteModal, setShowDeleteModal] = useState(false);
const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
const [isDeletingTransaction, setIsDeletingTransaction] = useState(false);

<ConfirmationModal
  isOpen={showDeleteModal}
  title="Delete Transaction"
  message={
    transactionToDelete
      ? `Are you sure you want to delete this ${transactionToDelete.type.toLowerCase()} transaction of $${transactionToDelete.amount.toFixed(2)} in ${transactionToDelete.category}? This action cannot be undone.`
      : 'Are you sure you want to delete this transaction?'
  }
  confirmText={isDeletingTransaction ? 'Deleting...' : 'Delete'}
  cancelText="Cancel"
  isDangerous={true}
  isLoading={isDeletingTransaction}
  onConfirm={handleDeleteConfirm}
  onCancel={handleDeleteCancel}
/>
```

#### **AddTransactionModal.tsx** - Transaction Form Modal
**Location**: `src/components/AddTransactionModal.tsx`

**Purpose**: Modal form for creating new transactions

**Features**:
- Form validation
- Currency input with formatting
- Category selection dropdown
- Date picker
- Type toggle (Income/Expense)
- Loading state during submission

#### **ImportStatementModal.tsx** - Bank Statement Import Modal
**Location**: `src/components/ImportStatementModal.tsx`

**Purpose**: Modal for uploading and importing bank statement PDF files

**Props Interface**:
```typescript
interface ImportStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (file: File) => Promise<void>;
  isLoading?: boolean;
}
```

**Features**:
- **Drag-and-drop file upload** with visual feedback
- **Click-to-upload** functionality via hidden file input
- **PDF-only validation** (rejects non-PDF files)
- **File size validation** (max 10MB)
- **File preview** showing selected file name and size
- **Loading states** with disabled buttons during upload
- **Error handling** with inline error messages
- **Dark mode support** with smooth transitions
- **Responsive design** for mobile and desktop
- **Framer Motion animations** for smooth UX
- **Accessible** with proper ARIA attributes

**Visual States**:
- **Default**: Upload icon with "Click to upload or drag and drop" instructions
- **Dragging**: Highlighted border with "Drop your file here" message
- **File Selected**: Green checkmark icon with file name and size, "Remove file" option
- **Loading**: Disabled buttons with "Importing..." text
- **Error**: Red alert banner with error message

**Usage Example** (from `Transactions.tsx`):
```typescript
import { ImportStatementModal } from '../components/ImportStatementModal';

const [showImportModal, setShowImportModal] = useState(false);
const [isImporting, setIsImporting] = useState(false);

const handleImport = async (file: File) => {
  setIsImporting(true);
  try {
    const response = await transactionService.importStatement(file);
    const importedCount = response.data?.importedCount || 0;
    setImportSuccess(`Successfully imported ${importedCount} transactions.`);
    setShowImportModal(false);
    fetchTransactions({ userId: user._id, limit: 10, skip: 0 });
  } catch (error: any) {
    setImportError(error.response?.data?.error || 'Failed to import');
  } finally {
    setIsImporting(false);
  }
};

<ImportStatementModal
  isOpen={showImportModal}
  onClose={() => setShowImportModal(false)}
  onSubmit={handleImport}
  isLoading={isImporting}
/>
```

---

## 3. API Interaction

### API Client

**Library Used**: **Axios** (v1.5.0)

**Configuration File**: `src/api/client.ts`

**Base Configuration**:
```typescript
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL, // from environment variable
  headers: {
    'Content-Type': 'application/json',
  },
});
```

**Request Interceptor** (Automatic Token Injection):
```typescript
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(LocalStorageKeys.AUTH_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Response Interceptor** (Auto-logout on 401):
```typescript
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem(LocalStorageKeys.AUTH_TOKEN);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### API Services

All API calls are organized into service modules in `src/api/services/`:

#### **authService.ts** - Authentication API
```typescript
export const authService = {
  async register(data: RegisterRequest): Promise<AuthResponse>
  async login(data: LoginRequest): Promise<AuthResponse>
  logout(): void
  getToken(): string | null
  getUser(): User | null
}
```

#### **transactionService.ts** - Transaction API
```typescript
export const transactionService = {
  async getTransactions(filters: TransactionFilters): Promise<TransactionListResponse>
  async getSummary(userId: string): Promise<{ summary: TransactionSummary }>
  async getByCategory(userId: string): Promise<{ byCategory: CategoryBreakdown }>
  async create(data: CreateTransactionRequest): Promise<ApiResponse>
  async update(id: string, data: UpdateTransactionRequest): Promise<ApiResponse>
  async delete(id: string): Promise<ApiResponse>
  async importStatement(file: File): Promise<ApiResponse>
}
```

**Import Statement Implementation**:
```typescript
async importStatement(file: File): Promise<ApiResponse<any>> {
  const formData = new FormData();
  formData.append('bankStatementFile', file);

  const response = await apiClient.post<ApiResponse<any>>('/transactions/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}
```

**Key Details**:
- Uses `FormData` for proper multipart/form-data handling
- Field name: `bankStatementFile` (matches backend requirement)
- Endpoint: `POST /api/transactions/import`
- Accepts PDF files only
- Returns `ApiResponse` with `importedCount` in data

#### **userService.ts** - User Profile API
```typescript
export const userService = {
  async updateProfile(userId: string, data: UpdateUserRequest): Promise<ApiResponse>
  async deleteAccount(userId: string): Promise<ApiResponse>
}
```

### Request Example

**Fetching Transactions with Filters** (from `Transactions.tsx`):

```typescript
import { useTransactionStore } from '../store/transactionStore';
import { PAGINATION } from '../constants';

const { user } = useAuthStore();
const { fetchTransactions } = useTransactionStore();

// Fetch transactions with filters
useEffect(() => {
  if (user?._id) {
    fetchTransactions({
      userId: user._id,
      limit: PAGINATION.DEFAULT_LIMIT,
      skip: 0,
      type: 'Expense', // optional filter
      category: 'Food & Dining', // optional filter
      startDate: '2025-01-01', // optional filter
      endDate: '2025-01-31', // optional filter
      sortBy: 'date',
      sortOrder: -1 // -1 for descending, 1 for ascending
    });
  }
}, [user?._id, fetchTransactions]);
```

**Creating a Transaction** (from `AddTransactionModal.tsx`):

```typescript
import { transactionService } from '../api/services/transactionService';

const handleAddTransaction = async () => {
  try {
    await transactionService.create({
      user: user._id,
      type: 'Expense',
      category: 'Food & Dining',
      amount: 50.00,
      description: 'Lunch at restaurant',
      date: new Date().toISOString()
    });

    // Refresh transaction list
    fetchTransactions({ userId: user._id, limit: 10, skip: 0 });
  } catch (error) {
    console.error('Failed to create transaction:', error);
  }
};
```

**Deleting a Transaction** (from `Transactions.tsx`):

```typescript
import { transactionService } from '../api/services/transactionService';
import { Transaction } from '../types';

const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
const [isDeletingTransaction, setIsDeletingTransaction] = useState(false);
const [deleteError, setDeleteError] = useState<string | null>(null);

const handleDeleteConfirm = async () => {
  if (!transactionToDelete || !user?._id) return;

  setIsDeletingTransaction(true);
  setDeleteError(null);

  try {
    // Call DELETE API endpoint
    await transactionService.delete(transactionToDelete._id);

    // Close modal
    setShowDeleteModal(false);
    setTransactionToDelete(null);

    // Refresh transactions to update the list
    fetchTransactions({
      userId: user._id,
      limit: PAGINATION.DEFAULT_LIMIT,
      skip: 0,
      ...filters
    } as TransactionFilters);
  } catch (error: any) {
    // Display error message to user
    const errorMessage = error.response?.data?.error || 'Failed to delete transaction';
    setDeleteError(errorMessage);
  } finally {
    setIsDeletingTransaction(false);
  }
};
```

**API Response for DELETE**:
```json
{
  "message": "Transaction deleted successfully",
  "transaction": {
    "_id": "507f1f77bcf86cd799439011",
    "user": "507f191e810c19729de860ea",
    "type": "Expense",
    "category": "Food & Dining",
    "amount": 50.00,
    "description": "Lunch at restaurant",
    "date": "2025-01-15T12:00:00.000Z"
  }
}
```

**Importing Bank Statement** (from `Transactions.tsx`):

```typescript
import { transactionService } from '../api/services/transactionService';

const [isImporting, setIsImporting] = useState(false);
const [importSuccess, setImportSuccess] = useState<string | null>(null);
const [importError, setImportError] = useState<string | null>(null);

const handleImport = async (file: File) => {
  if (!user?._id) return;

  setIsImporting(true);
  setImportError(null);
  setImportSuccess(null);

  try {
    // Call import API endpoint with file
    const response = await transactionService.importStatement(file);

    // Extract count of imported transactions
    const importedCount = response.data?.importedCount || response.data?.count || 0;

    // Show success message
    setImportSuccess(`Successfully imported ${importedCount} transaction${importedCount !== 1 ? 's' : ''}.`);

    // Close modal
    setShowImportModal(false);

    // Refresh transactions to show newly imported data
    fetchTransactions({
      userId: user._id,
      limit: PAGINATION.DEFAULT_LIMIT,
      skip: 0,
      ...filters
    } as TransactionFilters);

    // Clear success message after 5 seconds
    setTimeout(() => setImportSuccess(null), 5000);
  } catch (error: any) {
    // Display error message to user
    const errorMessage = error.response?.data?.error || 'Failed to import bank statement';
    setImportError(errorMessage);

    // Clear error message after 5 seconds
    setTimeout(() => setImportError(null), 5000);
  } finally {
    setIsImporting(false);
  }
};
```

**API Response for IMPORT**:
```json
{
  "message": "Bank statement imported successfully",
  "importedCount": 15,
  "transactions": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "user": "507f191e810c19729de860ea",
      "type": "Expense",
      "category": "Food & Dining",
      "amount": 50.00,
      "description": "Restaurant - extracted from PDF",
      "date": "2025-01-15T12:00:00.000Z"
    }
    // ... more transactions
  ]
}
```

**Note**: The frontend code handles multiple possible response structures:
- `response.data.importedCount` or `response.data.count`
- `response.data.transactions.length` (array length)
- `response.importedCount` or `response.count` (root level)
- `response.transactions.length` (root level array)

---

## 5. State Management (Zustand)

### Overview

Zustand is used for global state management across the application. It provides a simple, hook-based API without the need for context providers.

### Store Structure

#### **authStore.ts** - Authentication State

**Location**: `src/store/authStore.ts`

**State Interface**:
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  register: (data: RegisterRequest) => Promise<void>;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  clearError: () => void;
  initializeAuth: () => void;
}
```

**Key Actions**:
- `register()`: Creates new user account
- `login()`: Authenticates user and stores token in localStorage
- `logout()`: Clears auth state and localStorage
- `initializeAuth()`: Restores auth state from localStorage on app load

**Usage Example**:
```typescript
import { useAuthStore } from '../store/authStore';

const { user, token, login, logout } = useAuthStore();

// Login
await login({ email: 'user@example.com', password: 'password123' });

// Access user data
console.log(user?.username);

// Logout
logout();
```

#### **transactionStore.ts** - Transaction State

**Location**: `src/store/transactionStore.ts`

**State Interface**:
```typescript
interface TransactionState {
  transactions: Transaction[];
  summary: TransactionSummary | null;
  byCategory: CategoryBreakdown | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pages: number;
    total: number;
    limit: number;
  };

  // Actions
  fetchTransactions: (filters: TransactionFilters) => Promise<void>;
  fetchSummary: (userId: string) => Promise<void>;
  fetchByCategory: (userId: string) => Promise<void>;
  createTransaction: (data: CreateTransactionRequest) => Promise<void>;
  updateTransaction: (id: string, data: UpdateTransactionRequest) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  clearError: () => void;
}
```

**Key Actions**:
- `fetchTransactions()`: Fetches paginated transaction list with filters
- `fetchSummary()`: Fetches total income, expenses, and balance
- `fetchByCategory()`: Fetches category-wise breakdown
- `createTransaction()`: Creates new transaction
- `updateTransaction()`: Updates existing transaction
- **`deleteTransaction(id: string)`**: Deletes transaction by ID

**Delete Transaction Implementation**:
```typescript
deleteTransaction: async (id: string) => {
  set({ isLoading: true, error: null });
  try {
    await transactionService.delete(id);
    set({ isLoading: false });
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || 'Failed to delete transaction';
    set({ error: errorMessage, isLoading: false });
    throw error;
  }
}
```

**State Update After Deletion**:
After a successful deletion, the component calling `deleteTransaction()` should refresh the transaction list by calling `fetchTransactions()` to ensure the UI reflects the current state. The deleted transaction is removed from the backend, and the refreshed list will no longer include it.

**Usage Example**:
```typescript
import { useTransactionStore } from '../store/transactionStore';

const { transactions, summary, fetchTransactions, createTransaction, deleteTransaction } = useTransactionStore();

// Fetch transactions
await fetchTransactions({
  userId: user._id,
  limit: 10,
  skip: 0,
  type: 'Expense'
});

// Create transaction
await createTransaction({
  user: user._id,
  type: 'Expense',
  category: 'Food & Dining',
  amount: 25.50,
  description: 'Coffee shop'
});

// Delete transaction
try {
  await deleteTransaction('507f1f77bcf86cd799439011');
  // Refresh list after successful deletion
  await fetchTransactions({
    userId: user._id,
    limit: 10,
    skip: 0
  });
} catch (error) {
  // Error is already set in store state
  console.error('Delete failed:', error);
}
```

#### **themeStore.ts** - Theme State

**Location**: `src/store/themeStore.ts`

**State Interface**:
```typescript
interface ThemeState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
  initializeTheme: () => void;
}
```

**Key Actions**:
- `toggleDarkMode()`: Toggles between light and dark mode
- `setDarkMode()`: Sets specific theme mode
- `initializeTheme()`: Restores theme preference from localStorage

**Implementation Details**:
- Stores preference in localStorage as `friendlyFinanceTheme`
- Adds/removes `dark` class on `document.documentElement` for Tailwind CSS
- Automatically applies theme on app initialization

**Usage Example**:
```typescript
import { useThemeStore } from '../store/themeStore';

const { isDarkMode, toggleDarkMode } = useThemeStore();

// Toggle theme
<button onClick={toggleDarkMode}>
  {isDarkMode ? <Sun /> : <Moon />}
</button>
```

---

## 6. Styling & Theming

### Tailwind CSS Configuration

**Configuration File**: `tailwind.config.js`

**Dark Mode**: Class-based strategy (`darkMode: 'class'`)

**Custom Theme Extensions**:
```javascript
{
  colors: {
    primary: { /* emerald shades */ },
    accent: { /* teal shades */ },
    neutral: { /* gray shades */ }
  },
  fontFamily: {
    display: ['Inter', 'sans-serif'],
    body: ['Inter', 'sans-serif']
  },
  animation: {
    'pulse-soft': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite'
  }
}
```

### Global Styles

**File**: `src/index.css`

**Key Features**:
- Tailwind base, components, and utilities
- Custom CSS variables for colors
- Smooth transitions for theme switching
- Custom utility classes for gradients and shadows

### Component Styling Patterns

**Responsive Design**:
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>
```

**Dark Mode Support**:
```typescript
<div className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
  {/* Content */}
</div>
```

**Animations with Framer Motion**:
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  {/* Animated content */}
</motion.div>
```

---

## 7. Key Features

### 🔐 Authentication
- **JWT-based authentication** with token stored in localStorage
- **Protected routes** that redirect to login if not authenticated
- **Session persistence** across page refreshes
- **Auto-logout** on 401 responses from API

### 💰 Transaction Management
- **CRUD operations**: Create, Read, Update, Delete transactions
- **Bank Statement Import** (NEW):
  - Upload PDF bank statements via drag-and-drop or click-to-upload
  - Automatic transaction extraction from PDF files
  - File validation (PDF only, max 10MB)
  - Success toast showing count of imported transactions
  - Error handling with user-friendly messages
  - Automatic list refresh after successful import
  - Loading states during upload and processing
- **Delete with Confirmation**:
  - Delete button (🗑️ icon) on each transaction row
  - Confirmation modal with transaction details before deletion
  - Loading state during deletion ("Deleting...")
  - Error handling with toast notifications
  - Automatic list refresh after successful deletion
- **Advanced filtering**: By type, category, date range
- **Sorting**: By date or amount (ascending/descending)
- **Pagination**: Configurable page size (default: 10 items)
- **Real-time updates**: Automatic refresh after mutations

### 📊 Analytics & Visualization
- **Pie Chart**: Expense breakdown by category
- **Bar Chart**: Income vs Expense comparison
- **Summary Cards**: Total income, expenses, balance
- **Trend Analysis**: Month-over-month spending comparison
- **Interactive Charts**: Tooltips and legends with Recharts

### 🌍 Multi-Currency Support
- **12 Supported Currencies**: INR, USD, EUR, GBP, JPY, AUD, CAD, CHF, CNY, SGD, AED, MXN
- **User Preference**: Stored in user profile
- **Automatic Formatting**: Locale-specific number formatting
- **Currency Symbols**: Displayed throughout the app

**Supported Currencies**:
```typescript
const CURRENCIES = {
  INR: { symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
  USD: { symbol: '$', name: 'US Dollar', locale: 'en-US' },
  EUR: { symbol: '€', name: 'Euro', locale: 'en-EU' },
  GBP: { symbol: '£', name: 'British Pound', locale: 'en-GB' },
  // ... 8 more currencies
};
```

### 🎨 UI/UX Features
- **Responsive Design**: Mobile-first approach with breakpoints
- **Dark Mode**: System preference detection with manual toggle
- **Smooth Animations**: Framer Motion for page transitions
- **Loading States**: Skeleton screens and spinners
- **Error Handling**: User-friendly error messages
- **Confirmation Modals**: For destructive actions (delete, logout)
- **Form Validation**: Client-side validation with error messages

### 🔧 Developer Experience
- **TypeScript**: 100% type coverage with strict mode
- **Code Organization**: Feature-based folder structure
- **Reusable Components**: Modal, Input, Button components
- **Custom Hooks**: For common patterns
- **Environment Variables**: Vite-based configuration
- **Fast Refresh**: Hot module replacement in development

---

## 📁 Project Structure

```
src/
├── api/                          # API layer
│   ├── client.ts                 # Axios instance with interceptors
│   └── services/                 # API service modules
│       ├── authService.ts        # Authentication endpoints
│       ├── transactionService.ts # Transaction endpoints
│       └── userService.ts        # User profile endpoints
│
├── components/                   # Reusable components
│   ├── Layout.tsx                # App shell with header/footer
│   ├── ProtectedRoute.tsx        # Auth guard component
│   ├── AddTransactionModal.tsx   # Transaction form modal
│   ├── ImportStatementModal.tsx  # Bank statement import modal (NEW)
│   ├── ConfirmationModal.tsx     # Reusable confirmation dialog
│   ├── CurrencyInput.tsx         # Currency input field
│   └── CurrencySettings.tsx      # Currency preference selector
│
├── pages/                        # Page components
│   ├── Login.tsx                 # Login page
│   ├── Register.tsx              # Registration page
│   ├── Dashboard.tsx             # Main dashboard
│   ├── Transactions.tsx          # Transaction list page
│   ├── Analytics.tsx             # Analytics page with charts
│   └── Profile.tsx               # User profile page
│
├── store/                        # Zustand stores
│   ├── authStore.ts              # Authentication state
│   ├── transactionStore.ts       # Transaction state
│   └── themeStore.ts             # Theme state
│
├── types/                        # TypeScript types
│   └── index.ts                  # All type definitions
│
├── constants/                    # App constants
│   └── index.ts                  # Categories, currencies, validation rules
│
├── utils/                        # Utility functions
│   └── currency.ts               # Currency formatting helpers
│
├── App.tsx                       # Root component with routing
├── main.tsx                      # React entry point
├── App.css                       # App-level styles
└── index.css                     # Global Tailwind styles
```

---

## 🚀 Development Workflow

### Running the Application

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Set Environment Variables**:
   Create `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Opens at `http://localhost:5173`

4. **Build for Production**:
   ```bash
   npm run build
   ```
   Output: `dist/` folder

5. **Preview Production Build**:
   ```bash
   npm run preview
   ```

### Code Quality

- **TypeScript Strict Mode**: Enabled for maximum type safety
- **ESLint**: Configured for React and TypeScript
- **Prettier**: Code formatting (if configured)

---

## 🔗 API Integration

### Base URL Configuration

**Environment Variable**: `VITE_API_URL`

**Default**: `http://localhost:5000/api`

**Production**: Set via hosting platform environment variables

### Authentication Flow

1. User submits login form
2. `authService.login()` sends POST to `/auth/login`
3. Backend returns `{ token, user }`
4. Token stored in localStorage
5. Axios interceptor adds token to all subsequent requests
6. On 401 response, user is logged out and redirected to login

### Error Handling

**Global Error Interceptor**:
```typescript
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Auto-logout on unauthorized
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

**Component-Level Error Handling**:
```typescript
try {
  await createTransaction(data);
} catch (error: any) {
  const errorMessage = error.response?.data?.error || 'Failed to create transaction';
  setError(errorMessage);
}
```

---

## 📝 Type Definitions

### Key Types

**User**:
```typescript
interface User {
  _id: string;
  username: string;
  email: string;
  preferredCurrency?: string;
  createdAt: string;
  updatedAt: string;
}
```

**Transaction**:
```typescript
interface Transaction {
  _id: string;
  user: string;
  type: 'Income' | 'Expense';
  amount: number;
  category: TransactionCategory;
  date: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
```

**TransactionSummary**:
```typescript
interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}
```

**CategoryBreakdown**:
```typescript
interface CategoryBreakdown {
  [category: string]: {
    income: number;
    expense: number;
    total: number;
  };
}
```

---

## 🎯 Best Practices

### State Management
- ✅ Use Zustand stores for global state
- ✅ Keep component state local when possible
- ✅ Clear errors after successful operations
- ✅ Handle loading states for better UX

### API Calls
- ✅ Always handle errors with try-catch
- ✅ Show loading indicators during requests
- ✅ Refresh data after mutations
- ✅ Use TypeScript types for request/response

### Component Design
- ✅ Keep components small and focused
- ✅ Extract reusable logic into custom hooks
- ✅ Use TypeScript interfaces for props
- ✅ Implement proper error boundaries

### Performance
- ✅ Use `useMemo` for expensive calculations
- ✅ Implement pagination for large lists
- ✅ Lazy load routes if needed
- ✅ Optimize images and assets

---

## 📚 Additional Resources

- **React Documentation**: https://react.dev
- **Vite Documentation**: https://vitejs.dev
- **Zustand Documentation**: https://docs.pmnd.rs/zustand
- **Tailwind CSS**: https://tailwindcss.com
- **React Router**: https://reactrouter.com
- **Recharts**: https://recharts.org

---

**Last Updated**: January 2025
**Version**: 1.1.0 (Added Bank Statement Import Feature)
**Maintained By**: Development Team

---

## 🆕 Recent Updates (v1.1.0)

### Bank Statement Import Feature
**Added**: January 2025

**New Components**:
- `ImportStatementModal.tsx` - Reusable modal for PDF file upload with drag-and-drop

**Modified Components**:
- `Transactions.tsx` - Added "Import Statement" button and import handler logic
- `transactionService.ts` - Added `importStatement(file: File)` API method

**New API Endpoint**:
- `POST /api/transactions/import` - Accepts PDF files via multipart/form-data

**Features**:
- ✅ Drag-and-drop PDF upload
- ✅ Click-to-upload functionality
- ✅ File validation (PDF only, max 10MB)
- ✅ File preview with name and size
- ✅ Loading states during upload
- ✅ Success toast with import count
- ✅ Error handling with user-friendly messages
- ✅ Automatic transaction list refresh
- ✅ Dark mode support
- ✅ Responsive design
- ✅ Framer Motion animations

**User Flow**:
1. Click "Import Statement" button on Transactions page
2. Modal opens with drag-and-drop area
3. Select or drag PDF file (validated for type and size)
4. Click "Import" button
5. File uploads to backend via FormData
6. Success toast shows: "Successfully imported X transactions."
7. Transaction list automatically refreshes
8. Modal closes automatically on success

**Technical Implementation**:
- Uses `FormData` API for multipart/form-data file upload
- Field name: `bankStatementFile` (matches backend requirement)
- Axios POST request with `Content-Type: multipart/form-data` header
- Response includes `importedCount` in `data` object
- Automatic list refresh via `fetchTransactions()` from Zustand store
- Toast notifications with 5-second auto-dismiss

---

## 4. Pages & Routes

### Routing Configuration

**Router**: React Router DOM v6 with `BrowserRouter`

**Route Structure** (defined in `App.tsx`):

| Route Path | Component | Access Restriction | Description |
|------------|-----------|-------------------|-------------|
| `/login` | `Login` | Public | User login page with email/password form |
| `/register` | `Register` | Public | User registration page |
| `/dashboard` | `Dashboard` | Protected | Main dashboard with financial summary |
| `/transactions` | `Transactions` | Protected | Transaction list with filters and CRUD |
| `/analytics` | `Analytics` | Protected | Charts and visual analytics |
| `/profile` | `Profile` | Protected | User profile settings and account management |
| `/` | Redirect to `/dashboard` | - | Root path redirects to dashboard |
| `*` | Redirect to `/dashboard` | - | Catch-all for unknown routes |

**Protected Route Implementation**:
```typescript
<Route
  element={
    <ProtectedRoute>
      <Layout />
    </ProtectedRoute>
  }
>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/transactions" element={<Transactions />} />
  <Route path="/analytics" element={<Analytics />} />
  <Route path="/profile" element={<Profile />} />
</Route>
```

### Page Details

#### **Login Page** (`src/pages/Login.tsx`)
- Email and password input fields
- Password visibility toggle
- Error message display
- Link to registration page
- Redirects to dashboard on successful login

#### **Register Page** (`src/pages/Register.tsx`)
- Username, email, and password fields
- Form validation
- Success message with redirect to login
- Link to login page

#### **Dashboard Page** (`src/pages/Dashboard.tsx`)
- Summary cards: Total Income, Total Expenses, Balance
- Month-over-month spending comparison
- Recent transactions list (last 10)
- Quick stats with animated counters

#### **Transactions Page** (`src/pages/Transactions.tsx`)
- Full transaction list with pagination
- Filters: Type, Category, Date Range
- Sorting: By date or amount
- Add new transaction modal
- **Import bank statement** (NEW):
  - "Import Statement" button next to "Add Transaction"
  - Drag-and-drop PDF upload modal
  - File validation and preview
  - Success toast with import count
  - Automatic refresh on success
- **Delete transaction with confirmation**:
  - Delete button (🗑️ icon) in Actions column
  - Confirmation modal showing transaction details
  - Loading state ("Deleting...") during API call
  - Error toast on failure
  - Automatic refresh on success
- Category-based filtering

#### **Analytics Page** (`src/pages/Analytics.tsx`)
- Pie chart: Expense breakdown by category
- Bar chart: Income vs Expense by category
- Summary cards with trends
- Interactive charts with tooltips
- Dark mode support for charts

#### **Profile Page** (`src/pages/Profile.tsx`)
- View/Edit user information
- Change password
- Currency preference settings
- Delete account with confirmation
- Logout functionality

---


