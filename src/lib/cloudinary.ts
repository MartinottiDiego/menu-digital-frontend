function getUploadPreset(): string {
  // En Next la variable se inyecta vía next.config (`env`), accesible por
  // process.env tanto en server como en cliente. (Antes había un acceso estilo
  // Vite a `import.meta.env` que webpack marcaba como "critical dependency".)
  return process.env.NEXT_CLOUDINARY_UPLOAD_PRESET || '';
}

export async function uploadToCloudinary(file: File): Promise<string> {
  const uploadPreset = getUploadPreset();
  if (!uploadPreset) {
    throw new Error(
      'Falta configurar NEXT_CLOUDINARY_UPLOAD_PRESET en el entorno'
    );
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(
    'https://api.cloudinary.com/v1_1/dmaciisvy/image/upload',
    { method: 'POST', body: formData }
  );

  const rawText = await response.text();

  if (!response.ok) {
    let message = `Error subiendo imagen a Cloudinary (${response.status})`;
    try {
      const errJson = JSON.parse(rawText) as {
        error?: { message?: string };
      };
      if (errJson?.error?.message) {
        message = `${message}: ${errJson.error.message}`;
      }
    } catch {
      if (rawText) message = `${message}: ${rawText.slice(0, 200)}`;
    }
    throw new Error(message);
  }

  let data: { secure_url?: string };
  try {
    data = JSON.parse(rawText) as { secure_url?: string };
  } catch {
    throw new Error('Respuesta inválida de Cloudinary (no JSON)');
  }

  if (!data.secure_url) {
    throw new Error('Respuesta inválida de Cloudinary (sin secure_url)');
  }

  return data.secure_url;
}
