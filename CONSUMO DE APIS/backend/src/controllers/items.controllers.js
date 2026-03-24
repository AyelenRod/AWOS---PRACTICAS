const fetch = require("node-fetch");

const DISNEYAPI_BASE = "https://api.disneyapi.dev/character";

const getAll = async (req, res) => {
  try {
    const listRes = await fetch(`${DISNEYAPI_BASE}?pageSize=20`);
    const listData = await listRes.json();

    let arr = Array.isArray(listData.data) ? listData.data : [listData.data];

    const items = arr.map(data => ({
      id: data._id,
      title: data.name,
      image: data.imageUrl || "https://placehold.co/128x128/94C2DA/203F9A?text=?",
      tag: "Personaje",
      subtitle: `Nº${String(data._id).padStart(3, "0")}`,

      details: [
        { label: "Películas", value: data.films?.length || "—" },
        { label: "Series TV", value: data.tvShows?.length || "—" },
        { label: "Videojuegos", value: data.videoGames?.length || "—" },
        { label: "Atracciones", value: data.parkAttractions?.length || "—" },
      ],

      badges: Array.isArray(data.films) ? data.films.slice(0, 2) : [],
      stats: [
        {
          name: "Películas",
          value: Math.min(((data.films?.length || 0) * 10), 100),
        },
        {
          name: "Series TV",
          value: Math.min(((data.tvShows?.length || 0) * 10), 100),
        }
      ],
    }));

    res.json(items);

  } catch (error) {
    res.status(500).json({
      message: "Error al obtener datos de la API externa",
      detail: error.message,
    });
  }
};

module.exports = { getAll };