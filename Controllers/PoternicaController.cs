using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Models;
using System.Text.RegularExpressions;
namespace Travel.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PoternicaController : ControllerBase
    {

        public TravelContext Context { get; set; }
        public PoternicaController(TravelContext context)
        {
            Context = context;
        }
        [Route("PreuzmiPoternicu/{JMBG}")]
        [HttpGet]
        public async Task<ActionResult> PreuzmiPoternicu(string JMBG)
        {
            try
            {        
                if (!Regex.IsMatch(JMBG, @"^[0-9]+$") || JMBG.Length != 13) return BadRequest("JMBG mora da se sastoji samo od 13 cifara");
                var p = await Context.Poternice.Where(w => w.JMBG == JMBG).Select(p =>
                    new
                    {
                        Stroga = p.Stroga,
                        ID = p.ID,
                        JMBG = p.JMBG,
                        ZabranjenUlazUDrzave = p.ZabranjenUlazUDrzave.Select(qq => new
                        {
                            ID = qq.ID,
                            Naziv = qq.Naziv
                        }).ToList()
                    }).FirstOrDefaultAsync();
                if (p == null) return Ok(new
                {
                    stroga = false,
                    jmbg = JMBG,
                    ZabranjenUlazUDrzave = new int[] { }
                });
                return Ok(p);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [Route("NapraviPoternicu/{JMBG}/{Stroga}")]
        [HttpPost]
        public async Task<ActionResult> AzurirajPoternicu(string Stroga, [FromBody] List<int> ZabranjeneIDs, string JMBG)
        {
            try
            {
                if (!Regex.IsMatch(JMBG, @"^[0-9]+$") || JMBG.Length != 13) return BadRequest("JMBG mora da se sastoji samo od 13 cifara");
                if (Stroga != "true" && Stroga != "false") return BadRequest("Ne postoji taj tip poternice.");
                Poternica p = await Context.Poternice.Where(p => p.JMBG == JMBG).FirstOrDefaultAsync();
                List<Drzava> Zabranjene = Context.Drzave.Where(q => ZabranjeneIDs.Contains(q.ID)).ToList();
                if (Zabranjene.Count == 0) return BadRequest("Poternica mora vaziti barem za jednu drzavu.");
                if (p == null)
                {
                    p = new Poternica { JMBG = JMBG, Stroga = Stroga == "true" ? true : false, ZabranjenUlazUDrzave = new List<Drzava>(Zabranjene) };
                    Context.Poternice.Add(p);
                    foreach (Drzava dr in Zabranjene)
                    {
                        Drzava dd = Context.Drzave.Where(p => p == dr).FirstOrDefault();
                        if (dd != null)
                        {
                            if (dd.TrazeniLjudi == null) dd.TrazeniLjudi = new List<Poternica>();
                            dd.TrazeniLjudi.Add(p);
                            Context.Drzave.Update(dd);
                        }
                    }
                    await Context.SaveChangesAsync();
                    return Ok($"Uspesno dodata poternica{(ZabranjeneIDs.Count - Zabranjene.Count != 0 ? $", od toga su {ZabranjeneIDs.Count - Zabranjene.Count} lose drzave!" : ".")}");
                }

                Zabranjene = await Context.Drzave.Include(p => p.PodrzaniDokumenti).Include(p => p.TrazeniLjudi).Where(q => q.TrazeniLjudi.Contains(p)).ToListAsync();
                if (Zabranjene.Count == 0) return BadRequest("Poternica mora vaziti barem za jednu drzavu.");

                foreach (Drzava dr in Zabranjene)
                {
                    if (dr.TrazeniLjudi == null) dr.TrazeniLjudi = new List<Poternica> { };
                    dr.TrazeniLjudi.Remove(p);
                    Context.Drzave.Update(dr);
                }

                p.Stroga = Stroga == "true" ? true : false;
                Zabranjene = await Context.Drzave.Include(p => p.PodrzaniDokumenti).Include(p => p.TrazeniLjudi).Where(q => ZabranjeneIDs.Contains(q.ID)).ToListAsync();
                p.ZabranjenUlazUDrzave = new List<Drzava>(Zabranjene);
                Context.Poternice.Update(p);
                foreach (Drzava dr in Zabranjene)
                {
                    if (dr.TrazeniLjudi == null) dr.TrazeniLjudi = new List<Poternica> { };
                    dr.TrazeniLjudi.Add(p);
                    Context.Drzave.Update(dr);
                }
                await Context.SaveChangesAsync();
                return Ok($"Uspesno azurirana poternica{(ZabranjeneIDs.Count - Zabranjene.Count != 0 ? $", od toga su {ZabranjeneIDs.Count - Zabranjene.Count} lose drzave!" : ".")}");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [Route("ObrisiPoternicu/{JMBG}")]
        [HttpDelete]
        public async Task<ActionResult> ObrisiPoternicu(string JMBG)
        {
            try
            {
                if (!Regex.IsMatch(JMBG, @"^[0-9]+$") || JMBG.Length != 13) return BadRequest("JMBG mora da se sastoji samo od 13 cifara");
                Poternica p = Context.Poternice.Include(p => p.ZabranjenUlazUDrzave).Where(p => p.JMBG == JMBG).FirstOrDefault();
                if (p == null) return BadRequest("Ne postoji poternica za taj JMBG.");
                Context.Poternice.Remove(p);
                foreach (Drzava dr in p.ZabranjenUlazUDrzave)
                {
                    dr.TrazeniLjudi.Remove(p);
                    Context.Drzave.Update(dr);
                }
                await Context.SaveChangesAsync();
                return Ok("Obrisana poternica!");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}