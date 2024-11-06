function verificarPropiedades() {
    let continuar = true; // Variable para controlar el ciclo

    while (continuar) {
        // Solicita al usuario si tiene casa y si tiene auto
        let tieneCasa = prompt("¿Tienes casa? (sí o no)").toLowerCase();
        let tieneAuto = prompt("¿Tienes auto? (sí o no)").toLowerCase();

        // Verifica las respuestas y muestra el mensaje correspondiente
        if ((tieneCasa === "sí" || tieneCasa === "si") && (tieneAuto === "sí" || tieneAuto === "si")) {
            alert("Perfecto");
        } else {
            alert("Apúrate");
        }

        // Pregunta al usuario si quiere continuar
        let respuesta = prompt("¿Quieres verificar otra vez? (sí o no)").toLowerCase();
        if (respuesta !== "sí" && respuesta !== "si") {
            continuar = false;
        }
    }
}
