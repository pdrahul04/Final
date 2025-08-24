import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../types";

interface UsersState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

// Mock users data
const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'John Smith',
    email: 'john.smith@company.com',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    role: 'developer',
    isActive: true
  },
  {
    id: 'user-2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    role: 'designer',
    isActive: true
  },
  {
    id: 'user-3',
    name: 'Mike Chen',
    email: 'mike.chen@company.com',
    avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    role: 'manager',
    isActive: true
  },
  {
    id: 'user-4',
    name: 'Emily Davis',
    email: 'emily.davis@company.com',
    avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    role: 'tester',
    isActive: true
  },
  {
    id: 'user-5',
    name: 'Alex Rodriguez',
    email: 'alex.rodriguez@company.com',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    role: 'developer',
    isActive: true
  },
  {
    id: 'user-6',
    name: 'Lisa Wang',
    email: 'lisa.wang@company.com',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    role: 'admin',
    isActive: true
  },
  {
    id: 'user-7',
    name: 'David Brown',
    email: 'david.brown@company.com',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    role: 'developer',
    isActive: false
  },
  {
    id: 'user-8',
    name: 'Anna Martinez',
    email: 'anna.martinez@company.com',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    role: 'designer',
    isActive: true
  }
];

const initialState: UsersState = {
  users: mockUsers,
  currentUser: mockUsers[0], // Set John Smith as default current user
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // Set current user
    setCurrentUser: (state, action: PayloadAction<string>) => {
      const user = state.users.find(u => u.id === action.payload);
      if (user) {
        state.currentUser = user;
      }
    },

    // Add new user (for future extensibility)
    addUser: (state, action: PayloadAction<Omit<User, 'id'>>) => {
      const newUser: User = {
        ...action.payload,
        id: `user-${Date.now()}`,
      };
      state.users.push(newUser);
    },

    // Update user
    updateUser: (state, action: PayloadAction<{ id: string; updates: Partial<User> }>) => {
      const userIndex = state.users.findIndex(u => u.id === action.payload.id);
      if (userIndex !== -1) {
        state.users[userIndex] = { ...state.users[userIndex], ...action.payload.updates };
        
        // Update current user if it's the one being updated
        if (state.currentUser?.id === action.payload.id) {
          state.currentUser = state.users[userIndex];
        }
      }
    },

    // Toggle user active status
    toggleUserStatus: (state, action: PayloadAction<string>) => {
      const userIndex = state.users.findIndex(u => u.id === action.payload);
      if (userIndex !== -1) {
        state.users[userIndex].isActive = !state.users[userIndex].isActive;
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCurrentUser,
  addUser,
  updateUser,
  toggleUserStatus,
  setLoading,
  setError,
} = usersSlice.actions;

// Selectors
export const selectAllUsers = (state: { users: UsersState }) => state.users.users;
export const selectActiveUsers = (state: { users: UsersState }) => 
  state.users.users.filter(user => user.isActive);
export const selectCurrentUser = (state: { users: UsersState }) => state.users.currentUser;
export const selectUserById = (state: { users: UsersState }, userId: string) =>
  state.users.users.find(user => user.id === userId);

export default usersSlice.reducer;