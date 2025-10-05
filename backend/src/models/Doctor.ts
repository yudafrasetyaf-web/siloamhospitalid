import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../utils/database';
import User from './User';

export interface DoctorAttributes {
  id: number;
  userId: number;
  specialization: string;
  subSpecialization?: string;
  licenseNumber: string;
  yearsOfExperience: number;
  education: string;
  hospitalId?: number;
  consultationFee: number;
  bio?: string;
  languages: string[];
  availableDays: string[];
  rating?: number;
  totalReviews?: number;
  isAvailable: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface DoctorCreationAttributes extends Optional<DoctorAttributes, 'id' | 'isAvailable'> {}

export class Doctor extends Model<DoctorAttributes, DoctorCreationAttributes> implements DoctorAttributes {
  public id!: number;
  public userId!: number;
  public specialization!: string;
  public subSpecialization?: string;
  public licenseNumber!: string;
  public yearsOfExperience!: number;
  public education!: string;
  public hospitalId?: number;
  public consultationFee!: number;
  public bio?: string;
  public languages!: string[];
  public availableDays!: string[];
  public rating?: number;
  public totalReviews?: number;
  public isAvailable!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Doctor.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    specialization: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    subSpecialization: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    licenseNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      field: 'license_number'
    },
    yearsOfExperience: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    education: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    hospitalId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'hospital_id'
    },
    consultationFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    languages: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'Indonesian,English',
      get() {
        const raw = this.getDataValue('languages');
        return raw ? raw.split(',') : [];
      },
      set(val: string[]) {
        this.setDataValue('languages', val.join(','));
      }
    },
    availableDays: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'Monday,Tuesday,Wednesday,Thursday,Friday',
      get() {
        const raw = this.getDataValue('availableDays');
        return raw ? raw.split(',') : [];
      },
      set(val: string[]) {
        this.setDataValue('availableDays', val.join(','));
      }
    },
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: true,
      defaultValue: 0
    },
    totalReviews: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    sequelize,
    tableName: 'doctors',
    indexes: [
      { fields: ['user_id'] },
      { fields: ['specialization'] },
      { fields: ['license_number'] }
    ]
  }
);

// Associations
User.hasOne(Doctor, { foreignKey: 'userId', as: 'doctorProfile' });
Doctor.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default Doctor;
