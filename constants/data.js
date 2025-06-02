export const comentarios = Array.from({length:15}, (_, i) => ({
    id: `${i + 1}`,
    titulo: `Esta publicación es la número ${i + 1}`,
    descripcion: `Esta es la descripción de la publicación número ${i + 1}. Aquí puedes agregar más detalles sobre el contenido de la publicación.`,
    fecha: new Date(2023, 9, i + 1).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }),
    comentarios: Array.from({length:4}, (_,j)=>({
        texto: `Comentario ${j + 1} de la publicación número ${i + 1}`,
        autor: `Usuario ${j + 1}`,
    }))
}));