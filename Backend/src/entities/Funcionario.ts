import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Municipio } from './Municipio';

@Entity('funcionarios')
export class Funcionario {
  @PrimaryColumn({ type: 'varchar', length: 200 })
  Cedula: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  cargo: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  nombre: string;

  @Column({ type: 'varchar', length: 200, nullable: true, name: 'Telefono' })
  telefono: string;

  @Column({ type: 'varbinary', length: 'max', nullable: true })
  foto: Buffer | null;

  @Column({ type: 'nchar', nullable: true, name: 'Municipio' })
  municipioCode: string;

  @ManyToOne(() => Municipio, municipio => municipio.ID)
  @JoinColumn({ name: 'Municipio', referencedColumnName: 'ID' })
  municipio: Municipio;

  // Propiedades virtuales para compatibilidad con el frontend
  get id(): string {
    return this.Cedula;
  }

  get cedula(): string {
    return this.Cedula;
  }

  get municipioId(): string {
    return this.municipioCode;
  }

  // Getter para nombre completo
  get nombreCompleto(): string {
    return this.nombre || '';
  }

  // Getter para obtener la foto como base64
  get fotoBase64(): string | null {
    if (this.foto && Buffer.isBuffer(this.foto) && this.foto.length > 0) {
      try {
        // Detectar el tipo de imagen basado en los primeros bytes
        const header = this.foto.subarray(0, 4);
        let mimeType = 'image/jpeg'; // Por defecto
        
        if (header[0] === 0xFF && header[1] === 0xD8) {
          mimeType = 'image/jpeg';
        } else if (header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4E && header[3] === 0x47) {
          mimeType = 'image/png';
        } else if (header[0] === 0x47 && header[1] === 0x49 && header[2] === 0x46) {
          mimeType = 'image/gif';
        }
        
        return `data:${mimeType};base64,${this.foto.toString('base64')}`;
      } catch (error) {
        console.error('Error al convertir foto a base64:', error);
        return null;
      }
    }
    return null;
  }
}
