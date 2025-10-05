import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../utils/database';
import Appointment from './Appointment';
import User from './User';

export enum BillingStatus {
  UNPAID = 'unpaid',
  PAID = 'paid',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export interface BillingAttributes {
  id: number;
  appointmentId: number;
  patientId: number;
  amount: number;
  status: BillingStatus;
  paymentMethod?: string;
  paymentDate?: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface BillingCreationAttributes extends Optional<BillingAttributes, 'id' | 'status' | 'paymentMethod' | 'paymentDate' | 'notes'> {}

export class Billing extends Model<BillingAttributes, BillingCreationAttributes> implements BillingAttributes {
  public id!: number;
  public appointmentId!: number;
  public patientId!: number;
  public amount!: number;
  public status!: BillingStatus;
  public paymentMethod?: string;
  public paymentDate?: Date;
  public notes?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Billing.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    appointmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'appointments',
        key: 'id'
      }
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(...Object.values(BillingStatus)),
      allowNull: false,
      defaultValue: BillingStatus.UNPAID
    },
    paymentMethod: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'billings',
    indexes: [
      { fields: ['appointmentId'] },
      { fields: ['patientId'] },
      { fields: ['status'] }
    ]
  }
);

// Associations
Appointment.hasOne(Billing, { foreignKey: 'appointmentId', as: 'billing' });
Billing.belongsTo(Appointment, { foreignKey: 'appointmentId', as: 'appointment' });

User.hasMany(Billing, { foreignKey: 'patientId', as: 'billings' });
Billing.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });

export default Billing;
