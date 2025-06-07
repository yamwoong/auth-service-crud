export interface CreateUserDto {
  username: string; // User-defined login ID
  email: string; // Unique email address
  name: string; // Display name
  password?: string | null; // Raw password
  provider?: 'local';
}
