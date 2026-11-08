/* ---- Estrellas en los botones ---- */
const STAR =
  '<svg viewBox="0 0 784.11 815.53" xmlns="http://www.w3.org/2000/svg"><path fill="#fffdef" d="M392.05 0c-20.9,210.08-184.06,378.41-392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93-210.06 184.09-378.37 392.05-407.74-207.98-29.38-371.16-197.69-392.05-407.78z"/></svg>';
document.querySelectorAll("button").forEach((b) => {
  for (let i = 1; i <= 6; i++) {
    const w = document.createElement("span");
    w.innerHTML = STAR;
    const sv = w.firstChild;
    sv.setAttribute("class", "star-" + i);
    b.appendChild(sv);
  }
});

/* ---- Capibara al pie de las demás pantallas ---- */
const CAPY =
  '<div class="capybaraloader" aria-hidden="true"><div class="capybara"><div class="capyhead"><div class="capyear"><div class="capyear2"></div></div><div class="capyear"><div class="capyear2"></div></div><div class="capymouth"><div class="capylips"></div><div class="capylips"></div></div><div class="capyeye"></div><div class="capyeye"></div></div><div class="capyleg"></div><div class="capyleg2"></div><div class="capyleg2"></div><div class="capy"></div></div><div class="cb-ground"><div class="loaderline"></div></div></div>';
document
  .querySelectorAll(".v:not(#inicio)")
  .forEach((v) => v.insertAdjacentHTML("beforeend", CAPY));

cargarHist();