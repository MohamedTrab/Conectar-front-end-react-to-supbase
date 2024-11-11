import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Configura tu cliente de Supabase
const supabase = createClient(
  "https://rzgrdfokokseorceymdh.supabase.co", 
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6Z3JkZm9rb2tzZW9yY2V5bWRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5Njk4MDEsImV4cCI6MjA0NjU0NTgwMX0.tjOlsK820jShtzLqY77lnNNB-5P_wqgGs_jHNDg-Ksw"
);

function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editingPost, setEditingPost] = useState(null); // Agregado para gestionar la edición de un post

  useEffect(() => {
    getPosts();
  }, []);

  // Función para obtener los posts de la base de datos
  async function getPosts() {
    const { data, error } = await supabase.from("posts").select();
    if (error) {
      console.error("Error obteniendo los posts:", error.message);
    } else {
      setPosts(data || []); // Asegura que `posts` no sea `null`
    }
  }

  // Función para agregar un nuevo post
  async function addPost() {
    if (title.trim() === "" || body.trim() === "") {
      console.warn("El título y el cuerpo no pueden estar vacíos");
      return;
    }
    const { data, error } = await supabase.from("posts").insert([{ title, body }]);
    if (error) {
      console.error("Error agregando el post:", error.message);
    } else if (data) {
      
      setPosts([...posts, ...data]);
      setTitle("");
      setBody("");
    }
    window.location.reload();
  }

  // Función para eliminar un post por su ID
  async function deletePost(id) {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) {
      console.error("Error eliminando el post:", error.message);
    } else {
      setPosts(posts.filter((post) => post.id !== id));
    }
  }

  // Función para actualizar un post
  async function updatePost() {
    if (title.trim() === "" || body.trim() === "") {
      console.warn("El título y el cuerpo no pueden estar vacíos");
      return;
    }
    const { data, error } = await supabase
      .from("posts")
      .update({ title, body })
      .eq("id", editingPost.id);

    if (error) {
      console.error("Error actualizando el post:", error.message);
    } else if (data) {
      // Actualizamos el post editado en la interfaz
      setPosts(posts.map((post) => (post.id === editingPost.id ? { ...post, title, body } : post)));
      setTitle("");
      setBody("");
      setEditingPost(null); // Resetear el estado de edición
      
    }
    window.location.reload();
  }

  // Función para habilitar la edición de un post
  function editPost(post) {
    setTitle(post.title);
    setBody(post.body);
    setEditingPost(post); // Establecer el post que estamos editando
  }

  return (
    <div>
      <h1>Gestión de Publicaciones</h1>

      {/* Contenedor del formulario */}
      <div className="form-container">
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Contenido"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        ></textarea>
        <button onClick={editingPost ? updatePost : addPost}>
          {editingPost ? "Actualizar Publicación" : "Agregar Publicación"}
        </button>
      </div>

      {/* Contenedor de publicaciones */}
      <div className="posts-container">
        <ul>
          {posts.length === 0 ? (
            <li>No hay publicaciones disponibles</li>
          ) : (
            posts.map((post) => (
              <li key={post.id}>
                <h3>{post.title}</h3>
                <p>{post.body}</p>
                <button onClick={() => deletePost(post.id)}>Eliminar</button>
                <button onClick={() => editPost(post)}>Editar</button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;
