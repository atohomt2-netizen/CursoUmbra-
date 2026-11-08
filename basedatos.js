/* global $, esc, indexedDB */
/* ---- Base de datos (IndexedDB) ---- */
var memoria = { estudiantes: [], evaluaciones: [] };

// Abre (o crea) la base de datos "umbraDB"
function abrirBD() {
  return new Promise(function (resolver, rechazar) {
    var peticion = indexedDB.open("umbraDB", 1);
    peticion.onupgradeneeded = function () {
      var bd = peticion.result;
      bd.createObjectStore("estudiantes", { keyPath: "id", autoIncrement: true });
      bd.createObjectStore("evaluaciones", { keyPath: "id", autoIncrement: true });
    };
    peticion.onsuccess = function () {
      resolver(peticion.result);
    };
    peticion.onerror = function () {
      rechazar(peticion.error);
    };
    peticion.onblocked = function () {
      rechazar(new Error("blocked"));
    };
  });
}

// Si una operación tarda más de 2 segundos, se cancela
function conLimite(promesa) {
  var espera = new Promise(function (resolver, rechazar) {
    setTimeout(function () {
      rechazar(new Error("timeout"));
    }, 2000);
  });
  return Promise.race([promesa, espera]);
}

// Guarda un registro. Si IndexedDB falla, usa localStorage o la memoria
async function add(almacen, dato) {
  try {
    var bd = await conLimite(abrirBD());
    return await conLimite(
      new Promise(function (resolver, rechazar) {
        var tx = bd.transaction(almacen, "readwrite");
        var pedido = tx.objectStore(almacen).add(dato);
        pedido.onsuccess = function () {
          resolver(pedido.result);
        };
        pedido.onerror = function () {
          rechazar(pedido.error);
        };
      })
    );
  } catch (error) {
    console.warn("IndexedDB no disponible, uso respaldo", error);
    dato.id = Date.now();
    memoria[almacen].push(dato);
    try {
      var clave = "umbra_" + almacen;
      var lista = JSON.parse(localStorage.getItem(clave) || "[]");
      lista.push(dato);
      localStorage.setItem(clave, JSON.stringify(lista));
    } catch (errorLocal) {
      console.warn("localStorage no disponible", errorLocal);
    }
    return dato.id;
  }
}

// Lee todos los registros de un almacén
async function all(almacen) {
  try {
    var bd = await conLimite(abrirBD());
    return await conLimite(
      new Promise(function (resolver, rechazar) {
        var pedido = bd.transaction(almacen).objectStore(almacen).getAll();
        pedido.onsuccess = function () {
          resolver(pedido.result);
        };
        pedido.onerror = function () {
          rechazar(pedido.error);
        };
      })
    );
  } catch (error) {
    try {
      return JSON.parse(localStorage.getItem("umbra_" + almacen) || "[]");
    } catch (errorLocal) {
      return memoria[almacen];
    }
  }
}

// Muestra las últimas 10 evaluaciones en la portada
async function cargarHist() {
  try {
    var lista = await all("evaluaciones");
    var ev = lista.reverse().slice(0, 10);
    if (ev.length === 0) {
      $("#historial").innerHTML = "Aún no hay evaluaciones registradas.";
      return;
    }
    var html =
      "<table><tr><th>Estudiante</th><th>Fecha</th><th>Nota</th><th>Estado</th></tr>";
    for (var i = 0; i < ev.length; i++) {
      var e = ev[i];
      html +=
        "<tr><td>" + esc(e.nombre) + "</td>" +
        "<td>" + e.fecha + "</td>" +
        "<td>" + e.nota + "</td>" +
        "<td>" + (e.aprobado ? "Aprobado" : "Reprobado") + "</td></tr>";
    }
    $("#historial").innerHTML = html + "</table>";
  } catch (error) {
    $("#historial").textContent = "Base de datos no disponible en este navegador.";
  }
}