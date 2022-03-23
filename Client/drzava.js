import { listaDrzava } from "./main.js";
import { enumDok } from "./dokument.js";
export class Drzava {
    constructor(id, naziv, podrzaniDokumenti, trazeniLjudi) {
        this.naziv = naziv;
        this.id = id;
        this.podrzaniDokumenti = podrzaniDokumenti;
        this.trazeniLjudi = trazeniLjudi;
    }
    crtaj(host) {
        const opcija = document.createElement("option");
        opcija.value = this.id;
        opcija.innerHTML = this.naziv;
        host.appendChild(opcija);
        return opcija;
    }
    crtajTabelu(host, tip) {
        host.replaceChildren();
        if (tip == "Dokumenti") {
            let tr = document.createElement("tr");

            let th = document.createElement("th");
            th.innerHTML = "Tip";
            tr.appendChild(th);

            th = document.createElement("th");
            th.innerHTML = "Datum Izdavanja";
            tr.appendChild(th);

            th = document.createElement("th");
            th.innerHTML = "Drzavljanstvo";
            tr.appendChild(th);

            th = document.createElement("th");
            th.innerHTML = "Akcija";
            tr.appendChild(th);
            host.appendChild(tr);

            this.podrzaniDokumenti.forEach(dok => {
                tr = document.createElement("tr");
                let td = document.createElement("td");
                td.innerHTML = enumDok[dok.tip];
                tr.appendChild(td);

                td = document.createElement("td");
                const datum = new Date(dok.datumIzdavanja).toLocaleDateString();
                td.innerHTML = datum;
                tr.appendChild(td);

                td = document.createElement("td");
                td.innerHTML = listaDrzava[dok.drzavljanstvo].naziv;
                tr.appendChild(td);

                td = document.createElement("td");
                const dzenson_baton = document.createElement("button");
                dzenson_baton.innerHTML = "Obrisi";
                dzenson_baton.addEventListener("click", () => {
                    fetch("https://localhost:5003/Drzava/SkloniDokument/" + this.id + "/" + dok.id, { method: "PUT" }).then((res) => {
                        if (res.ok) {
                            const ind = this.podrzaniDokumenti.indexOf(dok);
                            this.podrzaniDokumenti.splice(ind, 1);
                            this.crtajTabelu(host, tip);
                        }
                        else res.text().then(tekst => alert("Greška prilikom feča: " + tekst));
                    }, (err) => alert(err));
                });
                td.appendChild(dzenson_baton);
                tr.appendChild(td);
                host.appendChild(tr);

            });
        } else if (tip == "Poternica") {
            let tr = document.createElement("tr");

            let th = document.createElement("th");
            th.innerHTML = "JMBG";
            tr.appendChild(th);

            th = document.createElement("th");
            th.innerHTML = "Tip poternice";
            tr.appendChild(th);

            th = document.createElement("th");
            th.innerHTML = "Akcija";
            tr.appendChild(th);
            host.appendChild(tr);

            this.trazeniLjudi.forEach(ljud => {
                tr = document.createElement("tr");
                let td = document.createElement("td");
                td.innerHTML = ljud.jmbg;
                tr.appendChild(td);

                td = document.createElement("td");
                td.innerHTML = ljud.stroga ? "zabrana" : "kazna";
                tr.appendChild(td);

                td = document.createElement("td");
                const dzenson_baton = document.createElement("button");
                dzenson_baton.innerHTML = "Obrisi";
                dzenson_baton.addEventListener("click", () => {
                    fetch("https://localhost:5003/Drzava/SkloniPoternicu/" + this.id + "/" + ljud.id, { method: "PUT" }).then((res) => {
                        if (res.ok) {
                            const ind = this.trazeniLjudi.indexOf(ljud);
                            this.trazeniLjudi.splice(ind, 1);
                            this.crtajTabelu(host, tip);
                        }
                        else res.text().then(tekst => alert("Greška prilikom feča: " + tekst));
                    }, (err) => alert(err));
                });
                td.appendChild(dzenson_baton);
                tr.appendChild(td);
                host.appendChild(tr);

            });
        }
    }
    crtajImeSliku(host) {
        const tr = document.createElement("tr");
        let td = document.createElement("td");
        td.innerHTML = this.naziv;
        tr.appendChild(td);

        td = document.createElement("td");
        const img = document.createElement("img");
        img.src = "./slike/"+this.naziv+".svg";
        td.appendChild(img);
        tr.appendChild(td);

        tr.appendChild(td);
        host.appendChild(tr);
    }
    crtajImeSamo(host) {
        const ch = document.createElement("input");
        ch.type = "checkbox";
        ch.class="ekstremniBoksItem";
        ch.name = "ekstremniBoksItem";
        ch.value = this.id;

        const lb = document.createElement("label");
        lb.for = this.naziv;
        lb.innerHTML = this.naziv;
        lb.prepend(ch)
        host.appendChild(lb);
    }
}