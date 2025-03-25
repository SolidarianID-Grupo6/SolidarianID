
export const communitiesRequest = async () => {
    try {
        const response = await fetch('http://localhost:3001/community-requests');
        if (!response.ok) {
            console.log('Error en la solicitud:', response);
            throw new Error(`Error al obtener comunidades: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error:", error);
        return null;
    }

}