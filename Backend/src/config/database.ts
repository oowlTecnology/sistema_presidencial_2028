import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../entities/User';
import { Provincia } from '../entities/Provincia';
import { Municipio } from '../entities/Municipio';
import { Colegio } from '../entities/Colegio';
import { Recinto } from '../entities/Recinto';
import { Circunscripcion } from '../entities/Circunscripcion';
import { Elector } from '../entities/Elector';
import { Padron } from '../entities/Padron';
import { Foto } from '../entities/Foto';
import { Fidelizacion } from '../entities/Fidelizacion';
import { Funcionario } from '../entities/Funcionario';

config();

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '1433'),
  username: process.env.DB_USERNAME || 'sa',
  password: process.env.DB_PASSWORD || '!@Qwerty*',
  database: process.env.DB_DATABASE || 'gana_tu_colegio',
  synchronize: false, // Deshabilitado para evitar modificar tablas existentes
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Provincia, Municipio, Circunscripcion, Colegio, Recinto, Elector, Padron, Foto, Fidelizacion, Funcionario],
  migrations: ['src/migrations/*.ts'],
  subscribers: ['src/subscriber/*.ts'],
  requestTimeout: 30000, // 30 segundos para queries
  options: {
    encrypt: false, // Para desarrollo local
    trustServerCertificate: true, // Para desarrollo local
    connectTimeout: 30000 // 30 segundos para conexión
  }
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Base de datos conectada exitosamente');
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    process.exit(1);
  }
};
