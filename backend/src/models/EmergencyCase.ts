import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../utils/database';
import Patient from './Patient';

export interface EmergencyCaseAttributes {
  id: string;
  patientId: string;
  symptoms: object; // JSON: { chestPain: true, shortnessOfBreath: true, ... }
  vitalSigns: object; // JSON: { heartRate: 120, bloodPressure: '180/120', ... }
  triageLevel: string; // 1-5
  status: 'pending' | 'in_progress' | 'completed' | 'canceled';
  assignedDoctorId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface EmergencyCaseCreationAttributes extends Optional<EmergencyCaseAttributes, 'id'> {}

export class EmergencyCase extends Model<EmergencyCaseAttributes, EmergencyCaseCreationAttributes> implements EmergencyCaseAttributes {
  public id!: string;
  public patientId!: string;
  public symptoms!: object;
  public vitalSigns!: object;
  public triageLevel!: string;
  public status!: 'pending' | 'in_progress' | 'completed' | 'canceled';
  public assignedDoctorId?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

EmergencyCase.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    patientId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'patients',
        key: 'id',
      },
    },
    symptoms: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    vitalSigns: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    triageLevel: {
      type: DataTypes.STRING(1),
      allowNull: false,
      validate: {
        isIn: [['1', '2', '3', '4', '5']],
      },
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
      allowNull: false,
      validate: {
        isIn: [['pending', 'in_progress', 'completed', 'canceled']],
      },
    },
    assignedDoctorId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'doctors',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'emergency_cases',
    timestamps: true,
    indexes: [
      { fields: ['triageLevel'] },
      { fields: ['status'] },
      { fields: ['createdAt'] },
    ]
  }
);

// Hubungan dengan Patient
EmergencyCase.belongsTo(Patient, { foreignKey: 'patientId' });
Patient.hasMany(EmergencyCase, { foreignKey: 'patientId' });

export default EmergencyCase;
