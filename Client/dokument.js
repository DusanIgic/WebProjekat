import { Drzava } from "./drzava.js"
export const enumDok = {
    "0": "Licna Karta",
    "1": "Pasos",
    "2": "Viza"
}
export class Dokument {
    constructor(id, tip, datumIzdavanja, drzavljanstvo, podrzaneDrzave) {
        this.id = id;
        this.tip = tip;
        this.datumIzdavanja = datumIzdavanja;
        this.drzavljanstvo = drzavljanstvo;
        this.podrzaneDrzave = podrzaneDrzave;
    }
    crtaj(host, listaDrzava) {
        const tabelaZ = host.querySelector(".tabelaDokumeniZelene");
        const tabelaC = host.querySelector(".tabelaDokumeniCrvene");
        const naslovZ = tabelaZ.querySelector(".tabelaDokumeniNaslov");
        const naslovC = tabelaC.querySelector(".tabelaDokumeniNaslov");
        host.style.display = "flex";
        tabelaZ.replaceChildren(naslovZ);
        tabelaC.replaceChildren(naslovC);
        this.podrzaneDrzave.forEach(dr => {
            const d = new Drzava(dr.id, dr.naziv, dr.podrzaniDokumenti, dr.trazeniLjudi);
            d.crtajImeSliku(tabelaZ);
        });
        let j = 0;
        for (const dr in listaDrzava) {
            let i = true;
            this.podrzaneDrzave.forEach(ddd => {
                if (ddd.id == dr)
                    i = false;
            });
            if (i) {
                j++;
                listaDrzava[dr].crtajImeSliku(tabelaC);
            }
        }
        if (j > this.podrzaneDrzave.length) {
            for (let k = 0; k < j - this.podrzaneDrzave.length; k++) {
                let tr = document.createElement("tr");
                tr.className = "nevidljiv";
                tabelaZ.appendChild(tr);
            }
        } else {
            for (let k = 0; k < this.podrzaneDrzave.legth-j; k++) {
                let tr = document.createElement("tr");
                tr.className = "nevidljiv";
                tabelaC.appendChild(tr);
            }
        }
    }
}