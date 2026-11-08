/* global $, show, add, est, estId */
/* ---- Evaluación ---- */
async function calificar() {
  var f = $("#fEx");
  var v = function (n) {
    return f.elements[n].value;
  };

  // Pregunta 2: casillas marcadas (valores ordenados, ej. "acd")
  var marcadas = Array.from(f.querySelectorAll("[name=q2]:checked"));
  var chk = marcadas
    .map(function (x) {
      return x.value;
    })
    .sort()
    .join("");

  // Resultado de cada pregunta (true = correcta)
  var res = [
    v("q1") === "b",
    chk === "acd",
    v("q3") === "b",
    v("q4") === "c",
    ["2fa", "mfa"].indexOf(v("q5").trim().toLowerCase()) !== -1,
    Number(v("q6")) >= 12
  ];

  // Marcar cada pregunta en verde o rojo
  for (var i = 0; i < res.length; i++) {
    var caja = $("#q" + (i + 1));
    caja.className = res[i] ? "q ok" : "q bad";
  }

  var bien = res.filter(Boolean).length;
  var nota = Number(((bien / 6) * 10).toFixed(1));
  var aprob = nota >= 7;

  var fecha = new Date().toLocaleDateString("es-GT", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  var respuestas = {
    q1: v("q1"),
    q2: chk,
    q3: v("q3"),
    q4: v("q4"),
    q5: v("q5"),
    q6: v("q6")
  };
  var folio = "UMB-" + Date.now().toString(36).toUpperCase();

  // Guardar en la base de datos
  try {
    await add("evaluaciones", {
      estudianteId: estId,
      nombre: est ? est.nombre : "Anónimo",
      fecha: new Date().toLocaleString("es-GT"),
      respuestas: respuestas,
      correctas: bien,
      nota: nota,
      aprobado: aprob
    });
  } catch (error) {
    console.warn(error);
  }

  // Mostrar resultado
  $("#nota").textContent = nota.toFixed(1) + " / 10";
  $("#nota").style.color = aprob ? "var(--ok)" : "var(--bad)";
  var mensaje = "Respondiste correctamente " + bien + " de 6 preguntas. ";
  mensaje += aprob
    ? "¡Aprobado!"
    : "Necesitas 7.0 para aprobar. Revisa el curso e inténtalo de nuevo.";
  $("#msg").textContent = mensaje;
  $("#dip").hidden = !aprob;
  $("#bRe").hidden = aprob;

  // Diploma
  if (aprob) {
    $("#dNom").textContent = est ? est.nombre : "Estudiante";
    $("#dNota").textContent = nota.toFixed(1);
    $("#dFecha").textContent = fecha;
    $("#dFolio").textContent = "Folio: " + folio;
    $("#prog").style.width = "100%";
  }
  show("resultado");
}