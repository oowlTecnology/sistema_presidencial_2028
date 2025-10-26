import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Exclude } from 'class-transformer';
import { Provincia } from './Provincia';
import { Municipio } from './Municipio';
import { Circunscripcion } from './Circunscripcion';
import { Colegio } from './Colegio';
import { Recinto } from './Recinto';

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  EJECUTIVO = 'ejecutivo',
  PROVINCIAL = 'provincial',
  MUNICIPAL = 'municipal',
  CIRCUNSCRIPCION = 'circunscripcion',
  COLEGIO = 'colegio',
  RECINTO = 'recinto',
  FUNCIONARIOS = 'funcionarios'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsNotEmpty()
  firstName: string;

  @Column()
  @IsNotEmpty()
  lastName: string;

  @Column()
  @Exclude()
  @MinLength(6)
  password: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'recinto'
  })
  role: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  address: string;

  // Relaciones jerárquicas - Solo una será no nula según el rol
  @Column({ type: 'smallint', nullable: true })
  provinciaId: number;

  @ManyToOne(() => Provincia, provincia => provincia.ID)
  @JoinColumn({ name: 'provinciaId' })
  provincia: Provincia;

  @Column({ type: 'smallint', nullable: true })
  municipioId: number;

  @ManyToOne(() => Municipio, municipio => municipio.ID)
  @JoinColumn({ name: 'municipioId' })
  municipio: Municipio;

  @Column({ type: 'smallint', nullable: true })
  circunscripcionId: number;

  @ManyToOne(() => Circunscripcion, circunscripcion => circunscripcion.ID)
  @JoinColumn({ name: 'circunscripcionId' })
  circunscripcion: Circunscripcion;

  @Column({ type: 'int', nullable: true })
  colegioId: number;

  @ManyToOne(() => Colegio, colegio => colegio.IDColegio)
  @JoinColumn({ name: 'colegioId' })
  colegio: Colegio;

  @Column({ type: 'int', nullable: true })
  recintoId: number;

  @ManyToOne(() => Recinto, recinto => recinto.ID)
  @JoinColumn({ name: 'recintoId' })
  recinto: Recinto;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}