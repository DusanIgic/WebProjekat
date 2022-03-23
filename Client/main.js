import { Drzava } from "./drzava.js";
import { Poternica } from "./poternica.js";
import { Dokument } from "./dokument.js";

const listaPoternica = [];
const listaDokumenata = [];
export const listaDrzava = {};

window.addEventListener("load", () => {
    
    let stanjeDokumenti = true;
    let stanjePoternice = true;
    const stranicaDokumenti = document.querySelector(".stranicaDokumenti");
    const stranicaDrzave = document.querySelector(".stranicaDrzave");
    const stranicaPoternice = document.querySelector(".stranicaPoternice");
    const meniDokumenti = document.querySelector(".meniDokumenti");
    const meniDrzave = document.querySelector(".meniDrzave");
    const meniPoternice = document.querySelector(".meniPoternice");
    const dugmeTraziPoternica = stranicaPoternice.querySelector(".dugmeTraziPoternice");
    const dugmeDodajPoternica = stranicaPoternice.querySelector(".dugmeDodajPoternice");

    const dugmeTraziDokumenti = stranicaDokumenti.querySelector(".dugmeTraziDokumente");
    const dugmeDodajDokumenti = stranicaDokumenti.querySelector(".dugmeDodajDokumente");
    const prikazi = (stranica) => {
        stranicaDokumenti.style.display = "none";
        stranicaDrzave.style.display = "none";
        stranicaPoternice.style.display = "none";
        document.querySelectorAll(".ostalo").forEach(el => el.style.display = "none");
        stranica.style.display = "flex";
    };
    const stranicaDrzavaCrtanje = (broj) => {
        listaDrzava[broj].crtajTabelu(stranicaDrzave.querySelector(".tabelaDrzava"), stranicaDrzave.querySelector("input[name='selektTabelaDrzavaStranica']:checked").value);
    }
    const fecajDrzazve = () => fetch("https://localhost:5003/Drzava/Preuzmi").then(res => {
        if (res.ok)
            res.json().then(rres => {
                const selektDrzavljanstvoDokumenti = stranicaDokumenti.querySelector(".selektDrzavljanstvoDokumenti");
                const selektDrzavaStranica = stranicaDrzave.querySelector(".selektDrzavaStranica");

                const selektTabelaDrzavaStranica = stranicaDrzave.querySelectorAll("input[name=selektTabelaDrzavaStranica]");
                stranicaPoternice.querySelector(".ekstremniBoks").replaceChildren();
                stranicaDokumenti.querySelector(".ekstremniBoks").replaceChildren();
                selektDrzavljanstvoDokumenti.replaceChildren();
                selektDrzavaStranica.replaceChildren();
                rres.forEach(d => {
                    let drz = new Drzava(d.id, d.naziv, d.podrzaniDokumenti, d.trazeniLjudi);
                    drz.crtaj(selektDrzavljanstvoDokumenti).selected = true;
                    drz.crtaj(selektDrzavaStranica).selected = true;
                    drz.crtajImeSamo(stranicaPoternice.querySelector(".ekstremniBoks"));
                    drz.crtajImeSamo(stranicaDokumenti.querySelector(".ekstremniBoks"));
                    listaDrzava[drz.id] = drz;
                });
                selektDrzavaStranica.addEventListener("change", event =>
                    stranicaDrzavaCrtanje(event.target.value)
                );
                selektTabelaDrzavaStranica.forEach(radio =>
                    radio.addEventListener("change", () =>
                        stranicaDrzavaCrtanje(selektDrzavaStranica.value)
                    )
                );
                const zadnji = Object.keys(listaDrzava).at(-1);
                stranicaDrzavaCrtanje(zadnji);
            }, err => alert(err))
        else res.text().then(tekst => alert("Greška prilikom feča: " + tekst));
    }, err => alert(err));

    fecajDrzazve();
    const jmbgEl = stranicaPoternice.querySelector(".inputJmbgPoternice");
    const jmbgFun = () => {
        if (jmbgEl.value.length == 13) {
            dugmeTraziPoternica.disabled = false;
            dugmeDodajPoternica.disabled = false;
        } else {
            dugmeTraziPoternica.disabled = true;
            dugmeDodajPoternica.disabled = true;
        }
    };
    jmbgEl.addEventListener("change", jmbgFun);
    const traziPoternice = () => {
        const jmbg = jmbgEl.value;
        if (jmbg.length != 13) {
            alert("JMBG mora da ima 13 cifara");
            return;
        }
        if (!jmbg.match(/^[0-9]+$/g)) {
            alert("JMBG sme da sadrzi samo cifre.");
            return;
        }
        fetch("https://localhost:5003/Poternica/PreuzmiPoternicu/" + jmbg).then(res => {
            if (res.ok)
                res.json().then(rres => {
                    const pot = new Poternica(rres.id, rres.jmbg, rres.stroga, rres.zabranjenUlazUDrzave)
                    listaPoternica.push(pot);
                    pot.crtaj(stranicaPoternice.querySelector(".ostalo"), listaDrzava);
                }, err => alert(err))
            else res.text().then(tekst => alert("Greška prilikom feča: " + tekst));
        }, err => alert(err));
    };

    dugmeTraziPoternica.addEventListener("click", traziPoternice);

    const promenaStanjaDugmetaPoternice = () => {
        const subInputi = stranicaPoternice.querySelector(".subInputi");
        stanjePoternice = stanjePoternice ? false : true;
        if (stanjePoternice) {
            dugmeDodajPoternica.innerHTML = "Dodaj poternice";
            subInputi.style.display = "none";
            dugmeTraziPoternica.disabled = false;
            jmbgEl.disabled = false;
        } else {
            dugmeDodajPoternica.innerHTML = "Ugasi dodavanje";
            subInputi.style.display = "flex";
            dugmeTraziPoternica.disabled = true;
            jmbgEl.disabled = true;
        }
    }
    dugmeDodajPoternica.addEventListener("click", promenaStanjaDugmetaPoternice);

    stranicaPoternice.querySelector(".dugmeDodajPoternice4Real").addEventListener("click", () => {
        const jmbg = jmbgEl.value;
        if (jmbg.length != 13) {
            alert("JMBG mora da ima 13 cifara");
            return;
        }
        if (!jmbg.match(/^[0-9]+$/g)) {
            alert("JMBG sme da sadrzi samo cifre.");
            return;
        }
        const stroga = stranicaPoternice.querySelector("input[name='selektStogocaPoterniceStranica']:checked").value;
        if (stroga != "false" && stroga != "true") {
            alert("Neispravno.");
            return;
        }
        const odabraneZemlje = stranicaPoternice.querySelectorAll("input[name='ekstremniBoksItem']:checked");
        const odabraneZemljeIds = [];
        odabraneZemlje.forEach(zemlja => {
            odabraneZemljeIds.push(zemlja.value);
        });
        if (odabraneZemljeIds.length < 1) {
            alert("Odaberi bar jednu zemlju.");
            return;
        }
        fetch("https://localhost:5003/Poternica/NapraviPoternicu/" + jmbg + "/" + stroga, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            dataType: "json",
            body: JSON.stringify(odabraneZemljeIds)
        }).then(res => {
            if (res.ok) {
                traziPoternice();
                promenaStanjaDugmetaPoternice();
            }
            else res.text().then(tekst => alert("Greška prilikom feča: " + tekst));
        }, err => alert(err));
    });

    const traziDokumenta = () => {
        const drzavljanstvo = stranicaDokumenti.querySelector(".selektDrzavljanstvoDokumenti").value;
        if (!listaDrzava.hasOwnProperty(drzavljanstvo)) {
            alert("nepostojeca drzava");
            return;
        }
        const tips = stranicaDokumenti.querySelector("input[name='selektTipDokumenti']:checked").value;
        if (tips > 2 || tips < 0) {
            alert("odabran neispravna vrsta dokumenta");
            return;
        }
        const datum = stranicaDokumenti.querySelector(".selektDatumDokumenti").value;
        if (datum == "" || datum > new Date()) {
            alert("odabran neispravan datum");
            return;
        }
        const datumce = new Date(datum).toISOString();
        fetch("https://localhost:5003/Dokument/PreuzmiDokumenta/" + datumce + "/" + tips + "/" + drzavljanstvo).then(res => {
            if (res.ok)
                res.json().then(rres => {
                    const dok = new Dokument(rres.id, rres.tip, rres.datumIzdavanja, rres.drzavljanstvo, rres.podrzaneDrzave);
                    dok.crtaj(stranicaDokumenti.querySelector(".ostalo"), listaDrzava);
                }, err => alert(err))
            else res.text().then(tekst => alert("Greška prilikom feča: " + tekst));
        }, err => alert(err));
    };

    dugmeTraziPoternica.addEventListener("click", traziPoternice);

    const promenaStanjaDugmetaDokumenti = () => {
        const subInputi = stranicaDokumenti.querySelector(".subInputi");
        stanjeDokumenti = stanjeDokumenti ? false : true;
        const tipsi = stranicaDokumenti.querySelectorAll("input[name='selektTipDokumenti']");
        const drzavljanstvo = stranicaDokumenti.querySelector(".selektDrzavljanstvoDokumenti");
        const datum = stranicaDokumenti.querySelector(".selektDatumDokumenti");
        if (stanjeDokumenti) {
            dugmeDodajDokumenti.innerHTML = "Dodaj dokument";
            subInputi.style.display = "none";
            dugmeTraziDokumenti.disabled = false;
            tipsi.forEach(element => {
                element.disabled = false;
            });
            drzavljanstvo.disabled = false;
            datum.disabled = false;
        } else {
            dugmeDodajDokumenti.innerHTML = "Ugasi dodavanje";
            subInputi.style.display = "flex";
            dugmeTraziDokumenti.disabled = true;

            tipsi.forEach(element => {
                element.disabled = true;
            });
            drzavljanstvo.disabled = true;
            datum.disabled = true;
        }
    }
    dugmeDodajDokumenti.addEventListener("click", promenaStanjaDugmetaDokumenti);
    dugmeTraziDokumenti.addEventListener("click", traziDokumenta);

    stranicaDokumenti.querySelector(".dugmeDodajDokumente4Real").addEventListener("click", () => {
        const drzavljanstvo = stranicaDokumenti.querySelector(".selektDrzavljanstvoDokumenti").value;
        if (!listaDrzava.hasOwnProperty(drzavljanstvo)) {
            alert("nepostojeca drzava");
            return;
        }
        const tips = stranicaDokumenti.querySelector("input[name='selektTipDokumenti']:checked").value;
        if (tips > 2 || tips < 0) {
            alert("odabran neispravna vrsta dokumenta");
            return;
        }
        const datum = stranicaDokumenti.querySelector(".selektDatumDokumenti").value;
        if (datum == "" || datum > new Date()) {
            alert("odabran neispravan datum");
            return;
        }
        const datumce = new Date(datum).toISOString();
        const odabraneZemlje = stranicaDokumenti.querySelectorAll("input[name='ekstremniBoksItem']:checked");
        const odabraneZemljeIds = [];
        odabraneZemlje.forEach(zemlja => {
            odabraneZemljeIds.push(zemlja.value);
        });

        if (odabraneZemljeIds.length < 1) {
            alert("Odaberi bar jednu zemlju.");
            return;
        }
        fetch("https://localhost:5003/Dokument/DodajDokument/" + datumce + "/" + tips + "/" + drzavljanstvo, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            dataType: "json",
            body: JSON.stringify(odabraneZemljeIds)
        }).then(res => {
            if (res.ok) {
                traziDokumenta();
                promenaStanjaDugmetaDokumenti();
            }
            else res.text().then(tekst => alert("Greška prilikom feča: " + tekst));
        }, err => alert(err));
    });

    meniDokumenti.addEventListener("click", () => {
        prikazi(stranicaDokumenti);
    });
    meniDrzave.addEventListener("click", () => {
        fecajDrzazve();
        prikazi(stranicaDrzave);
    });

    meniPoternice.addEventListener("click", () => {
        prikazi(stranicaPoternice);
    });
    stranicaDokumenti.querySelector(".selektDatumDokumenti").valueAsDate = new Date();
    stranicaDokumenti.querySelector(".selektDatumDokumenti").max = new Date().toISOString().split("T")[0];
    prikazi(stranicaDrzave);
});