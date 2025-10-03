import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity('fotos')
export class Foto {
  @PrimaryColumn({ type: 'varchar', length: 11 })
  Cedula: string

  @Column({ type: 'varbinary', nullable: true })
  Imagen: Buffer

  @Column({ type: 'datetime', nullable: true })
  Fecha: Date

  @Column({ type: 'varchar', length: 1, nullable: true })
  Verificador: string
}
