import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Provincia } from './Provincia';
import { User } from './User';
import { Circunscripcion } from './Circunscripcion';

@Entity('Municipio')
export class Municipio {
  @PrimaryColumn({ type: 'smallint' })
  ID: number;

  @Column({ type: 'varchar', length: 35, nullable: true })
  Descripcion: string;

  @Column({ type: 'smallint' })
  IDProvincia: number;

  @Column({ type: 'smallint', nullable: true })
  IDMunicipioPadre: number;

  @Column({ type: 'decimal', precision: 18, scale: 0, nullable: true })
  Oficio: number;

  @Column({ type: 'varchar', length: 1, nullable: true })
  Estatus: string;

  @Column({ type: 'char', length: 1, nullable: true })
  DM: string;

  @Column({ type: 'int', nullable: true })
  IdUsuarioCreacion: number;

  @Column({ type: 'smalldatetime' })
  FechaCreacion: Date;

  @Column({ type: 'int', nullable: true })
  IdUsuarioModificacion: number;

  @Column({ type: 'smalldatetime', nullable: true })
  FechaModificacion: Date;

  @Column({ type: 'uniqueidentifier', nullable: true })
  RegID: string;

  // Relación con provincia
  @ManyToOne(() => Provincia, provincia => provincia.ID)
  provincia: Provincia;

  // Relación con coordinadores municipales
  @OneToMany(() => User, user => user.municipio)
  coordinadores: User[];

  // Relación con circunscripciones
  @OneToMany(() => Circunscripcion, circunscripcion => circunscripcion.municipio)
  circunscripciones: Circunscripcion[];
}