import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../utils/database';
import User from './User';
import Doctor from './Doctor';

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show'
}

export interface AppointmentAttributes {
  id: number;
  patientId: number;
  doctorId: number;
  appointmentDate: Date;
  appointmentTime: string;
  duration: number;
  status: AppointmentStatus;
  reasonForVisit: string;
  symptoms?: string;
  notes?: string;
  cancelReason?: string;
  amount: number;
  isPaid: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AppointmentCreationAttributes extends Optional<AppointmentAttributes, 'id' | 'status' | 'isPaid'> {}

export class Appointment extends Model<AppointmentAttributes, AppointmentCreationAttributes> implements AppointmentAttributes {
  public id!: number;
  public patientId!: number;
  public doctorId!: number;
  public appointmentDate!: Date;
  public appointmentTime!: string;
  public duration!: number;
  public status!: AppointmentStatus;
  public reasonForVisit!: string;
  public symptoms?: string;
  public notes?: string;
  public cancelReason?: string;
  public amount!: number;
  public isPaid!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Appointment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'doctors',
        key: 'id'
      }
    },
    appointmentDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    appointmentTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30
    },
    status: {
      type: DataTypes.ENUM(...Object.values(AppointmentStatus)),
      allowNull: false,
      defaultValue: AppointmentStatus.PENDING
    },
    reasonForVisit: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    symptoms: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cancelReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    isPaid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    sequelize,
    tableName: 'appointments',
    indexes: [
      { fields: ['patientId'] },
      { fields: ['doctorId'] },
      { fields: ['appointmentDate'] },
      { fields: ['status'] }
    ]
  }
);

// Associations
User.hasMany(Appointment, { foreignKey: 'patientId', as: 'appointments' });
Appointment.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });

Doctor.hasMany(Appointment, { foreignKey: 'doctorId', as: 'appointments' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });

export default Appointment;
