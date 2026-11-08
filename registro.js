/* global $, show, esc, add */
var est = null;
var estId = null;

/* ---- Registro ---- */
async function registrar() {
  if (!$("#fReg").reportValidity()) {
    return;
  }

  est = {
    nombre: $("#nombre").value.trim() + " " + $("#apellido").value.trim(),
    email: $("#email").value,
    nacimiento: $("#nac").value,
    pais: $("#pais").value,
    curso: $("#curso").value,
    registro: new Date().toLocaleString("es-GT")
  };

  // Tabla con los datos del registro
  var filas = [
    ["Nombre", est.nombre],
    ["Correo", est.email],
    ["Nacimiento", est.nacimiento],
    ["País", est.pais],
    ["Curso", est.curso],
    ["Registrado", est.registro]
  ];
  var html = "";
  for (var i = 0; i < filas.length; i++) {
    html += "<tr><th>" + filas[i][0] + "</th><td>" + esc(filas[i][1]) + "</td></tr>";
  }
  $("#tDatos").innerHTML = html;
  show("datos");

  // Guardar en la base de datos (en segundo plano)
  add("estudiantes", est).then(
    function (id) {
      estId = id;
    },
    function (error) {
      console.warn(error);
    }
  );
}

function iniciarCurso() {
  show("curso-v");
  $("#prog").style.width = "33%";
}

function iniciarExamen() {
  $("#fEx").reset();
  $("#rv").textContent = "8";
  var preguntas = document.querySelectorAll(".q");
  for (var i = 0; i < preguntas.length; i++) {
    preguntas[i].className = "q";
  }
  $("#prog").style.width = "66%";
  show("examen");
}