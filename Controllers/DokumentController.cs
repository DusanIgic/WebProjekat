using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Models;

namespace Travel.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DokumentController : ControllerBase
    {

        public TravelContext Context { get; set; }

        public DokumentController(TravelContext context)
        {
            Context = context;
        }

        [Route("PreuzmiDokumenta/{DatumIzdavanjaS}/{TipS}/{DrzavljanstvoId}")]
        [HttpGet]
        public async Task<ActionResult> PreuzmiDokumenta(string DatumIzdavanjaS, int TipS, int DrzavljanstvoId)//Pozeljno drzava da bude tipa drzava
        {
            try
            {
                DateTime DatumIzdavanja = DateTime.Parse(DatumIzdavanjaS);
                Drzava drzavljanstvo = Context.Drzave.Where(p => p.ID == DrzavljanstvoId).FirstOrDefault();
                if (drzavljanstvo == null) BadRequest("Nepostojece drzavljanstvo");
                if (DatumIzdavanja > DateTime.Now)
                    return BadRequest("Datum izdavanja mora da bude pre danasnjeg datuma");
                if (TipS < 0 || TipS > 2)
                    return BadRequest("Neodgovarajuci tip dokumenta");
                TipDokumenta Tip = (TipDokumenta)TipS;
                var drz = await Context.Dokumenti.Where(q => q.DatumIzdavanja <= DatumIzdavanja).Where(t => t.Tip == Tip).Where(q => q.Drzavljanstvo == DrzavljanstvoId).Select(p => new
                {
                    ID = p.ID,
                    Tip = p.Tip,
                    DatumIzdavanja = p.DatumIzdavanja,
                    Drzavljanstvo = p.Drzavljanstvo,
                    PodrzaneDrzave = p.PodrzaneDrzave.Select(rw => new
                    {
                        ID = rw.ID,
                        Naziv = rw.Naziv
                    })
                }).FirstOrDefaultAsync();
                if (drz == null)
                    return Ok(new {PodrzaneDrzave = new int[]{} });
                return Ok(drz);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("DodajDokument/{DatumIzdavanjaS}/{TipS}/{DrzavljanstvoId}/")]
        [HttpPost]
        public async Task<ActionResult> DodajDokument(string DatumIzdavanjaS, int TipS, int DrzavljanstvoId, List<int> DrzaveInt)
        {
            try
            {
                DateTime DatumIzdavanja = DateTime.Parse(DatumIzdavanjaS);
                if (DatumIzdavanja > DateTime.Now)
                    return BadRequest("Datum izdavanja mora da bude pre danasnjeg datuma");
                if (TipS < 0 || TipS > 2)
                    return BadRequest("Neodgovarajuci tip dokumenta");
                Drzava drzavljanstvo = Context.Drzave.Where(p => p.ID == DrzavljanstvoId).FirstOrDefault();
                if (drzavljanstvo == null) BadRequest("Nepostojece drzavljanstvo");

                TipDokumenta Tip = (TipDokumenta)TipS;
                List<Dokument> docovi = await Context.Dokumenti.Include(p => p.PodrzaneDrzave).Where(t => t.Tip == Tip).Where(q => q.Drzavljanstvo == DrzavljanstvoId).ToListAsync();
                if (docovi.Count > 0)
                {
                    foreach (Dokument doc in docovi)
                    {
                        List<Drzava> Drzave = await Context.Drzave.Include(p => p.PodrzaniDokumenti).Where(p => p.PodrzaniDokumenti.Contains(doc)).ToListAsync();
                        foreach (Drzava dd in Drzave)
                        {
                            dd.PodrzaniDokumenti.Remove(doc);
                            Context.Drzave.Update(dd);

                        }
                        Drzave = await Context.Drzave.Include(p => p.PodrzaniDokumenti).Where(p => DrzaveInt.Contains(p.ID)).ToListAsync();
                        doc.DatumIzdavanja = DatumIzdavanja;
                        doc.PodrzaneDrzave = Drzave;
                        Context.Dokumenti.Update(doc);
                        foreach (Drzava dd in Drzave)
                        {
                            dd.PodrzaniDokumenti.Add(doc);
                            Context.Drzave.Update(dd);
                        }
                    }
                    await Context.SaveChangesAsync();
                    return Ok($"Uspesno izmenjeni dokumenti");
                }
                else
                {
                    List<Drzava> Drzave = await Context.Drzave.Include(p => p.PodrzaniDokumenti).Where(p => DrzaveInt.Contains(p.ID)).ToListAsync();
                    if (Drzave.Count == 0) return BadRequest($"Dokument mora vaziti barem u jednoj zemlji{(DrzaveInt.Count - Drzave.Count != 0 ? $", od toga su {DrzaveInt.Count - Drzave.Count} lose drzave!" : ".")}");
                    Dokument d = new Dokument
                    {
                        DatumIzdavanja = DatumIzdavanja,
                        Tip = (TipDokumenta)TipS,
                        Drzavljanstvo = DrzavljanstvoId,
                        PodrzaneDrzave = new List<Drzava>(Drzave)
                    };
                    foreach (Drzava dr in Drzave)
                    {
                        dr.PodrzaniDokumenti.Add(d);
                        Context.Drzave.Update(dr);
                    }
                    Context.Dokumenti.Add(d);
                    await Context.SaveChangesAsync();
                    return Ok($"Uspesno dodat dokument{(DrzaveInt.Count - Drzave.Count != 0 ? $", od toga su {DrzaveInt.Count - Drzave.Count} lose drzave!" : ".")}");

                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

    }

}
