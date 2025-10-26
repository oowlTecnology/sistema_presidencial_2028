import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Funcionario } from '../entities/Funcionario';
import { Municipio } from '../entities/Municipio';

export class FuncionarioController {
  private funcionarioRepository = AppDataSource.getRepository(Funcionario);
  private municipioRepository = AppDataSource.getRepository(Municipio);

  async getAll(req: Request, res: Response) {
    try {
      console.log('👥 Consultando funcionarios...');
      
      // Obtener usuario autenticado
      const user = (req as any).user;
      let funcionarios: Funcionario[] = [];
      
      if (user) {
        console.log(`🔐 Usuario autenticado: ${user.email}, Rol: ${user.role}`);
        
        // Por ahora, todos los usuarios autorizados ven todos los funcionarios
        if (user.role === 'super_admin' || user.role === 'funcionarios' || user.role === 'provincial' || user.role === 'municipal') {
          funcionarios = await this.funcionarioRepository.find({
            relations: ['municipio'],
            order: { nombre: 'ASC' },
            take: 50
          });
          console.log(`👑 Usuario autorizado: Mostrando ${funcionarios.length} funcionarios`);
        }
      } else {
        console.log(`🚫 Usuario no autenticado: No mostrando funcionarios`);
        return res.status(401).json({ message: 'No autorizado' });
      }
      
      // Transformar los datos para el frontend
      const funcionariosTransformados = funcionarios.map(f => ({
        id: f.id,
        cargo: f.cargo,
        nombre: f.nombre,
        cedula: f.cedula,
        telefono: f.telefono,
        municipio: f.municipio?.Descripcion || 'N/A',
        municipioId: f.municipioId,
        fotoBase64: f.fotoBase64,
        nombreCompleto: f.nombreCompleto
      }));
      
      console.log(`👥 Devolviendo ${funcionariosTransformados.length} funcionarios`);
      res.json({
        success: true,
        data: funcionariosTransformados,
        count: funcionariosTransformados.length
      });
    } catch (error) {
      console.error('❌ Error al obtener funcionarios:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error al obtener funcionarios', 
        error: (error as Error).message 
      });
    }
  }

  async getByMunicipio(req: Request, res: Response) {
    try {
      const { municipioId } = req.params;
      console.log(`👥 Consultando funcionarios para municipio: ${municipioId}`);
      
      const funcionarios = await this.funcionarioRepository.find({
        where: { municipioCode: municipioId.toString() },
        relations: ['municipio'],
        order: { nombre: 'ASC' }
      });

      const funcionariosTransformados = funcionarios.map(f => ({
        id: f.id,
        cargo: f.cargo,
        nombre: f.nombre,
        cedula: f.cedula,
        telefono: f.telefono,
        municipio: f.municipio?.Descripcion || 'N/A',
        municipioId: f.municipioId,
        fotoBase64: f.fotoBase64,
        nombreCompleto: f.nombreCompleto
      }));

      res.json({
        success: true,
        data: funcionariosTransformados,
        count: funcionariosTransformados.length
      });
    } catch (error) {
      console.error('❌ Error al obtener funcionarios por municipio:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error al obtener funcionarios por municipio', 
        error: (error as Error).message 
      });
    }
  }

  async getByProvincia(req: Request, res: Response) {
    try {
      const { provinciaId } = req.params;
      console.log(`👥 Consultando funcionarios para provincia: ${provinciaId}`);
      
      // Primero obtener todos los municipios de la provincia
      const municipios = await this.municipioRepository.find({
        where: { IDProvincia: parseInt(provinciaId) }
      });
      
      const municipioIds = municipios.map(m => m.ID.toString());
      
      if (municipioIds.length === 0) {
        return res.json({
          success: true,
          data: [],
          count: 0
        });
      }

      // Buscar funcionarios en esos municipios
      const funcionarios = await this.funcionarioRepository
        .createQueryBuilder('funcionario')
        .leftJoinAndSelect('funcionario.municipio', 'municipio')
        .where('funcionario.municipioCode IN (:...municipioIds)', { municipioIds })
        .orderBy('funcionario.nombre', 'ASC')
        .getMany();

      const funcionariosTransformados = funcionarios.map(f => ({
        id: f.id,
        cargo: f.cargo,
        nombre: f.nombre,
        cedula: f.cedula,
        telefono: f.telefono,
        municipio: f.municipio?.Descripcion || 'N/A',
        municipioId: f.municipioId,
        fotoBase64: f.fotoBase64,
        nombreCompleto: f.nombreCompleto
      }));

      res.json({
        success: true,
        data: funcionariosTransformados,
        count: funcionariosTransformados.length
      });
    } catch (error) {
      console.error('❌ Error al obtener funcionarios por provincia:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error al obtener funcionarios por provincia', 
        error: (error as Error).message 
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      console.log(`👤 Consultando funcionario con cedula: ${id}`);
      
      const funcionario = await this.funcionarioRepository.findOne({
        where: { Cedula: id },
        relations: ['municipio']
      });

      if (!funcionario) {
        return res.status(404).json({ 
          success: false,
          message: 'Funcionario no encontrado' 
        });
      }

      const funcionarioTransformado = {
        id: funcionario.id,
        cargo: funcionario.cargo,
        nombre: funcionario.nombre,
        cedula: funcionario.cedula,
        telefono: funcionario.telefono,
        municipio: funcionario.municipio?.Descripcion || 'N/A',
        municipioId: funcionario.municipioId,
        fotoBase64: funcionario.fotoBase64,
        nombreCompleto: funcionario.nombreCompleto
      };

      res.json({
        success: true,
        data: funcionarioTransformado
      });
    } catch (error) {
      console.error('❌ Error al obtener funcionario:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error al obtener funcionario', 
        error: (error as Error).message 
      });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { cargo, nombre, cedula, telefono, municipioId } = req.body;
      
      const funcionario = new Funcionario();
      funcionario.Cedula = cedula;
      funcionario.cargo = cargo;
      funcionario.nombre = nombre;
      funcionario.telefono = telefono;
      funcionario.municipioCode = municipioId;

      const savedFuncionario = await this.funcionarioRepository.save(funcionario);

      res.status(201).json({
        success: true,
        data: savedFuncionario,
        message: 'Funcionario creado exitosamente'
      });
    } catch (error) {
      console.error('❌ Error al crear funcionario:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error al crear funcionario', 
        error: (error as Error).message 
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { cargo, nombre, telefono, municipioId } = req.body;
      
      const funcionario = await this.funcionarioRepository.findOne({
        where: { Cedula: id }
      });

      if (!funcionario) {
        return res.status(404).json({ 
          success: false,
          message: 'Funcionario no encontrado' 
        });
      }

      funcionario.cargo = cargo;
      funcionario.nombre = nombre;
      funcionario.telefono = telefono;
      funcionario.municipioCode = municipioId;

      const updatedFuncionario = await this.funcionarioRepository.save(funcionario);

      res.json({
        success: true,
        data: updatedFuncionario,
        message: 'Funcionario actualizado exitosamente'
      });
    } catch (error) {
      console.error('❌ Error al actualizar funcionario:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error al actualizar funcionario', 
        error: (error as Error).message 
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const result = await this.funcionarioRepository.delete({ Cedula: id });

      if (result.affected === 0) {
        return res.status(404).json({ 
          success: false,
          message: 'Funcionario no encontrado' 
        });
      }

      res.json({
        success: true,
        message: 'Funcionario eliminado exitosamente'
      });
    } catch (error) {
      console.error('❌ Error al eliminar funcionario:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error al eliminar funcionario', 
        error: (error as Error).message 
      });
    }
  }
}
