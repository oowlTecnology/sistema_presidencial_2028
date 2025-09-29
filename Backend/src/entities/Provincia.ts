import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from './User';

@Entity('Provincia')
export class Provincia {
  @PrimaryColumn({ type: 'smallint' })
  ID: number;

  @Column({ type: 'varchar', length: 30, nullable: true })
  Descripcion: string;

  @Column({ type: 'smallint', nullable: true })
  IDMunicipioCabecera: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  Oficio: string;

  @Column({ type: 'char', length: 1, nullable: true })
  Estatus: string;

  @Column({ type: 'varchar', length: 2, nullable: true })
  ZONA: string;

  @Column({ type: 'uniqueidentifier', nullable: true })
  RegID: string;

  @Column({ type: 'int', nullable: true })
  Region: number;

  // Relación con coordinadores provinciales
  @OneToMany(() => User, user => user.provincia)
  coordinadores: User[];
}