import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../utils/database';

export interface HospitalAttributes {
  id: number;
  name: string;
  address: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
  phoneNumber: string;
  email: string;
  emergencyNumber: string;
  website?: string;
  description?: string;
  facilities: string[];
  latitude?: number;
  longitude?: number;
  operatingHours: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface HospitalCreationAttributes extends Optional<HospitalAttributes, 'id' | 'isActive'> {}

export class Hospital extends Model<HospitalAttributes, HospitalCreationAttributes> implements HospitalAttributes {
  public id!: number;
  public name!: string;
  public address!: string;
  public city!: string;
  public province!: string;
  public country!: string;
  public postalCode!: string;
  public phoneNumber!: string;
  public email!: string;
  public emergencyNumber!: string;
  public website?: string;
  public description?: string;
  public facilities!: string[];
  public latitude?: number;
  public longitude?: number;
  public operatingHours!: string;
  public isActive!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Hospital.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    province: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'Indonesia'
    },
    postalCode: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    emergencyNumber: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    facilities: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
      get() {
        const raw = this.getDataValue('facilities');
        return raw ? raw.split(',').filter(f => f) : [];
      },
      set(val: string[]) {
        this.setDataValue('facilities', val.join(','));
      }
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true
    },
    operatingHours: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '24/7'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    sequelize,
    tableName: 'hospitals',
    indexes: [
      { fields: ['city'] },
      { fields: ['name'] }
    ]
  }
);

export default Hospital;
