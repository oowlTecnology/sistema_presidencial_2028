import { AppDataSource } from '../config/database';
import { Provincia } from '../entities/Provincia';
import { Municipio } from '../entities/Municipio';
import { Circunscripcion } from '../entities/Circunscripcion';
import { Colegio } from '../entities/Colegio';
import { Recinto } from '../entities/Recinto';

async function populateDatabase() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Conectado a la base de datos');

    const provinciaRepo = AppDataSource.getRepository(Provincia);
    const municipioRepo = AppDataSource.getRepository(Municipio);
    const circunscripcionRepo = AppDataSource.getRepository(Circunscripcion);
    const colegioRepo = AppDataSource.getRepository(Colegio);
    const recintoRepo = AppDataSource.getRepository(Recinto);

    // Crear Provincias
    console.log('🏛️ Creando provincias...');
    const provincias = [
      { ID: 1, Descripcion: 'Santo Domingo', Estatus: 'A', ZONA: '01' },
      { ID: 2, Descripcion: 'Santiago', Estatus: 'A', ZONA: '02' },
      { ID: 3, Descripcion: 'La Vega', Estatus: 'A', ZONA: '03' },
      { ID: 4, Descripcion: 'Azua', Estatus: 'A', ZONA: '04' },
      { ID: 5, Descripcion: 'San Pedro de Macorís', Estatus: 'A', ZONA: '05' }
    ];

    for (const prov of provincias) {
      const existing = await provinciaRepo.findOne({ where: { ID: prov.ID } });
      if (!existing) {
        await provinciaRepo.save(prov);
        console.log(`   ✅ Provincia creada: ${prov.Descripcion}`);
      } else {
        console.log(`   ⚠️  Provincia ya existe: ${prov.Descripcion}`);
      }
    }

    // Crear Municipios
    console.log('🏘️ Creando municipios...');
    const municipios = [
      // Santo Domingo
      { ID: 1, Descripcion: 'Santo Domingo Este', IDProvincia: 1, Estatus: 'A' },
      { ID: 2, Descripcion: 'Santo Domingo Norte', IDProvincia: 1, Estatus: 'A' },
      { ID: 3, Descripcion: 'Santo Domingo Oeste', IDProvincia: 1, Estatus: 'A' },
      { ID: 4, Descripcion: 'Distrito Nacional', IDProvincia: 1, Estatus: 'A' },
      
      // Santiago
      { ID: 5, Descripcion: 'Santiago de los Caballeros', IDProvincia: 2, Estatus: 'A' },
      { ID: 6, Descripcion: 'Licey al Medio', IDProvincia: 2, Estatus: 'A' },
      
      // La Vega
      { ID: 7, Descripcion: 'La Vega', IDProvincia: 3, Estatus: 'A' },
      { ID: 8, Descripcion: 'Jarabacoa', IDProvincia: 3, Estatus: 'A' },
      
      // Azua
      { ID: 9, Descripcion: 'Azua de Compostela', IDProvincia: 4, Estatus: 'A' },
      { ID: 10, Descripcion: 'Sabana Yegua', IDProvincia: 4, Estatus: 'A' },
      
      // San Pedro de Macorís
      { ID: 11, Descripcion: 'San Pedro de Macorís', IDProvincia: 5, Estatus: 'A' },
      { ID: 12, Descripcion: 'Ramón Santana', IDProvincia: 5, Estatus: 'A' }
    ];

    for (const mun of municipios) {
      const existing = await municipioRepo.findOne({ where: { ID: mun.ID } });
      if (!existing) {
        const municipioData = {
          ...mun,
          FechaCreacion: new Date()
        };
        await municipioRepo.save(municipioData);
        console.log(`   ✅ Municipio creado: ${mun.Descripcion}`);
      } else {
        console.log(`   ⚠️  Municipio ya existe: ${mun.Descripcion}`);
      }
    }

    // Crear Circunscripciones
    console.log('📍 Creando circunscripciones...');
    const circunscripciones = [
      // Santo Domingo Este
      { ID: 1, IDProvincia: 1, CodigoCircunscripcion: '01', Descripcion: 'Circunscripción 1 - Santo Domingo Este' },
      { ID: 2, IDProvincia: 1, CodigoCircunscripcion: '02', Descripcion: 'Circunscripción 2 - Santo Domingo Este' },
      
      // Santo Domingo Norte
      { ID: 3, IDProvincia: 1, CodigoCircunscripcion: '03', Descripcion: 'Circunscripción 3 - Santo Domingo Norte' },
      
      // Santiago
      { ID: 4, IDProvincia: 2, CodigoCircunscripcion: '01', Descripcion: 'Circunscripción 1 - Santiago' },
      { ID: 5, IDProvincia: 2, CodigoCircunscripcion: '02', Descripcion: 'Circunscripción 2 - Santiago' },
      
      // La Vega
      { ID: 6, IDProvincia: 3, CodigoCircunscripcion: '01', Descripcion: 'Circunscripción 1 - La Vega' },
      
      // Azua
      { ID: 7, IDProvincia: 4, CodigoCircunscripcion: '01', Descripcion: 'Circunscripción 1 - Azua' },
      { ID: 8, IDProvincia: 4, CodigoCircunscripcion: '02', Descripcion: 'Circunscripción 2 - Azua' }
    ];

    for (const circ of circunscripciones) {
      const existing = await circunscripcionRepo.findOne({ where: { ID: circ.ID } });
      if (!existing) {
        await circunscripcionRepo.save(circ);
        console.log(`   ✅ Circunscripción creada: ${circ.Descripcion}`);
      } else {
        console.log(`   ⚠️  Circunscripción ya existe: ${circ.Descripcion}`);
      }
    }

    // Crear Colegios
    console.log('🏫 Creando colegios...');
    const colegios = [
      { IDColegio: 1, CodigoColegio: '001001', IDMunicipio: 1, Descripcion: 'Colegio San José', IDRecinto: 1, TieneCupo: 'S', CantidadInscritos: 150, CantidadReservada: 10 },
      { IDColegio: 2, CodigoColegio: '001002', IDMunicipio: 1, Descripcion: 'Colegio San Juan', IDRecinto: 2, TieneCupo: 'S', CantidadInscritos: 200, CantidadReservada: 15 },
      { IDColegio: 3, CodigoColegio: '001003', IDMunicipio: 1, Descripcion: 'Colegio San Pedro', IDRecinto: 3, TieneCupo: 'S', CantidadInscritos: 180, CantidadReservada: 12 },
      { IDColegio: 4, CodigoColegio: '002001', IDMunicipio: 5, Descripcion: 'Colegio Santiago', IDRecinto: 4, TieneCupo: 'S', CantidadInscritos: 220, CantidadReservada: 18 },
      { IDColegio: 5, CodigoColegio: '003001', IDMunicipio: 7, Descripcion: 'Colegio La Vega', IDRecinto: 5, TieneCupo: 'S', CantidadInscritos: 160, CantidadReservada: 8 },
      { IDColegio: 6, CodigoColegio: '004001', IDMunicipio: 9, Descripcion: 'Colegio Azua 1761', IDRecinto: 6, TieneCupo: 'S', CantidadInscritos: 140, CantidadReservada: 6 }
    ];

    for (const col of colegios) {
      const existing = await colegioRepo.findOne({ where: { IDColegio: col.IDColegio } });
      if (!existing) {
        await colegioRepo.save(col);
        console.log(`   ✅ Colegio creado: ${col.Descripcion}`);
      } else {
        console.log(`   ⚠️  Colegio ya existe: ${col.Descripcion}`);
      }
    }

    // Crear Recintos
    console.log('🏠 Creando recintos...');
    const recintos = [
      { ID: 1, CodigoRecinto: '00101', Descripcion: 'Recinto San José', IDCircunscripcion: 1, CapacidadRecinto: 200, Estatus: 'A', Tipo: '1' },
      { ID: 2, CodigoRecinto: '00102', Descripcion: 'Recinto San Juan', IDCircunscripcion: 1, CapacidadRecinto: 250, Estatus: 'A', Tipo: '1' },
      { ID: 3, CodigoRecinto: '00103', Descripcion: 'Recinto San Pedro', IDCircunscripcion: 2, CapacidadRecinto: 180, Estatus: 'A', Tipo: '1' },
      { ID: 4, CodigoRecinto: '00201', Descripcion: 'Recinto Santiago', IDCircunscripcion: 4, CapacidadRecinto: 300, Estatus: 'A', Tipo: '1' },
      { ID: 5, CodigoRecinto: '00301', Descripcion: 'Recinto La Vega', IDCircunscripcion: 6, CapacidadRecinto: 220, Estatus: 'A', Tipo: '1' },
      { ID: 6, CodigoRecinto: '00401', Descripcion: 'Recinto Azua 1761', IDCircunscripcion: 7, CapacidadRecinto: 160, Estatus: 'A', Tipo: '1' }
    ];

    for (const rec of recintos) {
      const existing = await recintoRepo.findOne({ where: { ID: rec.ID } });
      if (!existing) {
        await recintoRepo.save(rec);
        console.log(`   ✅ Recinto creado: ${rec.Descripcion}`);
      } else {
        console.log(`   ⚠️  Recinto ya existe: ${rec.Descripcion}`);
      }
    }

    console.log('🎉 ¡Base de datos poblada exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`   🏛️  Provincias: ${provincias.length}`);
    console.log(`   🏘️  Municipios: ${municipios.length}`);
    console.log(`   📍 Circunscripciones: ${circunscripciones.length}`);
    console.log(`   🏫 Colegios: ${colegios.length}`);
    console.log(`   🏠 Recintos: ${recintos.length}`);

  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

populateDatabase();
