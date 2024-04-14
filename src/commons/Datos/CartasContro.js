function activar(){
    // permite desactivar el botón de consultar limites
   
    let mensajesValor = '';
console.log('lo',this.Limites)
    if (this.Metodo) {
      this.inception = true;
      for (let clave in this.Limites) {
        if (this.Limites.hasOwnProperty(clave)) {
          const valor = this.Limites[clave];

          // Concatenar la información para cada clave
          mensajesValor += `<strong> Solución ${clave} ${this.row[0].value.unidad}</strong><br>`;
          mensajesValor += `LCS: ${valor.LCSresultado}` + " - " + `LCI: ${valor.LCIresultado}<br>`;
          mensajesValor += `LAS: ${valor.LASresultado}` + " - " + `LAI: ${valor.LAIresultado}<br>`;
          mensajesValor += `+1s: ${valor.MasDes}` + " / " + `-1s: ${valor.MenosDes}<br>`;
          mensajesValor += `Media: ${valor.Media.toFixed(2)} <br><br>`;


        }
      }
    } else if (this.MetodoRPD) {
      this.inception = true;
const limite = this.Limites[0]
console.log(limite)
   // Concatenar la información para cada objeto en el array
    mensajesValor += `<strong>Limites RPD</strong><br>`;
    mensajesValor += `LCS: ${limite.LCSresultado} <br>`;
    mensajesValor += `LAS: ${limite.LASresultado}<br>`;
    mensajesValor += `+1s: ${limite.MasDes}<br>`;
    mensajesValor += `Media: ${limite.Media.toFixed(2)} <br><br>`;
 
}else {
      mensajesValor = "Sin Limites aún"
    }

    this.Showlimite = mensajesValor; // Mostrar mensajesValor completo
}   