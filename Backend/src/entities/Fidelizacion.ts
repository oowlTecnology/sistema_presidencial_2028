import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm'
import { User } from './User'
import { Padron } from './Padron'

@Entity('Fidelizacion')
export class Fidelizacion {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 11 })
  cedula: string

  @Column({ type: 'int' })
  coordinadorId: number

  @Column({ type: 'int', nullable: true })
  colegioId: number

  @CreateDateColumn()
  fechaFidelizacion: Date

  @ManyToOne(() => User)
  @JoinColumn({ name: 'coordinadorId' })
  coordinador: User

  @ManyToOne(() => Padron)
  @JoinColumn({ name: 'cedula' })
  persona: Padron
}
