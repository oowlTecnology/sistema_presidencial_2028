import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Funcionario } from '../../services/funcionarios.service';

@Component({
  selector: 'app-funcionario-detail-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="funcionario-modal">
      <!-- Botón cerrar -->
      <button class="close-btn" (click)="closeModal()">
        <mat-icon>close</mat-icon>
      </button>

      <!-- Header con bandera y provincia -->
      <div class="modal-header">
        <div class="flag-container">
          <img src="assets/bandera-dominicana.svg" alt="Bandera RD" 
               (error)="onImageError($event)">
        </div>
        <div class="provincia-section">
          <div class="provincia-label">PROVINCIA</div>
          <div class="provincia-name">REPÚBLICA DOMINICANA</div>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="modal-content">
        <!-- Foto del funcionario -->
        <div class="funcionario-photo">
          <img 
            [src]="funcionario.fotoBase64 || getDefaultImage()" 
            [alt]="funcionario.nombre"
            (error)="onImageError($event)">
        </div>

        <!-- Información central -->
        <div class="funcionario-info">
          <div class="cargo-badge">{{ funcionario.cargo || 'DIRECTOR EJECUTIVO' }}</div>
          <h1 class="funcionario-name">{{ funcionario.nombre || 'Angela Nicaury Martinez' }}</h1>
          
          <div class="contact-info">
            <div class="contact-item" *ngIf="funcionario.telefono">
              <mat-icon>phone</mat-icon>
              <span>{{ funcionario.telefono }}</span>
            </div>
            
            <div class="contact-item" *ngIf="funcionario.cedula">
              <mat-icon>badge</mat-icon>
              <span>{{ funcionario.cedula }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer con provincia -->
      <div class="modal-footer">
        <div class="provincia-section">
          <div class="provincia-label">PROVINCIA</div>
          <div class="provincia-name">REPÚBLICA DOMINICANA</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .funcionario-modal {
      background: #1e3a8a;
      border-radius: 20px;
      padding: 0;
      max-width: 500px;
      width: 100%;
      position: relative;
      overflow: hidden;
      color: white;
      min-height: 450px;
      display: flex;
      flex-direction: column;
    }

    .close-btn {
      position: absolute;
      top: 15px;
      right: 15px;
      background: rgba(255, 255, 255, 0.2);
      border: none;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
    }

    .close-btn:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .modal-header {
      position: absolute;
      top: 15px;
      right: 50px;
      display: flex;
      align-items: center;
      gap: 10px;
      z-index: 5;
    }

    .modal-content {
      padding: 60px 30px 20px 30px;
      display: flex;
      align-items: center;
      gap: 20px;
      flex: 1;
      min-height: 300px;
    }

    .funcionario-photo {
      flex-shrink: 0;
    }

    .funcionario-photo img {
      width: 120px;
      height: 140px;
      object-fit: cover;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    }

    .funcionario-info {
      flex: 1;
    }

    .cargo-badge {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      padding: 4px 10px;
      border-radius: 15px;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 10px;
      display: inline-block;
    }

    .funcionario-name {
      font-size: 20px;
      font-weight: 700;
      color: white;
      margin: 0 0 15px 0;
      line-height: 1.2;
    }

    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.1);
      padding: 8px 12px;
      border-radius: 20px;
    }

    .contact-item mat-icon {
      color: white;
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .contact-item span {
      color: white;
      font-size: 14px;
      font-weight: 500;
    }

    .modal-footer {
      padding: 15px 30px 20px 30px;
      text-align: center;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      flex-shrink: 0;
    }

    .provincia-section {
      text-align: center;
    }

    .provincia-label {
      font-size: 10px;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 2px;
    }

    .provincia-name {
      font-size: 14px;
      font-weight: 600;
      color: white;
      margin: 0;
    }

    .flag-container img {
      width: 30px;
      height: 20px;
      border-radius: 4px;
      object-fit: cover;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }
  `]
})
export class FuncionarioDetailModalComponent {
  constructor(
    public dialogRef: MatDialogRef<FuncionarioDetailModalComponent>,
    @Inject(MAT_DIALOG_DATA) public funcionario: Funcionario
  ) {}

  closeModal(): void {
    this.dialogRef.close();
  }

  getDefaultImage(): string {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjUwIiBmaWxsPSIjNjM2NjcwIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzciIHI9IjE1IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMjAgODBDMjAgNjguOTU0MyAyOC45NTQzIDYwIDQwIDYwSDYwQzcxLjA0NTcgNjAgODAgNjguOTU0MyA4MCA4MFY5MEgyMFY4MFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=';
  }

  onImageError(event: any): void {
    event.target.src = this.getDefaultImage();
  }
}
