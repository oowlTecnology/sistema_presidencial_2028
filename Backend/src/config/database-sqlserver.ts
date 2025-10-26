import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../entities/User';
import { Provincia } from '../entities/Provincia';
import { Municipio } from '../entities/Municipio';
import { Colegio } from '../entities/Colegio';
import { Recinto } from '../entities/Recinto';
import { Persona } from '../entities/Persona';

config();

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '1433'),
  username: process.env.DB_USERNAME || 'sa',
  password: process.env.DB_PASSWORD || '!@Qwerty*',
  database: process.env.DB_DATABASE || 'gana_tu_colegio',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Provincia, Municipio, Colegio, Recinto, Persona],
  migrations: ['src/migrations/*.ts'],
  subscribers: ['src/subscriber/*.ts'],
  options: {
    encrypt: false, // Para desarrollo local
    trustServerCertificate: true // Para desarrollo local
  }
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Base de datos SQL Server conectada exitosamente');
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos SQL Server:', error);
    process.exit(1);
  }
};








