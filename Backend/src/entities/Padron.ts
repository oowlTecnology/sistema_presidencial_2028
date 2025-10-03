import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity('Padron')
export class Padron {
  @PrimaryColumn({ type: 'varchar', length: 11 })
  cedula: string

  @Column({ type: 'varchar', length: 50, nullable: true })
  nombres: string

  @Column({ type: 'varchar', length: 30, nullable: true })
  apellido1: string

  @Column({ type: 'varchar', length: 30, nullable: true })
  apellido2: string

  @Column({ type: 'datetime2', precision: 7, nullable: true })
  fechanacimiento: Date

  @Column({ type: 'varchar', length: 50, nullable: true })
  lugarnacimiento: string

  @Column({ type: 'int', nullable: true })
  idSectorParaje: number

  @Column({ type: 'int', nullable: true })
  idcolegio: number

  @Column({ type: 'char', length: 1, nullable: true })
  idEstatus: string

  @Column({ type: 'smallint', nullable: true })
  idpiel: number

  @Column({ type: 'char', length: 1, nullable: true })
  idsexo: string

  @Column({ type: 'smallint', nullable: true })
  idsangre: number

  @Column({ type: 'smallint', nullable: true })
  idocupacion: number

  @Column({ type: 'smallint', nullable: true })
  idnacionalidad: number

  @Column({ type: 'varchar', length: 1, nullable: true })
  idestadocivil: string
}
