import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Provincia } from './Provincia';
import { Municipio } from './Municipio';
import { User } from './User';
import { Colegio } from './Colegio';

@Entity('Circunscripcion')
export class Circunscripcion {
  @PrimaryColumn({ type: 'smallint' })
  ID: number;

  @Column({ type: 'smallint' })
  IDProvincia: number;

  @Column({ type: 'varchar', length: 2, nullable: true })
  CodigoCircunscripcion: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  Descripcion: string;

  @Column({ type: 'uniqueidentifier', nullable: true })
  RegID: string;

  // Relación con provincia
  @ManyToOne(() => Provincia, provincia => provincia.ID)
  provincia: Provincia;

  // Relación con municipio (inferida por IDProvincia)
  @ManyToOne(() => Municipio, municipio => municipio.ID)
  municipio: Municipio;

  // Relación con coordinadores de circunscripción
  @OneToMany(() => User, user => user.circunscripcion)
  coordinadores: User[];

  // Relación con colegios
  @OneToMany(() => Colegio, colegio => colegio.circunscripcion)
  colegios: Colegio[];
}