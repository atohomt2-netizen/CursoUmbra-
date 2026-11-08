/* Utilidades generales */
const $ = (s) => document.querySelector(s);
const show = (id) => {
  document.querySelectorAll(".v").forEach((e) => (e.hidden = e.id !== id));
  scrollTo(0, 0);
};
const esc = (s) =>
  String(s).replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );