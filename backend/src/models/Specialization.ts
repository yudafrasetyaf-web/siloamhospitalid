import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../utils/database';

export interface SpecializationAttributes {
  id: number;
  name: string;
  description?: string;
}

interface SpecializationCreationAttributes extends Optional<SpecializationAttributes, 'id'> {}

export class Specialization extends Model<SpecializationAttributes, SpecializationCreationAttributes> implements SpecializationAttributes {
  public id!: number;
  public name!: string;
  public description?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Specialization.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'specializations',
    timestamps: true,
  }
);

export default Specialization;
