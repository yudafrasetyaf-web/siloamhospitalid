import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../utils/database';
import Appointment from './Appointment';
import User from './User';
import Doctor from './Doctor';

export enum InpatientStatus {
  ADMITTED = 'admitted',
  DISCHARGED = 'discharged',
  TRANSFERRED = 'transferred',
  CANCELLED = 'cancelled'
}

export interface InpatientAttributes {
  id: number;
  appointmentId: number;
  patientId: number;
  doctorId: number;
  roomNumber: string;
  admissionDate: Date;
  dischargeDate?: Date;
  status: InpatientStatus;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface InpatientCreationAttributes extends Optional<InpatientAttributes, 'id' | 'dischargeDate' | 'notes'> {}

export class Inpatient extends Model<InpatientAttributes, InpatientCreationAttributes> implements InpatientAttributes {
  public id!: number;
  public appointmentId!: number;
  public patientId!: number;
  public doctorId!: number;
  public roomNumber!: string;
  public admissionDate!: Date;
  public dischargeDate?: Date;
  public status!: InpatientStatus;
  public notes?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Inpatient.init(
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
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'doctors',
        key: 'id'
      }
    },
    roomNumber: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    admissionDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    dischargeDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM(...Object.values(InpatientStatus)),
      allowNull: false,
      defaultValue: InpatientStatus.ADMITTED
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'inpatients',
    indexes: [
      { fields: ['appointmentId'] },
      { fields: ['patientId'] },
      { fields: ['doctorId'] },
      { fields: ['roomNumber'] }
    ]
  }
);

// Associations
Appointment.hasOne(Inpatient, { foreignKey: 'appointmentId', as: 'inpatient' });
Inpatient.belongsTo(Appointment, { foreignKey: 'appointmentId', as: 'appointment' });

User.hasMany(Inpatient, { foreignKey: 'patientId', as: 'inpatients' });
Inpatient.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });

Doctor.hasMany(Inpatient, { foreignKey: 'doctorId', as: 'inpatients' });
Inpatient.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });

export default Inpatient;
