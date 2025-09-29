import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { IsNotEmpty, IsEmail } from 'class-validator';
import { User } from './User';

export enum EstadoPersona {
  CONTACTADO = 'contactado',
  CONVENCIDO = 'convencido',
  VOLUNTARIO = 'voluntario',
  APOYO = 'apoyo'
}

@Entity('personas')
export class Persona {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  firstName: string;

  @Column()
  @IsNotEmpty()
  lastName: string;

  @Column({ nullable: true })
  @IsEmail()
  email: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  cedula: string;

  @Column({ nullable: true })
  age: number;

  @Column({
    type: 'enum',
    enum: EstadoPersona,
    default: EstadoPersona.CONTACTADO
  })
  estado: EstadoPersona;

  @Column({ nullable: true })
  notas: string;

  @Column({ default: true })
  isActive: boolean;

  // Relación con coordinador que la registró
  @Column()
  coordinadorId: number;

  @ManyToOne(() => User, user => user.id)
  coordinador: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}






