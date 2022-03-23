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
    public class DrzavaController : ControllerBase
    {

        public TravelContext Context { get; set; }

        public DrzavaController(TravelContext context)
        {
            Context = context;
        }

        [Route("Preuzmi")]
        [HttpGet]
        public async Task<ActionResult> Preuzmi()
        {
            try
            {
                return Ok(await Context.Drzave.Select(p => new
                {
                    ID = p.ID,
                    Naziv = p.Naziv,
                    TrazeniLjudi = p.TrazeniLjudi,
                    PodrzaniDokumenti = p.PodrzaniDokumenti
                }).ToListAsync());
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("SkloniDokument/{idDrzave}/{idDok}")]
        [HttpPut]
        public async Task<ActionResult> SkloniDokument(int idDrzave, int idDok)
        {
            try
            {
                var dok = await Context.Dokumenti.Include(p => p.PodrzaneDrzave).Where(p => p.ID == idDok).FirstOrDefaultAsync();
                if (dok == null)
                    return BadRequest("Nepostojeci tip dokumenta");
                var drz = await Context.Drzave.Include(p => p.PodrzaniDokumenti).Where(p => p.ID == idDrzave).FirstOrDefaultAsync();
                if (drz == null)
                    return BadRequest("Nepostojeca drzava");
                drz.PodrzaniDokumenti.Remove(dok);
                Context.Drzave.Update(drz);
                dok.PodrzaneDrzave.Remove(drz);
                Context.Dokumenti.Update(dok);
                await Context.SaveChangesAsync();
                return Ok("Sklonjen dokument");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [Route("SkloniPoternicu/{idDrzave}/{idPot}")]
        [HttpPut]
        public async Task<ActionResult> SkloniPoternicu(int idDrzave, int idPot)
        {
            try
            {
                var pot = await Context.Poternice.Include(p => p.ZabranjenUlazUDrzave).Where(p => p.ID == idPot).FirstOrDefaultAsync();
                if (pot == null)
                    return BadRequest("Nepostojeca poternica");
                var drz = await Context.Drzave.Include(p => p.TrazeniLjudi).Where(p => p.ID == idDrzave).FirstOrDefaultAsync();
                if (drz == null)
                    return BadRequest("Nepostojeca drzava");
                drz.TrazeniLjudi.Remove(pot);
                Context.Drzave.Update(drz);
                pot.ZabranjenUlazUDrzave.Remove(drz);
                Context.Poternice.Update(pot);
                await Context.SaveChangesAsync();
                return Ok("Sklonjena poternica");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
