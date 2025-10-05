import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../utils/database';
import User from './User';
import Doctor from './Doctor';
import Appointment from './Appointment';
import { encrypt, decrypt } from '../utils/encryption';

export interface MedicalRecordAttributes {
  id: number;
  patientId: number;
  doctorId: number;
  appointmentId?: number;
  diagnosis: string;
  treatment: string;
  prescription?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface MedicalRecordCreationAttributes extends Optional<MedicalRecordAttributes, 'id' | 'appointmentId'> {}

export class MedicalRecord extends Model<MedicalRecordAttributes, MedicalRecordCreationAttributes> implements MedicalRecordAttributes {
  public id!: number;
  public patientId!: number;
  public doctorId!: number;
  public appointmentId?: number;
  public diagnosis!: string;
  public treatment!: string;
  public prescription?: string;
  public notes?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MedicalRecord.init(
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
    appointmentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'appointments',
        key: 'id'
      }
    },
    diagnosis: {
      type: DataTypes.TEXT,
      allowNull: false,
      set(this: MedicalRecord, val: string) {
        this.setDataValue('diagnosis', encrypt(val));
      },
      get(this: MedicalRecord) {
        const raw = this.getDataValue('diagnosis');
        return raw ? decrypt(raw) : null;
      }
    },
    treatment: {
      type: DataTypes.TEXT,
      allowNull: false,
      set(this: MedicalRecord, val: string) {
        this.setDataValue('treatment', encrypt(val));
      },
      get(this: MedicalRecord) {
        const raw = this.getDataValue('treatment');
        return raw ? decrypt(raw) : null;
      }
    },
    prescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      set(this: MedicalRecord, val: string) {
        if (val) this.setDataValue('prescription', encrypt(val));
      },
      get(this: MedicalRecord) {
        const raw = this.getDataValue('prescription');
        return raw ? decrypt(raw) : null;
      }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      set(this: MedicalRecord, val: string) {
        if (val) this.setDataValue('notes', encrypt(val));
      },
      get(this: MedicalRecord) {
        const raw = this.getDataValue('notes');
        return raw ? decrypt(raw) : null;
      }
    }
  },
  {
    sequelize,
    tableName: 'medical_records',
    indexes: [
      { fields: ['patientId'] },
      { fields: ['doctorId'] },
      { fields: ['appointmentId'] }
    ]
  }
);

// Associations
User.hasMany(MedicalRecord, { foreignKey: 'patientId', as: 'medicalRecords' });
MedicalRecord.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });

Doctor.hasMany(MedicalRecord, { foreignKey: 'doctorId', as: 'medicalRecords' });
MedicalRecord.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });

Appointment.hasOne(MedicalRecord, { foreignKey: 'appointmentId', as: 'medicalRecord' });
MedicalRecord.belongsTo(Appointment, { foreignKey: 'appointmentId', as: 'appointment' });

export default MedicalRecord;
