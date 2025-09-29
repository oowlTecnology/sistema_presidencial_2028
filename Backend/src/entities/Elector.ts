import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Recinto } from './Recinto';
import { Colegio } from './Colegio';
import { Municipio } from './Municipio';
import { Provincia } from './Provincia';

export enum ElectorStatus {
  RATIFICADO = 'Ratificado',
  A_CONFIRMAR = 'A confirmar',
  PENDIENTE = 'Pendiente'
}

export enum ElectorVoteStatus {
  VOTO = 'Votó',
  NO_HA_VOTADO = 'No ha votado'
}

@Entity('electores')
export class Elector {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ unique: true })
  cedula!: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'Pendiente',
  })
  estado!: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'No ha votado',
  })
  voto!: string;

  @Column({ nullable: true })
  recomendacionIA?: string;

  @ManyToOne(() => Recinto, recinto => recinto.electores, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recintoId' })
  recinto!: Recinto;

  @Column({ type: 'int', nullable: true })
  recintoId?: number;

  @ManyToOne(() => Colegio, colegio => colegio.IDColegio, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'colegioId' })
  colegio!: Colegio;

  @Column({ type: 'int', nullable: true })
  colegioId?: number;

  @ManyToOne(() => Municipio, municipio => municipio.ID, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'municipioId' })
  municipio!: Municipio;

  @Column({ type: 'smallint', nullable: true })
  municipioId?: number;

  @ManyToOne(() => Provincia, provincia => provincia.ID, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'provinciaId' })
  provincia!: Provincia;

  @Column({ type: 'smallint', nullable: true })
  provinciaId?: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}