import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Circunscripcion } from './Circunscripcion';
import { User } from './User';
import { Recinto } from './Recinto';

@Entity('Colegio')
export class Colegio {
  @PrimaryColumn({ type: 'int' })
  IDColegio: number;

  @Column({ type: 'varchar', length: 6 })
  CodigoColegio: string;

  @Column({ type: 'smallint' })
  IDMunicipio: number;

  @Column({ type: 'varchar', length: 60 })
  Descripcion: string;

  @Column({ type: 'int' })
  IDRecinto: number;

  @Column({ type: 'varchar', length: 1, nullable: true })
  TieneCupo: string;

  @Column({ type: 'int', nullable: true })
  CantidadInscritos: number;

  @Column({ type: 'int', nullable: true })
  CantidadReservada: number;

  @Column({ type: 'uniqueidentifier', nullable: true })
  RegID: string;

  // Relación con circunscripción (usando IDMunicipio como referencia)
  @ManyToOne(() => Circunscripcion, circunscripcion => circunscripcion.ID)
  circunscripcion: Circunscripcion;

  // Relación con coordinadores de colegio
  @OneToMany(() => User, user => user.colegio)
  coordinadores: User[];

  // Relación con recintos
  @OneToMany(() => Recinto, recinto => recinto.colegio)
  recintos: Recinto[];
}