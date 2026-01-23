/**
 * Construye la URL de la foto basada en la cédula del usuario
 * @param cedula - La cédula del usuario (puede ser null o undefined)
 * @returns La URL completa de la foto o null si no hay cédula
 */
export function construirUrlFoto(cedula: string | null | undefined): string | null {
  if (!cedula) {
    return null;
  }
  // Formatear la cédula con ceros a la izquierda hasta 11 dígitos
  const cedulaFormateada = cedula.padStart(11, '0');
  return `https://presidencial.atl1.cdn.digitaloceanspaces.com/fotos_cedulados/${cedulaFormateada}.jpg`;
}

