import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Colegio } from './Colegio';
import { User } from './User';
import { Elector } from './Elector';

@Entity('Recinto')
export class Recinto {
  @PrimaryColumn({ type: 'int' })
  ID: number;

  @Column({ type: 'varchar', length: 5, nullable: true })
  CodigoRecinto: string;

  @Column({ type: 'varchar', length: 60, nullable: true })
  Descripcion: string;

  @Column({ type: 'varchar', length: 60, nullable: true })
  Direccion: string;

  @Column({ type: 'int', nullable: true })
  IDSectorParaje: number;

  @Column({ type: 'smallint', nullable: true })
  IDCircunscripcion: number;

  @Column({ type: 'int', nullable: true })
  IDBarrio: number;

  @Column({ type: 'int', nullable: true })
  CapacidadRecinto: number;

  @Column({ type: 'int', nullable: true })
  Oficio: number;

  @Column({ type: 'varchar', length: 1, nullable: true })
  Estatus: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  DescripcionLarga: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  DireccionLarga: string;

  @Column({ type: 'char', length: 1, nullable: true })
  Tipo: string;

  @Column({ type: 'smallint', nullable: true })
  Codigo: number;

  @Column({ type: 'uniqueidentifier', nullable: true })
  RegID: string;

  // Relación con colegio (usando IDRecinto como referencia)
  @ManyToOne(() => Colegio, colegio => colegio.IDRecinto)
  colegio: Colegio;

  // Relación con coordinadores de recinto
  @OneToMany(() => User, user => user.recinto)
  coordinadores: User[];

  // Relación con electores
  @OneToMany(() => Elector, elector => elector.recinto)
  electores: Elector[];
}