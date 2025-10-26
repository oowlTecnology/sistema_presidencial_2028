const bcrypt = require('bcryptjs');
const { AppDataSource } = require('./dist/config/database');
const { User } = require('./dist/entities/User');

async function createFuncionariosUser() {
    try {
        // Inicializar conexión a la base de datos
        await AppDataSource.initialize();
        console.log('✅ Conexión a base de datos establecida');

        // Verificar si el usuario ya existe
        const userRepository = AppDataSource.getRepository(User);
        const existingUser = await userRepository.findOne({
            where: { email: 'admin.funcionarios@prm.gov.do' }
        });

        if (existingUser) {
            console.log('⚠️  El usuario ya existe:');
            console.log(`   Email: ${existingUser.email}`);
            console.log(`   Rol: ${existingUser.role}`);
            console.log(`   Estado: ${existingUser.isActive ? 'Activo' : 'Inactivo'}`);
            return;
        }

        // Hashear la contraseña
        const password = 'funcionarios123';
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el usuario
        const newUser = userRepository.create({
            email: 'admin.funcionarios@prm.gov.do',
            password: hashedPassword,
            firstName: 'Administrador',
            lastName: 'Funcionarios PRM',
            role: 'funcionarios',
            isActive: true
        });

        // Guardar en la base de datos
        const savedUser = await userRepository.save(newUser);

        console.log('🎉 Usuario creado exitosamente:');
        console.log(`   ID: ${savedUser.id}`);
        console.log(`   Email: ${savedUser.email}`);
        console.log(`   Nombre: ${savedUser.firstName} ${savedUser.lastName}`);
        console.log(`   Rol: ${savedUser.role}`);
        console.log(`   Password: ${password}`);
        console.log('');
        console.log('📋 Credenciales de acceso:');
        console.log(`   Email: admin.funcionarios@prm.gov.do`);
        console.log(`   Password: funcionarios123`);
        console.log('');
        console.log('🚀 Ahora puedes:');
        console.log('   1. Iniciar sesión en /login');
        console.log('   2. Acceder a Funcionarios PRM desde el dashboard');
        console.log('   3. O navegar directamente a /funcionarios');

    } catch (error) {
        console.error('❌ Error al crear usuario:', error.message);
        
        if (error.message.includes('duplicate key')) {
            console.log('⚠️  El usuario ya existe en la base de datos');
        } else if (error.message.includes('connection')) {
            console.log('🔧 Verifica la configuración de la base de datos en .env');
        }
    } finally {
        // Cerrar conexión
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
            console.log('🔌 Conexión cerrada');
        }
    }
}

// Ejecutar el script
createFuncionariosUser();
