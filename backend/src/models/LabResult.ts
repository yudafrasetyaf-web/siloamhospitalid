import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../utils/database';
import Appointment from './Appointment';
import User from './User';
import Doctor from './Doctor';

export interface LabResultAttributes {
  id: number;
  appointmentId: number;
  patientId: number;
  doctorId: number;
  testName: string;
  result: string;
  unit?: string;
  referenceRange?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface LabResultCreationAttributes extends Optional<LabResultAttributes, 'id' | 'unit' | 'referenceRange' | 'notes'> {}

export class LabResult extends Model<LabResultAttributes, LabResultCreationAttributes> implements LabResultAttributes {
  public id!: number;
  public appointmentId!: number;
  public patientId!: number;
  public doctorId!: number;
  public testName!: string;
  public result!: string;
  public unit?: string;
  public referenceRange?: string;
  public notes?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

LabResult.init(
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
    testName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    result: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    unit: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    referenceRange: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'lab_results',
    indexes: [
      { fields: ['appointmentId'] },
      { fields: ['patientId'] },
      { fields: ['doctorId'] }
    ]
  }
);

// Associations
Appointment.hasMany(LabResult, { foreignKey: 'appointmentId', as: 'labResults' });
LabResult.belongsTo(Appointment, { foreignKey: 'appointmentId', as: 'appointment' });

User.hasMany(LabResult, { foreignKey: 'patientId', as: 'labResults' });
LabResult.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });

Doctor.hasMany(LabResult, { foreignKey: 'doctorId', as: 'labResults' });
LabResult.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });

export default LabResult;
