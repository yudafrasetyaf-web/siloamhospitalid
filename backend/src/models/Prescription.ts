import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../utils/database';
import Appointment from './Appointment';
import User from './User';
import Doctor from './Doctor';

export interface PrescriptionAttributes {
  id: number;
  appointmentId: number;
  patientId: number;
  doctorId: number;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PrescriptionCreationAttributes extends Optional<PrescriptionAttributes, 'id' | 'notes'> {}

export class Prescription extends Model<PrescriptionAttributes, PrescriptionCreationAttributes> implements PrescriptionAttributes {
  public id!: number;
  public appointmentId!: number;
  public patientId!: number;
  public doctorId!: number;
  public medication!: string;
  public dosage!: string;
  public frequency!: string;
  public duration!: string;
  public notes?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Prescription.init(
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
    medication: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    dosage: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    frequency: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    duration: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'prescriptions',
    indexes: [
      { fields: ['appointmentId'] },
      { fields: ['patientId'] },
      { fields: ['doctorId'] }
    ]
  }
);

// Associations
Appointment.hasMany(Prescription, { foreignKey: 'appointmentId', as: 'prescriptions' });
Prescription.belongsTo(Appointment, { foreignKey: 'appointmentId', as: 'appointment' });

User.hasMany(Prescription, { foreignKey: 'patientId', as: 'prescriptions' });
Prescription.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });

Doctor.hasMany(Prescription, { foreignKey: 'doctorId', as: 'prescriptions' });
Prescription.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });

export default Prescription;
