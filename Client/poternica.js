import { Drzava } from "./drzava.js"
export class Poternica {
    constructor(id, jmbg, stroga, zabranjenUlazUDrzave) {
        this.id = id;
        this.jmbg = jmbg;
        this.stroga = stroga;
        this.zabranjenUlazUDrzave = zabranjenUlazUDrzave;
    }
    crtaj(host, listaDrzava) {
        const dzenson_baton = host.querySelector(".obrisiPoternicu")
        if (!this.id) dzenson_baton.disabled = true;
        else dzenson_baton.disabled = false;
        host.style.display="flex";
        const tabelaZ = host.querySelector(".tabelaPoterniceZelene");
        const tabelaC = host.querySelector(".tabelaPoterniceCrvene");
        const inputi = host.querySelector(".inputi");
        const naslovZ = tabelaZ.querySelector(".tabelaPoterniceNaslov");
        const naslovC = tabelaC.querySelector(".tabelaPoterniceNaslov");
        tabelaZ.replaceChildren(naslovZ);
        tabelaC.replaceChildren(naslovC);
        if (this.stroga == true) {
            tabelaC.classList.add("stroga");
            tabelaC.classList.remove("nestroga");
        }
        else {
            tabelaC.classList.add("nestroga");
            tabelaC.classList.remove("stroga");
        }
        this.zabranjenUlazUDrzave.forEach(dr => {
            const d = new Drzava(dr.id, dr.naziv, null, null);
            d.crtajImeSliku(tabelaC);
        });
        let j=0;
        for (const dr in listaDrzava) {
            let i = true;
            this.zabranjenUlazUDrzave.forEach(ddd => {
                if (ddd.id == dr)
                    i = false;
            });
            if (i) {
                j++;
                listaDrzava[dr].crtajImeSliku(tabelaZ);
            }
        }
        dzenson_baton.onclick = () => {
            fetch("https://localhost:5003/Poternica/ObrisiPoternicu/" + this.jmbg, { method: "DELETE" }).then(res => {
                if (res.ok) {
                    tabelaZ.replaceChildren(naslovZ);
                    tabelaC.replaceChildren(naslovC);
                    host.style.display="none";
                    dzenson_baton.onclick = () => {
                    };
                }
                else res.text().then(tekst => alert("Greška prilikom feča: " + tekst));
            });
        }
        
        if (j > this.zabranjenUlazUDrzave.length) {
            for (let k = 0; k < j - this.zabranjenUlazUDrzave.length; k++) {
                let tr = document.createElement("tr");
                tr.className = "nevidljiv";
                tabelaC.appendChild(tr);
            }
        } else {
            for (let k = 0; k < this.zabranjenUlazUDrzave.legth-j; k++) {
                let tr = document.createElement("tr");
                tr.className = "nevidljiv";
                tabelaZ.appendChild(tr);
            }
        }
    }
}