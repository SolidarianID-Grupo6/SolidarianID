import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        nombre: "",
        apellido: "",
        email: "",
        fotoUrl: ""
    },
    reducers: {
        login: (state, action) => {
            state.nombre = action.payload.nombre;
            state.apellido = action.payload.apellido;
            state.email = action.payload.email;
            state.fotoUrl = action.payload.fotoUrl;
        },
        logout: (state) => {
            state.nombre = "";
            state.apellido = "";
            state.email = "";
            state.fotoUrl = "";
        }
    }
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;