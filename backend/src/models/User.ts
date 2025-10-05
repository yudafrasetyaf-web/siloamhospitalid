import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../utils/database';
import bcrypt from 'bcrypt';

export enum UserRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  NURSE = 'nurse',
  ADMIN = 'admin',
  STAFF = 'staff'
}

export interface UserAttributes {
  id: number;
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  city?: string;
  country?: string;
  profileImage?: string;
  isActive: boolean;
  isVerified: boolean;
  lastLoginAt?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  passwordChangedAt?: Date;
  passwordHistory?: string[];
  isMfaEnabled: boolean;
  mfaSecret?: string;
  mfaRecoveryCodes?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'isActive' | 'isVerified'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public password!: string;
  public role!: UserRole;
  public firstName!: string;
  public lastName!: string;
  public phoneNumber?: string;
  public dateOfBirth?: Date;
  public gender?: 'male' | 'female' | 'other';
  public address?: string;
  public city?: string;
  public country?: string;
  public profileImage?: string;
  public isActive!: boolean;
  public isVerified!: boolean;
  public lastLoginAt?: Date;
  public loginAttempts!: number;
  public lockUntil?: Date;
  public passwordChangedAt?: Date;
  public passwordHistory?: string[];
  public isMfaEnabled!: boolean;
  public mfaSecret?: string;
  public mfaRecoveryCodes?: string[];

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Method to compare passwords
  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  // Method to hash password
  public async hashPassword(): Promise<void> {
    if (this.changed('password')) {
      this.password = await bcrypt.hash(this.password, 12);
    }
  }

  // Get full name
  public get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  // Check if account is locked
  public get isLocked(): boolean {
    return !!(this.lockUntil && this.lockUntil > new Date());
  }

  // Increment login attempts
  public async incrementLoginAttempts(): Promise<void> {
    const MAX_LOGIN_ATTEMPTS = 5;
    const LOCK_TIME = 30 * 60 * 1000; // 30 minutes

    // Reset attempts if lock has expired
    if (this.lockUntil && this.lockUntil < new Date()) {
      this.loginAttempts = 1;
      this.lockUntil = undefined;
    } else {
      this.loginAttempts += 1;
    }

    // Lock account if max attempts reached
    if (this.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      this.lockUntil = new Date(Date.now() + LOCK_TIME);
    }

    await this.save();
  }

  // Reset login attempts on successful login
  public async resetLoginAttempts(): Promise<void> {
    this.loginAttempts = 0;
    this.lockUntil = undefined;
    this.lastLoginAt = new Date();
    await this.save();
  }

  // Add password to history
  public async addPasswordToHistory(hashedPassword: string): Promise<void> {
    const MAX_PASSWORD_HISTORY = 5;
    const history = this.passwordHistory || [];
    
    history.unshift(hashedPassword);
    
    // Keep only last N passwords
    this.passwordHistory = history.slice(0, MAX_PASSWORD_HISTORY);
    this.passwordChangedAt = new Date();
    
    await this.save();
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM(...Object.values(UserRole)),
      allowNull: false,
      defaultValue: UserRole.PATIENT
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: 'Indonesia'
    },
    profileImage: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    loginAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    lockUntil: {
      type: DataTypes.DATE,
      allowNull: true
    },
    passwordChangedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    passwordHistory: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    isMfaEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    mfaSecret: {
      type: DataTypes.STRING(512), // Encrypted secrets can be long
      allowNull: true
    },
    mfaRecoveryCodes: {
      type: DataTypes.ARRAY(DataTypes.STRING(512)), // Array of encrypted codes
      allowNull: true,
      defaultValue: []
    }
  },
  {
    sequelize,
    tableName: 'users',
    indexes: [
      { fields: ['email'] },
      { fields: ['role'] }
    ],
    hooks: {
      beforeCreate: async (user: User) => {
        await user.hashPassword();
      },
      beforeUpdate: async (user: User) => {
        await user.hashPassword();
      }
    }
  }
);

export default User;
