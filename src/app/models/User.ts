export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  userType: string; // Assuming UserType enum is serialized as a string
  profilePic: string; // URL or path, not directly tied to Image entity
  isVerified: boolean;
  lastLogin: string; // LocalDateTime as ISO string
  createdAt: string; // LocalDateTime as ISO string
  updatedAt: string; // LocalDateTime as ISO string
  status: string;
}