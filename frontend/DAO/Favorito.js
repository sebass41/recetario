import origin from "../config/origin.js";

export default class FavoritoDAO {

  async agregarFavorito(idReceta) {
    const formdata = new FormData();
    formdata.append("id_receta", idReceta);

    const url = origin + "/backend/controller/FavoritoController.php?fun=agregar";
    const config = {
      method: "POST",
      body: formdata,
      credentials: "include"
    };

    const response = await fetch(url, config);
    return await response.json();
  }

  async eliminarFavorito(idReceta) {
    const formdata = new FormData();
    formdata.append("id_receta", idReceta);

    const url = origin + "/backend/controller/FavoritoController.php?fun=eliminar";
    const config = {
      method: "POST",
      body: formdata,
      credentials: "include"
    };

    const response = await fetch(url, config);
    return await response.json();
  }

  async obtenerFavoritosUsuario() {
    const url = origin + "/backend/controller/FavoritoController.php?fun=obtener";
    const config = {
      method: "GET",
      credentials: "include"
    };

    const response = await fetch(url, config);
    return await response.json();
  }

  async verificarFavorito(idReceta) {
    const url = origin + `/backend/controller/FavoritoController.php?fun=verificar&id_receta=${idReceta}`;
    const config = {
      method: "GET",
      credentials: "include"
    };

    const response = await fetch(url, config);
    return await response.json();
  }
}